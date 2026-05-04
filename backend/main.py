import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import voice, chat, health

app = FastAPI(
    title="Multi-Language Voice AI Agent",
    description="Personal assistant supporting English and Hindi",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(voice.router, prefix="/api/voice")
app.include_router(chat.router, prefix="/api/chat")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
