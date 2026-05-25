from __future__ import annotations

import io
import os
import time
from pathlib import Path
from threading import Lock
from typing import Any

import httpx
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool

from ..config import Settings

SEVERE_LABELS = {
    "melanoma",
    "basal_cell_carcinoma",
    "basal cell carcinoma",
    "squamous_cell_carcinoma",
    "squamous cell carcinoma",
    "psoriasis_severe",
    "actinic_keratosis",
    "acitinic keratosis",
    "actinic keratosis",
}

ARKO_CLASS_NAMES = [
    "actinic_keratosis",
    "basal_cell_carcinoma",
    "dermatofibroma",
    "nevus",
    "pigmented_benign_keratosis",
    "seborrheic_keratosis",
    "squamous_cell_carcinoma",
    "vascular_lesion",
]

_local_model: Any | None = None
_local_model_path: Path | None = None
_local_model_load_error: str | None = None
_local_model_lock = Lock()


def normalise_label(value: str) -> str:
    return value.strip().lower().replace("-", "_").replace(" ", "_")


def has_severe_condition(ml_result: dict[str, Any]) -> bool:
    labels = ml_result.get("conditions_detected", [])
    return any(normalise_label(label) in {normalise_label(item) for item in SEVERE_LABELS} for label in labels)


async def analyse_face_image(file: UploadFile | None, settings: Settings) -> dict[str, Any]:
    if file is None:
        return {
            "conditions_detected": ["cosmetic_profile_from_questionnaire"],
            "confidence_scores": {"cosmetic_profile_from_questionnaire": 1.0},
            "model": "questionnaire_only",
        }

    content = await file.read()
    if not content:
        return {
            "conditions_detected": ["cosmetic_profile_from_questionnaire"],
            "confidence_scores": {"cosmetic_profile_from_questionnaire": 1.0},
            "model": "empty_upload_fallback",
        }

    model_source = settings.skin_model_source.lower().strip()
    if settings.use_real_skin_model and model_source == "api":
        return await _call_skin_model_api(
            content=content,
            filename=file.filename,
            content_type=file.content_type,
            settings=settings,
        )

    if settings.use_real_skin_model:
        return await run_in_threadpool(_run_local_skin_model, content, settings)

    # Development fallback: verify the image is readable, but avoid storing or logging it.
    try:
        from PIL import Image
    except ImportError as exc:
        return {
            "conditions_detected": ["image_received_unverified"],
            "confidence_scores": {"image_received_unverified": 0.5},
            "warning": f"Install pillow to inspect uploaded images: {exc}",
            "model": "local_fallback",
        }

    image = Image.open(io.BytesIO(content))
    width, height = image.size
    return {
        "conditions_detected": ["image_quality_accepted", "skin_texture"],
        "confidence_scores": {"image_quality_accepted": 0.99, "skin_texture": 0.55},
        "image_meta": {"width": width, "height": height},
        "model": "local_fallback",
    }


def get_skin_model_status(settings: Settings) -> dict[str, Any]:
    model_path = _resolve_model_path(settings.skin_model_path)
    return {
        "enabled": settings.use_real_skin_model,
        "source": settings.skin_model_source,
        "path": str(model_path),
        "exists": model_path.exists(),
        "loaded": _local_model is not None,
        "load_error": _local_model_load_error,
        "input_size": settings.skin_model_input_size,
        "backend": settings.skin_model_backend,
        "api_url_configured": bool(settings.skin_model_api_url),
    }


def _resolve_model_path(configured_path: str) -> Path:
    path = Path(configured_path)
    if path.is_absolute():
        return path

    cwd_path = Path.cwd() / path
    if cwd_path.exists():
        return cwd_path

    backend_root = Path(__file__).resolve().parents[2]
    return backend_root / path


def _run_local_skin_model(content: bytes, settings: Settings) -> dict[str, Any]:
    global _local_model_load_error

    start = time.perf_counter()
    model_path = _resolve_model_path(settings.skin_model_path)
    if not model_path.exists():
        return {
            "conditions_detected": ["skin_model_file_missing"],
            "confidence_scores": {"skin_model_file_missing": 1.0},
            "warning": f"Model file not found at {model_path}.",
            "model": "local_model_fallback",
        }

    try:
        model = _get_local_model(model_path, settings.skin_model_backend)
        image_array = _prepare_image(content, settings.skin_model_input_size)
        prediction = model.predict(image_array, verbose=0)
        scores = _prediction_scores(prediction)
    except Exception as exc:
        _local_model_load_error = str(exc)
        return {
            "conditions_detected": ["skin_model_runtime_error"],
            "confidence_scores": {"skin_model_runtime_error": 1.0},
            "warning": f"Local skin model failed: {exc}",
            "model": "local_model_fallback",
        }

    labels = _labels_for_scores(scores)
    ranked = sorted(zip(labels, scores, strict=True), key=lambda item: item[1], reverse=True)
    detected = [
        label
        for label, score in ranked
        if score >= settings.skin_model_confidence_threshold
    ][:3]
    if not detected and ranked:
        detected = [ranked[0][0]]

    return {
        "conditions_detected": detected,
        "confidence_scores": {label: round(float(score), 4) for label, score in ranked[:5]},
        "model": "Arko007/skin-disease-detector-ai",
        "model_source": "local_model.keras",
        "inference_ms": round((time.perf_counter() - start) * 1000, 2),
    }


