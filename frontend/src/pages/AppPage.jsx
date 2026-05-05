import { useState, useRef, useEffect } from "react";
import { useRecorder } from "../hooks/useRecorder";
import {
  processVoice,
  sendTextMessage,
  clearSession,
  playBase64Audio,
} from "../utils/api";
import { MessageBubble } from "../components/MessageBubble";
import { MicButton } from "../components/MicButton";
import { InputBar } from "../components/InputBar";
import { ChatArea } from "../components/ChatArea";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export default function AppPage() {
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
  <div className="h-screen flex bg-[#0f172a] text-white">

    <Sidebar />

    <div className="flex flex-col flex-1">

      {/* Back Button */}
      <div className="px-4 py-2 text-xs text-gray-400">
        <Link to="/">← Home</Link>
      </div>

      <Topbar />

      <ChatArea
        messages={messages}
        statusMsg={statusMsg}
        messagesEndRef={messagesEndRef}
      />

      <InputBar
        textInput={textInput}
        setTextInput={setTextInput}
        onSend={handleTextSend}
        isProcessing={isProcessing}
        isRecording={isRecording}
        onMicClick={handleMicClick}
      />

    </div>
  </div>
);
}