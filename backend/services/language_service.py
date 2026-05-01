from langdetect import detect, DetectorFactory
from langdetect.lang_detect_exception import LangDetectException

# Make language detection deterministic
DetectorFactory.seed = 42

# Whisper language name → ISO 639-1 code mapping
WHISPER_LANG_MAP = {
    "english": "en",
    "hindi": "hi",
    "en": "en",
    "hi": "hi",
}

SUPPORTED_LANGUAGES = {"en", "hi"}
DEFAULT_LANGUAGE = "en"


def normalize_language(lang: str) -> str:
    """Normalize various language identifiers to ISO 639-1 codes."""
    normalized = WHISPER_LANG_MAP.get(lang.lower(), lang.lower()[:2])
    return normalized if normalized in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE


def detect_language_from_text(text: str) -> str:
    """
    Detect language from text as a fallback / confirmation step.
    Returns 'en' or 'hi'.
    """
    try:
        detected = detect(text)
        return detected if detected in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE
    except LangDetectException:
        return DEFAULT_LANGUAGE


def resolve_language(whisper_lang: str, text: str) -> str:
    """
    Combine Whisper's detected language with text-based detection.
    Whisper is trusted first; text detection is a fallback for short clips.
    """
    lang = normalize_language(whisper_lang)
    if lang not in SUPPORTED_LANGUAGES:
        lang = detect_language_from_text(text)
    return lang
