from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Groq
    groq_api_key: str

    # OpenAI (for Whisper STT)
    # openai_api_key: str

    # ElevenLabs TTS (optional — falls back to gTTS if not set)
    elevenlabs_api_key: Optional[str] = None
    elevenlabs_voice_id_en: str = "21m00Tcm4TlvDq8ikWAM"   # Rachel (English)
    elevenlabs_voice_id_hi: str = "pNInz6obpgDQGcFmaJgB"   # Adam (works for Hindi)

    # Model
    groq_model: str = "llama-3.3-70b-versatile"
    whisper_model: str = "whisper-1"

    # App
    max_conversation_turns: int = 20
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