def _get_local_model(model_path: Path, backend: str) -> Any:
    global _local_model, _local_model_load_error, _local_model_path

    with _local_model_lock:
        if _local_model is not None and _local_model_path == model_path:
            return _local_model

        os.environ.setdefault("KERAS_BACKEND", backend)
        import keras

        from .keras_custom_layers import get_custom_objects

        _local_model = keras.saving.load_model(
            str(model_path),
            custom_objects=get_custom_objects(),
            compile=False,
            safe_mode=False,
        )
        _local_model_path = model_path
        _local_model_load_error = None
        return _local_model


def _prepare_image(content: bytes, input_size: int) -> Any:
    import numpy as np
    from PIL import Image, ImageOps

    image = Image.open(io.BytesIO(content))
    image = ImageOps.exif_transpose(image).convert("RGB")
    image = image.resize((input_size, input_size))
    return np.expand_dims(np.asarray(image, dtype="float32") / 255.0, axis=0)


def _prediction_scores(prediction: Any) -> list[float]:
    import numpy as np

    scores = np.asarray(prediction)
    if scores.ndim > 1:
        scores = scores[0]
    scores = scores.astype("float32")

    if scores.min() < 0 or scores.max() > 1.0 or not np.isclose(scores.sum(), 1.0, atol=0.05):
        exp_scores = np.exp(scores - scores.max())
        scores = exp_scores / exp_scores.sum()

    return scores.tolist()


def _labels_for_scores(scores: list[float]) -> list[str]:
    if len(scores) == len(ARKO_CLASS_NAMES):
        return ARKO_CLASS_NAMES
    return [f"class_{index}" for index in range(len(scores))]


async def _call_skin_model_api(
    content: bytes,
    filename: str | None,
    content_type: str | None,
    settings: Settings,
) -> dict[str, Any]:
    if not settings.skin_model_api_url:
        return {
            "conditions_detected": ["skin_model_api_not_configured"],
            "confidence_scores": {"skin_model_api_not_configured": 1.0},
            "warning": "Set SKIN_MODEL_API_URL to your Railway model endpoint.",
            "model": "api_fallback",
        }

    try:
        async with httpx.AsyncClient(timeout=settings.skin_model_api_timeout) as client:
            response = await client.post(
                settings.skin_model_api_url,
                files={
                    "file": (
                        filename or "face.jpg",
                        content,
                        content_type or "application/octet-stream",
                    )
                },
            )
            response.raise_for_status()
            payload = response.json()
    except Exception as exc:
        return {
            "conditions_detected": ["skin_model_api_error"],
            "confidence_scores": {"skin_model_api_error": 1.0},
            "warning": f"Skin model API call failed: {exc}",
            "model": "api_fallback",
        }

    return _normalise_model_api_response(payload)


def _normalise_model_api_response(payload: Any) -> dict[str, Any]:
    if isinstance(payload, dict) and "conditions_detected" in payload and "confidence_scores" in payload:
        return {**payload, "model": payload.get("model", "railway_skin_model_api")}

    if isinstance(payload, list):
        confidence_scores = {
            normalise_label(str(item.get("label", "unknown"))): float(item.get("score", 0))
            for item in payload
            if isinstance(item, dict)
        }
        ranked = sorted(confidence_scores.items(), key=lambda item: item[1], reverse=True)
        return {
            "conditions_detected": [label for label, score in ranked if score >= 0.20][:3],
            "confidence_scores": dict(ranked[:5]),
            "model": "railway_skin_model_api",
            "raw_response": payload,
        }

    if isinstance(payload, dict) and "predictions" in payload:
        return _normalise_model_api_response(payload["predictions"])

    return {
        "conditions_detected": ["skin_model_api_unrecognised_response"],
        "confidence_scores": {"skin_model_api_unrecognised_response": 1.0},
        "model": "railway_skin_model_api",
        "raw_response": payload,
    }
