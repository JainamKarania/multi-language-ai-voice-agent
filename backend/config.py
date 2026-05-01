from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    groq_api_key: str
    
    elevenlabs_api_key: Optional[str] = None
    elevenlabs_voice_id_en: str = "21m00Tcm4TlvDq8ikWAM"
    elevenlabs_voice_id_hi: str = "pNInz6obpgDQGcFmaJgB"
    
    groq_model: str = "llama-3.3-70b-versatile"
    whisper_model: str = "whisper-1"
    
    max_conversation_turns: int = 20
    debug: bool = False
    
    class Config:
        env_file = ".env"
        
settings = Settings()
    
     