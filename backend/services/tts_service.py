import io
import httpx
from gtts import gTTS
from config import settings


async def synthesize_elevenlabs(text: str, language: str) -> bytes:
    """Synthesize speech using ElevenLabs API."""
    voice_id = (
        settings.elevenlabs_voice_id_hi
        if language == "hi"
        else settings.elevenlabs_voice_id_en
    )

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": settings.elevenlabs_api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.3,
            "use_speaker_boost": True,
        },
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.content


def synthesize_gtts(text: str, language: str) -> bytes:
    """Synthesize speech using gTTS (free fallback)."""
    lang_code = "hi" if language == "hi" else "en"
    tts = gTTS(text=text, lang=lang_code, slow=False)
    audio_buffer = io.BytesIO()
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)
    return audio_buffer.read()


async def text_to_speech(text: str, language: str = "en") -> bytes:
    """
    Convert text to speech.
    Uses ElevenLabs if API key is set, otherwise falls back to gTTS.
    """
    if not text.strip():
        return b""

    if settings.elevenlabs_api_key:
        try:
            return await synthesize_elevenlabs(text, language)
        except Exception as e:
            print(f"ElevenLabs TTS failed, falling back to gTTS: {e}")

    return synthesize_gtts(text, language)
