import os
import io
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import keras

# --- THE MAGIC LINE: Force Keras to match the model's bfloat16 data type ---
keras.mixed_precision.set_global_policy("mixed_bfloat16")

# Import the custom layer registration function from your services folder
from app.services.keras_custom_layers import get_custom_objects

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_skin_model = None

def load_model():
    global _skin_model
    if _skin_model is None:
        print("Loading Model with your custom layers & mixed precision...")
        
        # Grab the custom objects dictionary
        custom_objs = get_custom_objects()
        
        # Load the model with custom components
        _skin_model = keras.models.load_model(
            "model.keras", 
            custom_objects=custom_objs,
            compile=False
        )
        print("Model loaded successfully!")
    return _skin_model

def analyze_photo(image_bytes: bytes):
    model = load_model()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((512, 512))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)[0]

    class_labels = [
        "acne", "actinic_keratosis", "basal_cell_carcinoma",
        "dermatofibroma", "melanoma", "nevus",
        "pigmented_benign_keratosis", "seborrheic_keratosis",
        "squamous_cell_carcinoma", "vascular_lesion"
    ]

    detected = []
    confidence_scores = {}

    for idx, prob in enumerate(predictions):
        if prob > 0.20:
            condition = class_labels[idx]
            detected.append(condition)
            confidence_scores[condition] = float(prob)

    return {
        "conditions_detected": detected,
        "confidence_scores": confidence_scores
    }

@app.post("/analyze")
async def process_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    results = analyze_photo(image_bytes)
    return results