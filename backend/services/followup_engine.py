from ..constants.crisis_resources import CRISIS_RESOURCES

class FollowupEngine:
    def handle_followup(self, answers: dict):
        # Logic to update prediction based on answers
        # Use feature importances or static list for next questions
        next_questions = [{"id": "q2", "text": "How long have you had this symptom?"}]
        
        # Check for escalation
        if "suicidal_ideation" in answers.get("flags", []) and answers.get("confidence", 0) >= float(os.environ.get("ESCALATION_CONFIDENCE")):
            return {
                "escalation": True,
                "escalation_info": {
                    "message": "This seems serious. Please contact help.",
                    "steps": "Seek immediate assistance.",
                    "resources": CRISIS_RESOURCES.get(answers.get("locale"), CRISIS_RESOURCES.get(os.environ.get("CRISIS_DEFAULT_COUNTRY")))
                },
                "next_questions": [],
                "disclaimer": "Not a substitute for professional care."
            }
        
        return {"updated_prediction": "Updated based on answers", "next_questions": next_questions}