import os
import requests  # For proxying to Gemini
from constants.crisis_resources import CRISIS_RESOURCES

escalation_keywords = ["suicide", "kill myself", "hurt myself"]  # Simple check

class ChatService:
    def handle_chat(message: str, conversation_id: str = None):
        for keyword in escalation_keywords:
            if keyword in message.lower():
                return {
                    "response": "I'm concerned about your safety. Please seek help immediately.",
                    "escalation": True,
                    "resources": CRISIS_RESOURCES.get(os.environ.get("CRISIS_DEFAULT_COUNTRY"))
                }
        
        # Proxy to Gemini
        gemini_api_key = os.environ.get("GEMINI_API_KEY")
        response = requests.post("https://api.gemini.com/v1/chat", json={"message": message}, headers={"Authorization": f"Bearer {gemini_api_key}"})
        return {"response": response.json().get("response")}
    
    # In-memory history (simple dict; not persistent)
    conversation_history = {}