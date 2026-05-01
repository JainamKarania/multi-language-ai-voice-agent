from groq import AsyncGroq
from config import settings

client = AsyncGroq(api_key=settings.groq_api_key)

SYSTEM_PROMPTS = {
    "en": """You are a helpful, friendly personal assistant.
- Respond concisely and naturally, as this will be converted to speech.
- Avoid markdown, bullet points, or special characters in your responses.
- Keep responses under 3 sentences unless the user asks for detailed information.
- You can switch languages naturally if the user speaks in a different language.""",

    "hi": """आप एक सहायक और मित्रवत व्यक्तिगत सहायक हैं।
- स्वाभाविक और संक्षिप्त रूप से जवाब दें, क्योंकि यह वाणी में बदला जाएगा।
- अपने जवाब में markdown, बुलेट पॉइंट या विशेष चिह्न न इस्तेमाल करें।
- जब तक उपयोगकर्ता विस्तार न मांगे, 3 वाक्यों में जवाब दें।
- यदि उपयोगकर्ता अंग्रेज़ी में बात करे तो उसी भाषा में जवाब दें।"""
}

async def get_ai_response(user_message, conversation_history, language="en"):
    system = SYSTEM_PROMPTS.get(language, SYSTEM_PROMPTS["en"])
    messages = conversation_history[-20:] + [{"role": "user", "content": user_message}]

    response = await client.chat.completions.create(
        model=settings.groq_model,
        messages=[{"role": "system", "content": system}] + messages,
        max_tokens=512,
    )
    return response.choices[0].message.content