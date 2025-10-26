from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os
from ..database import get_db

from ..services.disease_predictor import DiseasePredictor
from ..services.followup_engine import FollowupEngine

router = APIRouter()

# Initialize services
predictor = DiseasePredictor()
followup_engine = FollowupEngine()


@router.post("/predict/predict")
async def predict_disease(locale: str, db: Session = Depends(get_db)):
    """
    Predict disease based on comma-separated symptoms.
    Example: ?locale=fever,cough
    Returns detailed prediction including probabilities and follow-up suggestions.
    """
    try:
        # Split input into a list of symptoms and lowercase them
        input_symptoms = [s.strip().lower() for s in locale.split(",")]

        # Use the predictor service which performs filtering and returns rich info
        result = predictor.predict(input_symptoms, locale=os.environ.get("CRISIS_DEFAULT_COUNTRY", "US"))

        # Attach the original input and filtered list if available
        result.update({
            "input_symptoms": input_symptoms,
        })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict/followup")
async def handle_followup(payload: dict, db: Session = Depends(get_db)):
    """
    Accepts a payload with answers and previous prediction context.
    Example payload: { "answers": {...}, "flags": [...], "confidence": 0.8, "locale": "US" }
    """
    try:
        answers = payload.get("answers", {})
        context = {
            "flags": payload.get("flags", []),
            "confidence": payload.get("confidence", 0),
            "locale": payload.get("locale")
        }

        result = followup_engine.handle_followup({**answers, **context})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
