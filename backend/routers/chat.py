import base64
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from services.language_service import detect_language_from_text
from services.ai_service import get_ai_response
from services.tts_service import text_to_speech
from utils.session_store import session_store

router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    language: str | None = None   # override auto-detection
    tts: bool = False              # whether to return audio


@router.post("/message")
async def chat_message(req: ChatRequest):
    """Text-based chat endpoint with optional TTS."""
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    language = req.language or detect_language_from_text(req.message)
    session = session_store.get_or_create(req.session_id)
    session.language = language

    ai_text = await get_ai_response(
        user_message=req.message,
        conversation_history=session.conversation_history,
        language=language,
    )

    session.add_turn(req.message, ai_text)

    result = {
        "session_id": session.session_id,
        "ai_text": ai_text,
        "language": language,
        "turn_count": len(session.conversation_history) // 2,
    }

    if req.tts:
        audio_bytes = await text_to_speech(ai_text, language)
        result["audio_base64"] = base64.b64encode(audio_bytes).decode("utf-8")

    return result


@router.get("/history/{session_id}")
async def get_history(session_id: str):
    """Return conversation history for a session."""
    session = session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or expired")
    return {
        "session_id": session_id,
        "language": session.language,
        "history": session.conversation_history,
        "turn_count": len(session.conversation_history) // 2,
    }
