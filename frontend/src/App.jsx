import { useState, useRef, useEffect } from "react";
import { useRecorder } from "./hooks/useRecorder";
import {
  processVoice,
  sendTextMessage,
  clearSession,
  playBase64Audio,
} from "./utils/api";
import { MessageBubble } from "./components/MessageBubble";
import { MicButton } from "./components/MicButton";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const messagesEndRef = useRef(null);

  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recError,
  } = useRecorder();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role, text, language) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), role, text, language },
    ]);

  const handleMicClick = async () => {
    if (isProcessing) return;

    if (isRecording) {
      setStatusMsg("Processing...");
      setIsProcessing(true);
      const blob = await stopRecording();
      if (!blob) return;

      try {
        setStatusMsg("Transcribing...");
        const result = await processVoice(blob, sessionId);

        if (result.error) {
          setStatusMsg(result.error);
          return;
        }

        if (!sessionId) setSessionId(result.session_id);
        addMessage("user", result.user_text, result.language);

        setStatusMsg("Generating response...");
        addMessage("assistant", result.ai_text, result.language);

        if (result.audio_base64) {
          setStatusMsg("Speaking...");
          await playBase64Audio(result.audio_base64);
        }
      } catch (err) {
        setStatusMsg(`Error: ${err.message}`);
      } finally {
        setIsProcessing(false);
        setStatusMsg("");
      }
    } else {
      await startRecording();
      setStatusMsg("Listening...");
    }
  };

  const handleTextSend = async () => {
    if (!textInput.trim() || isProcessing) return;

    const msg = textInput.trim();
    setTextInput("");
    setIsProcessing(true);
    setStatusMsg("Thinking...");
    addMessage("user", msg, null);

    try {
      const result = await sendTextMessage(msg, sessionId);
      if (!sessionId) setSessionId(result.session_id);
      addMessage("assistant", result.ai_text, result.language);

      if (result.audio_base64) {
        await playBase64Audio(result.audio_base64);
      }
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setStatusMsg("");
    }
  };

  const handleClear = async () => {
    if (sessionId) await clearSession(sessionId);
    setSessionId(null);
    setMessages([]);
    setStatusMsg("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-100/40 to-purple-100/40">
      
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">
            🎙 Voice AI Assistant
          </h1>
          <p className="text-xs text-gray-500">
            Speak in English or हिंदी
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Clear
          </button>
        )}
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="text-center mt-20 text-gray-400">
            <div className="text-6xl">🎤</div>
            <p className="mt-4 text-base">
              Press the mic button to start talking
            </p>
            <p className="text-sm">Supports English and Hindi</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            text={msg.text}
            language={msg.language}
          />
        ))}

        {statusMsg && (
          <div className="text-center text-gray-500 text-sm py-2">
            {statusMsg}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t px-4 py-3 w-full max-w-2xl mx-auto flex items-center gap-2">
        
        {/* Error */}
        {recError && (
          <p className="text-red-500 text-xs">{recError}</p>
        )}

        {/* Input */}
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
          placeholder="Type or use mic..."
          disabled={isProcessing || isRecording}
          className="flex-1 px-4 py-2 rounded-full border text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-indigo-300"
        />

        {/* Send */}
        <button
          onClick={handleTextSend}
          disabled={!textInput.trim() || isProcessing || isRecording}
          className={`px-4 py-2 rounded-full text-sm text-white transition
            ${
              !textInput.trim() || isProcessing
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
        >
          Send
        </button>

        {/* Mic */}
        <MicButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onClick={handleMicClick}
        />
      </footer>
    </div>
  );
}