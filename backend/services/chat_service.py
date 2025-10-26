import os
from ..constants.crisis_resources import CRISIS_RESOURCES

escalation_keywords = ["suicide", "kill myself", "hurt myself"]  # Simple check


class ChatService:
    # In-memory history (simple dict; not persistent)
    conversation_history = {}

    @staticmethod
    def _generate_offline_reply(message: str) -> str:
        """Very small rule-based responder for offline use.

        This intentionally keeps responses brief and focused on app usage/help.
        """
        m = (message or "").lower()
        if any(g in m for g in ["hi", "hello", "hey"]):
            return "Hi — I'm your local assistant. Ask me how to use the Symptom Checker, Mental Tests, or where to find reports."
        if "symptom" in m or "predict" in m or "prediction" in m:
            return "To run a symptom prediction, open the Symptom Checker page, enter symptoms, and press Check — results are shown on screen and saved to Dashboard as 'Last prediction'."
        if "mental" in m or "test" in m or "phq" in m or "gad" in m:
            return "Mental tests (PHQ-9, GAD-7, MDQ, ISI, WHO-5, DASS-21, C-SSRS, AUDIT) are available under the 'Mental Tests' page. Results are saved locally in your browser."
        if "history" in m or "last" in m or "previous" in m:
            return "Your most recent test and prediction are stored locally — open Dashboard to view 'Last prediction' and last mental test. You can export history from the History page (not yet implemented)."
        if "help" in m or "how" in m:
            return "You can ask me where to find features in the app (Symptom Checker, Reports, Mental Tests), or type a short question about symptoms and the app will guide you to the appropriate page." 
        # Default fallback
        return "I don't have internet access to call an LLM. I can help you navigate the app and explain built-in features. Try: 'How do I run a symptom check?' or 'Where are mental tests?'."

    @staticmethod
    def handle_chat(message: str, conversation_id: str = None):
        # Resolve crisis resources safely
        country = os.environ.get("CRISIS_DEFAULT_COUNTRY")
        crisis_info = CRISIS_RESOURCES.get(country) if country else None
        if not crisis_info:
            crisis_info = next(iter(CRISIS_RESOURCES.values())) if CRISIS_RESOURCES else None

        # Escalation detection
        for keyword in escalation_keywords:
            if keyword in (message or "").lower():
                return {
                    "response": "I'm concerned about your safety. Please seek help immediately.",
                    "escalation": True,
                    "resources": crisis_info,
                }

        # Generate an offline reply
        reply = ChatService._generate_offline_reply(message)
        return {"response": reply, "escalation": False}