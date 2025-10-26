import joblib
import os
import logging
from sklearn.pipeline import Pipeline  
from ..constants.crisis_resources import CRISIS_RESOURCES
import numpy as np

class DiseasePredictor:
    def __init__(self):
        # Resolve model path relative to this file so it works regardless of cwd
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "ml_models", "symptom_model.pkl")
        self.model = None
        try:
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
            else:
                logging.warning(f"Model file not found at {model_path}. Falling back to rule-based predictor.")
        except Exception as e:
            logging.exception(f"Failed to load model from {model_path}: {e}")

        self.escalation_threshold = float(os.environ.get("ESCALATION_CONFIDENCE", 0.6))

    def predict(self, symptoms: list[str], locale: str):
        # If model is available, use it. Otherwise use a simple rule-based fallback.
        if self.model is not None:
            try:
                prediction = self.model.predict([symptoms])  # Simplified; adapt as needed
                probabilities = self.model.predict_proba([symptoms])[0]
                disease = prediction[0]
                confidence = float(np.max(probabilities))
                probs_dict = dict(zip(getattr(self.model, 'classes_', []), probabilities))
            except Exception as e:
                logging.exception(f"Model prediction failed: {e}")
                # fall back to rule-based below
                disease = None
                confidence = 0.0
                probs_dict = {}
        else:
            disease = None
            confidence = 0.0
            probs_dict = {}

        # Simple rule-based fallback if model not present or failed
        if not disease:
            # very small heuristic mapping
            symptom_set = set([s.lower() for s in symptoms or []])
            heuristics = [
                ("flu", {"fever", "cough", "fatigue"}),
                ("common_cold", {"cough", "headache"}),
                ("covid-19", {"fever", "cough", "shortness_of_breath"}),
                ("depression", {"sadness", "persistent_sadness", "withdrawal_symptoms"}),
                ("anxiety", {"anxiety", "rapid_heartbeat"}),
                ("insomnia", {"insomnia", "nightmares"}),
            ]

            best_match = None
            best_score = 0
            for name, reqs in heuristics:
                score = len(symptom_set & reqs)
                if score > best_score:
                    best_score = score
                    best_match = name

            if best_match and best_score > 0:
                disease = best_match
                confidence = min(0.9, 0.3 + 0.2 * best_score)
                probs_dict = {disease: confidence}
            else:
                disease = "unknown"
                confidence = 0.0
                probs_dict = {"unknown": 1.0}
        
        flags = [flag for flag in ["depression", "anxiety", "insomnia", "suicidal_ideation", "ptsd", "substance_abuse"] if flag in (disease or "")]

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
            "confidence": float(confidence),
            "probabilities": probs_dict,
            "next_questions": self.get_next_questions(),  # From followup engine
            "flags": flags,
            "escalation": escalation,
            "escalation_info": escalation_info,
            "disclaimer": "This tool is not a substitute for professional medical care."
        }
    
    def get_next_questions(self):
        return [{"id": "q1", "text": "Do you have any other symptoms?"}]  # Static for now