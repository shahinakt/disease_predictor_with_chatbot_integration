from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.chat_service import ChatService

router = APIRouter()


class ChatRequest(BaseModel):
	message: str
	conversation_id: str | None = None


@router.post("/ask")
def ask_chat(req: ChatRequest):
	try:
		result = ChatService.handle_chat(req.message, req.conversation_id)
		return result
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))