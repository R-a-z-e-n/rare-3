from __future__ import annotations

import json
from typing import Any

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from .config import Settings, get_settings
from .database import SessionLocal, get_db, init_db
from .models import AnalyticsEvent, Feedback, Product, Recommendation, SkinProfile
from .questionnaire import QUESTIONNAIRE
from .schemas import AnalysisResponse, FeedbackIn, ProductCreate, ProductOut, RecommendationOut
from .seed_data import ALL_SEED_PRODUCTS
from .services.llm_clients import build_fallback_analysis, call_deepseek, call_groq_ranker
from .services.ml_analyzer import analyse_face_image, get_skin_model_status, has_severe_condition
from .services.recommendation import (
    normalise_ingredient,
    pre_filter_catalog,
    product_to_dict,
    products_matching_ingredients,
    recommended_ingredient_bases,
    replace_recommendations,
    significant_change,
    validate_analysis_output,
)

app = FastAPI(title="RARE Face Analysis API")

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    with SessionLocal() as db:
        seed_products(db)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ml/status")
def ml_status(settings: Settings = Depends(get_settings)) -> dict[str, Any]:
    return get_skin_model_status(settings)


@app.get("/questionnaire")
def questionnaire() -> list[dict[str, Any]]:
    return QUESTIONNAIRE


@app.get("/products", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)) -> list[Product]:
    return db.query(Product).order_by(Product.product_id).all()


