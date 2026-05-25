from __future__ import annotations

import json
from typing import Any

import httpx

from ..config import Settings
from ..prompts import DEEPSEEK_SYSTEM_PROMPT, GROQ_SYSTEM_PROMPT


async def call_deepseek(payload: dict[str, Any], settings: Settings) -> dict[str, Any]:
    if not settings.deepseek_api_key:
        return build_fallback_analysis(payload)

    async with httpx.AsyncClient(base_url=settings.deepseek_base_url, timeout=45) as client:
        response = await client.post(
            "/chat/completions",
            headers={"Authorization": f"Bearer {settings.deepseek_api_key}"},
            json={
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "system", "content": DEEPSEEK_SYSTEM_PROMPT},
                    {"role": "user", "content": json.dumps(payload, ensure_ascii=False)},
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.2,
            },
        )
        response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    return json.loads(content)


async def call_groq_ranker(payload: dict[str, Any], settings: Settings) -> dict[str, Any]:
    if not settings.groq_api_key:
        return build_fallback_ranking(payload)

    async with httpx.AsyncClient(base_url=settings.groq_base_url, timeout=45) as client:
        response = await client.post(
            "/chat/completions",
            headers={"Authorization": f"Bearer {settings.groq_api_key}"},
            json={
                "model": settings.groq_model,
                "messages": [
                    {"role": "system", "content": GROQ_SYSTEM_PROMPT},
                    {"role": "user", "content": json.dumps(payload, ensure_ascii=False)},
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.25,
            },
        )
        response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    return json.loads(content)


def build_fallback_analysis(payload: dict[str, Any]) -> dict[str, Any]:
    profile = payload["user_profile"]
    habits = profile.get("habits", {})
    acne = profile.get("acne", {})
    pigmentation = profile.get("pigmentation_texture", {})
    sensitivity = profile.get("sensitivity", {})
    primary = habits.get("primary_concern", "skin_balance")

    concern_plan = {
        "acne_breakouts": [("acne", "salicylic_acid (0.5-2%)"), ("oiliness_shine", "niacinamide (5-10%)"), ("barrier_support", "panthenol")],
        "dark_spots_pigmentation": [("dark_spots_pigmentation", "azelaic_acid (10%)"), ("dullness_glow", "vitamin_c (10-15%)"), ("uv_protection", "zinc_oxide")],
        "dryness_dehydration": [("dryness_dehydration", "hyaluronic_acid"), ("barrier_support", "ceramides"), ("sensitivity", "panthenol")],
        "oiliness_shine": [("oiliness_shine", "niacinamide (5-10%)"), ("acne", "salicylic_acid (0.5-2%)"), ("texture", "green_tea")],
        "dullness_glow": [("dullness_glow", "vitamin_c (10-15%)"), ("hydration", "hyaluronic_acid"), ("uv_protection", "zinc_oxide")],
        "anti_ageing_fine_lines": [("anti_ageing_fine_lines", "retinol (0.1-0.3%)"), ("barrier_support", "ceramides"), ("uv_protection", "zinc_oxide")],
        "sensitive_reactive": [("sensitive_reactive", "ceramides"), ("barrier_support", "panthenol"), ("redness", "azelaic_acid (10%)")],
    }
    selected = concern_plan.get(primary, concern_plan["dullness_glow"])

    if "tiny_flesh_coloured_bumps" in acne.get("acne_type", []):
        selected = [item for item in selected if item[1].split()[0] not in {"retinol"}]
        selected.insert(0, ("fungal_acne_signal", "azelaic_acid (10%)"))
    if pigmentation.get("dark_spots") in {"very_noticeable", "a_few_spots"} and primary != "dark_spots_pigmentation":
        selected.append(("dark_spots_pigmentation", "niacinamide (5-10%)"))

    detected_concerns = [
        {
            "concern": concern,
            "severity": "moderate" if index == 0 else "mild",
            "source": "questionnaire",
            "explanation": f"Prioritised from the user's answers and primary concern: {primary}.",
        }
        for index, (concern, _) in enumerate(selected[:4])
    ]

    return {
        "skin_summary": {
            "skin_type": profile.get("skin_type", {}).get("post_wash_feel", "not_specified"),
            "overall_health": "Cosmetic profile generated from questionnaire and image signals.",
            "primary_concern": primary,
        },
        "detected_concerns": detected_concerns,
        "recommended_ingredients": [
            {
                "ingredient": ingredient,
                "why": f"Useful for {concern.replace('_', ' ')} while matching the submitted profile.",
                "targets_concern": [concern],
            }
            for concern, ingredient in selected[:5]
        ],
        "disclaimer": (
            "Because you selected a diagnosed skin condition, consult a dermatologist before starting new actives."
            if [c for c in sensitivity.get("diagnosed_conditions", []) if c != "none"]
            else None
        ),
    }


def build_fallback_ranking(payload: dict[str, Any]) -> dict[str, Any]:
    products = payload["candidate_products"]
    ingredients = {item["base"] for item in payload["recommended_ingredients"]}

    def score(product: dict[str, Any]) -> tuple[int, float]:
        overlap = len(set(product["ingredients"]) & ingredients)
        sponsored = 1 if product.get("is_sponsored") else 0
        return (overlap + sponsored, -float(product["price"]))

    ranked = sorted(products, key=score, reverse=True)[:4]
    return {
        "ranked_products": [
            {
                "product_id": product["product_id"],
                "rank": index + 1,
                "reason": (
                    f"{product['name']} matches your profile because it includes "
                    f"{', '.join(sorted(set(product['ingredients']) & ingredients)) or 'supportive ingredients'} "
                    "from the recommended ingredient plan and stays within your selected budget."
                ),
            }
            for index, product in enumerate(ranked)
        ]
    }
