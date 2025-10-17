import joblib
import os
from sklearn.pipeline import Pipeline  # Assuming the model is a pipeline
from constants.crisis_resources import CRISIS_RESOURCES
import numpy as np

class DiseasePredictor:
    def __init__(self):
        self.model = joblib.load(os.path.join("ml_models", "symptom_model.pkl"))  # Load the model
        self.escalation_threshold = float(os.environ.get("ESCALATION_CONFIDENCE", 0.6))

    def predict(self, symptoms: list[str], locale: str):
        # Placeholder: Use the model to predict
        prediction = self.model.predict([symptoms])  # Simplified; adapt as needed
        probabilities = self.model.predict_proba([symptoms])[0]
        disease = prediction[0]
        confidence = np.max(probabilities)
        
        flags = [flag for flag in ["depression", "anxiety", "insomnia", "suicidal_ideation", "ptsd", "substance_abuse"] if flag in disease]
        
        escalation = False
        if "suicidal_ideation" in flags and confidence >= self.escalation_threshold:
            escalation = True
            escalation_info = {
                "message": "We're here for you. Please seek help immediately.",
                "steps": "Call your local emergency services.",
                "resources": CRISIS_RESOURCES.get(locale, CRISIS_RESOURCES.get(os.environ.get("CRISIS_DEFAULT_COUNTRY")))
            }
        else:
            escalation_info = None
        
        return {
            "disease": disease,
            "confidence": confidence,
            "probabilities": dict(zip(self.model.classes_, probabilities)),
            "next_questions": self.get_next_questions(),  # From followup engine
            "flags": flags,
            "escalation": escalation,
            "escalation_info": escalation_info,
            "disclaimer": "This tool is not a substitute for professional medical care."
        }
    
    def get_next_questions(self):
        return [{"id": "q1", "text": "Do you have any other symptoms?"}]  # Static for now