@app.post("/products", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> Product:
    existing = db.get(Product, payload.product_id)
    if existing:
        raise HTTPException(status_code=409, detail="product_id already exists")
    product = Product(
        product_id=payload.product_id,
        name=payload.Name,
        company=payload.Company,
        ingredients=payload.Ingredients,
        price=payload.price,
        category=payload.category,
        concerns_addressed=payload.concerns_addressed,
        is_sponsored=payload.is_sponsored,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    user_id: str = Form(...),
    answers: str = Form(...),
    consent: bool = Form(...),
    photo: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> AnalysisResponse:
    if not consent:
        raise HTTPException(status_code=400, detail="Consent is required before analysis.")

    try:
        user_profile = json.loads(answers)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail=f"answers must be valid JSON: {exc}") from exc

    db.add(AnalyticsEvent(user_id=user_id, event_name="analysis_started", payload={}))
    ml_result = await analyse_face_image(photo, settings)
    user_profile["ml_detections"] = ml_result
    db.add(AnalyticsEvent(user_id=user_id, event_name="ml_analysis_complete", payload={"model": ml_result.get("model")}))

    if has_severe_condition(ml_result):
        db.add(AnalyticsEvent(user_id=user_id, event_name="clinical_concern_detected", payload=ml_result))
        db.commit()
        return AnalysisResponse(
            status="clinical_concern_detected",
            ml_analysis=ml_result,
            message=(
                "Our scan detected an irregular texture that falls outside the scope of cosmetic skincare. "
                "We always prioritize your health over retail. Would you like us to connect you with a "
                "board-certified dermatologist?"
            ),
            dermatologist_cta=True,
        )

    products = db.query(Product).all()
    previous = db.get(SkinProfile, user_id)
    should_call_llm = significant_change(previous, user_profile)

    if not should_call_llm and previous:
        deepseek_output = previous.profile_data["deepseek_analysis"]
        ingredient_bases = [{"raw": item, "base": item} for item in previous.recommended_ingredients]
        filtered_products = pre_filter_catalog(user_profile, products)
        candidates = products_matching_ingredients(filtered_products, ingredient_bases)
        ranked = fallback_rank_from_previous(candidates, ingredient_bases)
        source_payload = {"mode": "stored_profile_reuse", "ingredient_bases": ingredient_bases}
        replace_recommendations(db, user_id, ranked, source_payload)
        previous.profile_data = {**previous.profile_data, "user_profile": user_profile}
        db.commit()
        return AnalysisResponse(
            status="success",
            ml_analysis=ml_result,
            deepseek_analysis=deepseek_output,
            recommendations=enrich_ranked_products(ranked, candidates),
            reused_profile=True,
        )

    filtered_products = pre_filter_catalog(user_profile, products)
    if not filtered_products:
        db.commit()
        return AnalysisResponse(
            status="no_suitable_products",
            ml_analysis=ml_result,
            message="We couldn't find products matching your budget and sensitivities.",
        )

    deepseek_payload = {
        "ml_detections": ml_result,
        "user_profile": user_profile,
        "treatment_history": latest_treatment_history(db, user_id),
        "product_catalog": [product_to_dict(product) for product in filtered_products],
    }
    if settings.debug_llm_payloads:
        db.add(AnalyticsEvent(user_id=user_id, event_name="debug_deepseek_payload", payload=deepseek_payload))
    db.add(AnalyticsEvent(user_id=user_id, event_name="llm_call_started", payload={"provider": "deepseek"}))
    try:
        deepseek_output = await call_deepseek(deepseek_payload, settings)
        validate_analysis_output(deepseek_output, user_profile, filtered_products)
    except Exception as exc:
        db.add(AnalyticsEvent(user_id=user_id, event_name="llm_call_failed", payload={"provider": "deepseek", "error": str(exc)}))
        deepseek_output = build_fallback_analysis({**deepseek_payload, "retry_reason": str(exc)})
    else:
        db.add(AnalyticsEvent(user_id=user_id, event_name="llm_call_success", payload={"provider": "deepseek"}))

    ingredient_bases = recommended_ingredient_bases(deepseek_output)
    candidate_products = products_matching_ingredients(filtered_products, ingredient_bases)
    if not candidate_products:
        return AnalysisResponse(
            status="no_matching_ingredients",
            ml_analysis=ml_result,
            deepseek_analysis=deepseek_output,
            message="No catalog products contain the recommended ingredients after safety filtering.",
        )

    groq_payload = {
        "user_profile": user_profile,
        "deepseek_analysis": deepseek_output,
        "recommended_ingredients": ingredient_bases,
        "candidate_products": [product_to_dict(product) for product in candidate_products],
    }
    if settings.debug_llm_payloads:
        db.add(AnalyticsEvent(user_id=user_id, event_name="debug_groq_payload", payload=groq_payload))
    db.add(AnalyticsEvent(user_id=user_id, event_name="llm_call_started", payload={"provider": "groq"}))
    try:
        groq_output = await call_groq_ranker(groq_payload, settings)
        ranked_products = sanitize_ranked_products(groq_output["ranked_products"], candidate_products)
    except Exception as exc:
        db.add(AnalyticsEvent(user_id=user_id, event_name="llm_call_failed", payload={"provider": "groq", "error": str(exc)}))
        ranked_products = fallback_rank_from_previous(candidate_products, ingredient_bases)
    else:
        db.add(AnalyticsEvent(user_id=user_id, event_name="llm_call_success", payload={"provider": "groq"}))

    profile_data = {
        "user_profile": user_profile,
        "deepseek_analysis": deepseek_output,
        "groq_ranking": ranked_products,
    }
    stored_ingredients = [item["base"] for item in ingredient_bases]
    if previous:
        previous.profile_data = profile_data
        previous.recommended_ingredients = stored_ingredients
    else:
        db.add(SkinProfile(user_id=user_id, profile_data=profile_data, recommended_ingredients=stored_ingredients))

    replace_recommendations(db, user_id, ranked_products, {"deepseek": deepseek_output, "groq": ranked_products})
    db.add(AnalyticsEvent(user_id=user_id, event_name="recommendation_viewed", payload={"count": len(ranked_products)}))
    db.commit()
    return AnalysisResponse(
        status="success",
        ml_analysis=ml_result,
        deepseek_analysis=deepseek_output,
        recommendations=enrich_ranked_products(ranked_products, candidate_products),
    )


@app.get("/recommendations/{user_id}", response_model=list[RecommendationOut])
def get_recommendations(user_id: str, db: Session = Depends(get_db)) -> list[Recommendation]:
    return (
        db.query(Recommendation)
        .options(joinedload(Recommendation.product))
        .filter(Recommendation.user_id == user_id)
        .order_by(Recommendation.rank)
        .all()
    )


@app.get("/debug/llm-payloads/{user_id}")
def get_debug_llm_payloads(user_id: str, db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    rows = (
        db.query(AnalyticsEvent)
        .filter(
            AnalyticsEvent.user_id == user_id,
            AnalyticsEvent.event_name.in_(["debug_deepseek_payload", "debug_groq_payload"]),
        )
        .order_by(AnalyticsEvent.created_at.desc())
        .limit(10)
        .all()
    )
    return [
        {
            "event_name": row.event_name,
            "created_at": row.created_at,
            "payload": row.payload,
        }
        for row in rows
    ]


@app.post("/feedback")
def submit_feedback(payload: FeedbackIn, db: Session = Depends(get_db)) -> dict[str, str]:
    effective = payload.ingredients if payload.feedback == "worked_well" else []
    ineffective = payload.ingredients if payload.feedback == "no_change" else []
    irritants = payload.ingredients if payload.feedback in {"made_worse", "caused_irritation"} else []
    db.add(
        Feedback(
            user_id=payload.user_id,
            product_id=payload.product_id,
            feedback=payload.feedback,
            effective_ingredients=effective,
            ineffective_ingredients=ineffective,
            irritants=irritants,
        )
    )
    db.commit()
    return {"status": "stored"}


@app.delete("/profiles/{user_id}")
def delete_profile(user_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    profile = db.get(SkinProfile, user_id)
    if profile:
        db.delete(profile)
    db.query(Feedback).filter(Feedback.user_id == user_id).delete()
    db.query(AnalyticsEvent).filter(AnalyticsEvent.user_id == user_id).delete()
    db.commit()
    return {"status": "deleted"}


def seed_products(db: Session) -> None:
    existing_ids = {row[0] for row in db.query(Product.product_id).all()}
    for item in ALL_SEED_PRODUCTS:
        if item["product_id"] not in existing_ids:
            db.add(Product(**item))
    db.commit()


def latest_treatment_history(db: Session, user_id: str) -> dict[str, list[str]]:
    rows = db.query(Feedback).filter(Feedback.user_id == user_id).order_by(Feedback.created_at.desc()).limit(20).all()
    return {
        "effective_ingredients": sorted({item for row in rows for item in row.effective_ingredients}),
        "ineffective_ingredients": sorted({item for row in rows for item in row.ineffective_ingredients}),
        "irritants": sorted({item for row in rows for item in row.irritants}),
    }


def fallback_rank_from_previous(products: list[Product], ingredient_bases: list[dict[str, str]]) -> list[dict[str, Any]]:
    targets = {item["base"] for item in ingredient_bases}

    def score(product: Product) -> tuple[int, int, float]:
        overlap = len({normalise_ingredient(ingredient) for ingredient in product.ingredients if normalise_ingredient(ingredient) in targets})
        return (overlap, int(product.is_sponsored), -product.price)

    ranked = sorted(products, key=score, reverse=True)[:4]
    response = []
    for index, product in enumerate(ranked):
        overlap = sorted({normalise_ingredient(ingredient) for ingredient in product.ingredients} & targets)
        response.append(
            {
                "product_id": product.product_id,
                "rank": index + 1,
                "reason": (
                    f"{product.name} contains {', '.join(overlap) or 'supportive ingredients'} "
                    "from your stored ingredient plan and fits the current safety filters."
                ),
            }
        )
    return response


def sanitize_ranked_products(ranked: list[dict[str, Any]], products: list[Product]) -> list[dict[str, Any]]:
    product_ids = {product.product_id for product in products}
    clean: list[dict[str, Any]] = []
    seen: set[str] = set()
    for item in ranked:
        product_id = item.get("product_id")
        if product_id not in product_ids or product_id in seen:
            continue
        seen.add(product_id)
        clean.append(
            {
                "product_id": product_id,
                "rank": len(clean) + 1,
                "reason": item.get("reason") or "Matched to the recommended ingredient plan.",
            }
        )
    if not clean:
        raise ValueError("Groq returned no usable products from the candidate list")
    return clean[:4]


def enrich_ranked_products(ranked: list[dict[str, Any]], products: list[Product]) -> list[dict[str, Any]]:
    by_id = {product.product_id: product_to_dict(product) for product in products}
    return [{**item, "product": by_id.get(item["product_id"])} for item in ranked]
