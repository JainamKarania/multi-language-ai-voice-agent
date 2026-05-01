from dataclasses import dataclass, field
from datetime import datetime, timedelta
import uuid

SESSION_TTL_MINUTES = 60


@dataclass
class Session:
    session_id: str
    language: str = "en"
    conversation_history: list = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_active: datetime = field(default_factory=datetime.utcnow)

    def add_turn(self, user_message: str, assistant_message: str):
        self.conversation_history.append({"role": "user", "content": user_message})
        self.conversation_history.append({"role": "assistant", "content": assistant_message})
        self.last_active = datetime.utcnow()

    def is_expired(self) -> bool:
        return datetime.utcnow() - self.last_active > timedelta(minutes=SESSION_TTL_MINUTES)


class SessionStore:
    def __init__(self):
        self._sessions: dict[str, Session] = {}

    def create_session(self) -> Session:
        session_id = str(uuid.uuid4())
        session = Session(session_id=session_id)
        self._sessions[session_id] = session
        return session

    def get_session(self, session_id: str) -> Session | None:
        session = self._sessions.get(session_id)
        if session and session.is_expired():
            del self._sessions[session_id]
            return None
        return session

    def get_or_create(self, session_id: str | None) -> Session:
        if session_id:
            session = self.get_session(session_id)
            if session:
                return session
        return self.create_session()

    def clear_session(self, session_id: str):
        self._sessions.pop(session_id, None)

    def cleanup_expired(self):
        expired = [sid for sid, s in self._sessions.items() if s.is_expired()]
        for sid in expired:
            del self._sessions[sid]


# Singleton store
session_store = SessionStore()
