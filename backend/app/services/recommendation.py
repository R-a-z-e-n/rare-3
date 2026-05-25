from __future__ import annotations

import re
from typing import Any

from sqlalchemy.orm import Session

from ..models import Product, Recommendation, SkinProfile

BUDGET_LIMITS = {
    "under_500": 500,
    "500_to_1500": 1500,
    "1500_to_3000": 3000,
    "3000_plus": 999999,
}

TRIGGER_SYNONYMS = {
    "fragrance": {"fragrance", "parfum", "perfume"},
    "essential_oils": {"essential_oils", "lavender_oil", "tea_tree_oil", "peppermint_oil"},
    "sulphates": {"sulphates", "sulfates", "sodium_lauryl_sulfate", "sls"},
    "alcohol": {"alcohol", "denatured_alcohol", "ethanol"},
    "ahas_bhas": {"glycolic_acid", "lactic_acid", "salicylic_acid", "aha", "bha"},
    "retinol": {"retinol", "retinal", "retinoid"},
}

FUNGAL_BLACKLIST = {
    "coconut_oil",
    "argan_oil",
    "olive_oil",
    "fatty_acids",
    "squalane",
    "isopropyl_myristate",
    "oleic_acid",
    "ester",
}


def normalise_ingredient(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"\([^)]*\)", "", value)
    value = value.replace("%", "")
    value = re.sub(r"[^a-z0-9]+", "_", value)
    return value.strip("_")


def base_ingredient(value: str) -> str:
    cleaned = normalise_ingredient(value)
    aliases = {
        "niacinamide_5_10": "niacinamide",
        "vitamin_c_10_15": "vitamin_c",
        "azelaic_acid_10": "azelaic_acid",
        "salicylic_acid_0_5_2": "salicylic_acid",
        "retinol_0_1_0_3": "retinol",
    }
    return aliases.get(cleaned, cleaned)


def product_to_dict(product: Product) -> dict[str, Any]:
    return {
        "product_id": product.product_id,
        "name": product.name,
        "company": product.company,
        "ingredients": [normalise_ingredient(item) for item in product.ingredients],
        "price": product.price,
        "category": product.category,
        "concerns_addressed": product.concerns_addressed,
        "is_sponsored": product.is_sponsored,
    }


def expand_synonyms(triggers: list[str]) -> set[str]:
    expanded: set[str] = set()
    for trigger in triggers:
        key = normalise_ingredient(trigger)
        expanded.add(key)
        expanded.update(TRIGGER_SYNONYMS.get(key, set()))
    expanded.discard("none")
    return expanded


def pre_filter_catalog(user_profile: dict[str, Any], products: list[Product]) -> list[Product]:
    habits = user_profile.get("habits", {})
    sensitivity = user_profile.get("sensitivity", {})
    acne = user_profile.get("acne", {})
    max_price = BUDGET_LIMITS.get(habits.get("monthly_budget_inr"), 999999)
    triggers = expand_synonyms(sensitivity.get("known_triggers", []))

    filtered: list[Product] = []
    for product in products:
        ingredients = {normalise_ingredient(item) for item in product.ingredients}
        if product.price > max_price:
            continue
        if ingredients & triggers:
            continue
        if "tiny_flesh_coloured_bumps" in acne.get("acne_type", []) and ingredients & FUNGAL_BLACKLIST:
            continue
        filtered.append(product)

    concerns = set(user_profile.get("ml_detections", {}).get("conditions_detected", []))
    concerns.add(habits.get("primary_concern", ""))
    filtered.sort(
        key=lambda product: (
            len(set(product.concerns_addressed) & concerns),
            int(product.is_sponsored),
            -product.price,
        ),
        reverse=True,
    )
    return filtered[:50]


def flatten_questionnaire(profile: dict[str, Any]) -> dict[str, Any]:
    flattened: dict[str, Any] = {}

    def walk(prefix: str, value: Any) -> None:
        if isinstance(value, dict):
            for key, child in value.items():
                walk(f"{prefix}.{key}" if prefix else key, child)
        else:
            flattened[prefix] = value

    for key in ("profile", "skin_type", "acne", "pigmentation_texture", "sensitivity", "habits"):
        walk(key, profile.get(key, {}))
    return flattened


def significant_change(previous: SkinProfile | None, new_profile: dict[str, Any]) -> bool:
    if previous is None:
        return True
    old_profile = previous.profile_data.get("user_profile", {})
    old_primary = old_profile.get("habits", {}).get("primary_concern")
    new_primary = new_profile.get("habits", {}).get("primary_concern")
    if old_primary != new_primary:
        return True

    old_flat = flatten_questionnaire(old_profile)
    new_flat = flatten_questionnaire(new_profile)
    changed = sum(1 for key, value in new_flat.items() if old_flat.get(key) != value)
    return changed >= 6


def recommended_ingredient_bases(deepseek_output: dict[str, Any]) -> list[dict[str, str]]:
    ingredients = deepseek_output.get("recommended_ingredients", [])
    return [
        {"raw": item.get("ingredient", ""), "base": base_ingredient(item.get("ingredient", ""))}
        for item in ingredients
        if item.get("ingredient")
    ]


def products_matching_ingredients(products: list[Product], ingredient_bases: list[dict[str, str]]) -> list[Product]:
    targets = {item["base"] for item in ingredient_bases}
    matched = [
        product
        for product in products
        if {normalise_ingredient(item) for item in product.ingredients} & targets
    ]
    return matched


def validate_analysis_output(output: dict[str, Any], user_profile: dict[str, Any], sent_catalog: list[Product]) -> None:
    required = {"skin_summary", "detected_concerns", "recommended_ingredients"}
    missing = required - output.keys()
    if missing:
        raise ValueError(f"DeepSeek output missing fields: {', '.join(sorted(missing))}")
    if len(output.get("detected_concerns", [])) < 2:
        raise ValueError("DeepSeek output should contain at least 2 concerns")
    if user_profile.get("sensitivity", {}).get("diagnosed_conditions"):
        conditions = [c for c in user_profile["sensitivity"].get("diagnosed_conditions", []) if c != "none"]
        if conditions and not output.get("disclaimer"):
            raise ValueError("Diagnosed conditions require a disclaimer")
    if user_profile.get("habits", {}).get("primary_concern") == "dark_spots_pigmentation":
        ingredient_bases = recommended_ingredient_bases(output)
        matched = products_matching_ingredients(sent_catalog, ingredient_bases)
        if not any(product.category == "sunscreen" for product in matched):
            raise ValueError("Pigmentation recommendations must have a matching sunscreen candidate")


def replace_recommendations(
    db: Session,
    user_id: str,
    ranked_products: list[dict[str, Any]],
    source_payload: dict[str, Any],
) -> None:
    db.query(Recommendation).filter(Recommendation.user_id == user_id).delete()
    for item in ranked_products:
        db.add(
            Recommendation(
                user_id=user_id,
                product_id=item["product_id"],
                rank=int(item["rank"]),
                reason=item["reason"],
                source_payload=source_payload,
            )
        )
