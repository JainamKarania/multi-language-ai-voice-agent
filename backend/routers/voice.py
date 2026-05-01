import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from services.stt_service import transcribe_audio
from services.language_service import resolve_language
from services.ai_service import get_ai_response
from services.tts_service import text_to_speech
from utils.session_store import session_store

import traceback
router = APIRouter(tags=["voice"])
@router.post("/process")
async def process_voice(
    audio: UploadFile = File(...),
    session_id: str = Form(default=None),
):
    try:
        # Read audio
        audio_bytes = await audio.read()
        print(f"[DEBUG] Audio received: {len(audio_bytes)} bytes, type: {audio.content_type}, filename: {audio.filename}")
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio file")

        # STT
        print("[DEBUG] Starting transcription...")
        stt_result = await transcribe_audio(audio_bytes, filename=audio.filename or "audio.webm")
        print(f"[DEBUG] Transcription result: {stt_result}")

        user_text = stt_result["text"]
        if not user_text:
            return JSONResponse({"error": "Could not understand audio", "session_id": session_id})

        # Language
        language = resolve_language(stt_result["language"], user_text)
        print(f"[DEBUG] Detected language: {language}")

        # Session
        session = session_store.get_or_create(session_id)
        session.language = language

        # AI
        print("[DEBUG] Calling AI...")
        ai_text = await get_ai_response(
            user_message=user_text,
            conversation_history=session.conversation_history,
            language=language,
        )
        print(f"[DEBUG] AI response: {ai_text[:100]}")

        session.add_turn(user_text, ai_text)

        # TTS
        print("[DEBUG] Calling TTS...")
        audio_response = await text_to_speech(ai_text, language)
        audio_b64 = base64.b64encode(audio_response).decode("utf-8") if audio_response else None

        return {
            "session_id": session.session_id,
            "user_text": user_text,
            "ai_text": ai_text,
            "language": language,
            "audio_base64": audio_b64,
            "turn_count": len(session.conversation_history) // 2,
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()   # prints full stack trace
        raise HTTPException(status_code=500, detail=str(e))
