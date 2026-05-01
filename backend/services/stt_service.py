import whisper
import tempfile, os

model = whisper.load_model("base")  # or "small", "medium"

async def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> dict:
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name
    try:
        result = model.transcribe(tmp_path, task="transcribe", fp16=False)
        return {
            "text": result["text"].strip(),
            "language": result.get("language", "en"),
        }
    finally:
        os.unlink(tmp_path)