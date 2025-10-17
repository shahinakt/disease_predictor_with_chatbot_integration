from fastapi import APIRouter, Depends
from services.disease_predictor import DiseasePredictor
from services.followup_engine import FollowupEngine

router = APIRouter()

@router.post("/predict")
def predict(symptoms: list[str], locale: str, predictor=Depends(DiseasePredictor)):
    return predictor.predict(symptoms, locale)

@router.post("/followup")
def followup(answers: dict, engine=Depends(FollowupEngine)):
    return engine.handle_followup(answers)