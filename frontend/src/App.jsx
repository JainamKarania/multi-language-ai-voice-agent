import { useState, useRef, useEffect } from 'react'
import { useRecorder } from './hooks/useRecorder'
import { processVoice, sendTextMessage, clearSession, playBase64Audio } from './utils/api'
import { MessageBubble } from './components/MessageBubble'
import { MicButton } from './components/MicButton'

export default function App() {
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const messagesEndRef = useRef(null)
  const { isRecording, startRecording, stopRecording, error: recError } = useRecorder()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (role, text, language) =>
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role, text, language }])

  const handleMicClick = async () => {
    if (isProcessing) return

    if (isRecording) {
      setStatusMsg('Processing…')
      setIsProcessing(true)
      const blob = await stopRecording()
      if (!blob) { setIsProcessing(false); setStatusMsg(''); return }

      try {
        setStatusMsg('Transcribing…')
        const result = await processVoice(blob, sessionId)

        if (result.error) { setStatusMsg(result.error); setIsProcessing(false); return }

        if (!sessionId) setSessionId(result.session_id)
        addMessage('user', result.user_text, result.language)

        setStatusMsg('Generating response…')
        addMessage('assistant', result.ai_text, result.language)

        if (result.audio_base64) {
          setStatusMsg('Speaking…')
          await playBase64Audio(result.audio_base64)
        }
      } catch (err) {
        setStatusMsg(`Error: ${err.message}`)
      } finally {
        setIsProcessing(false)
        setStatusMsg('')
      }
    } else {
      await startRecording()
      setStatusMsg('Listening…')
    }
  }

  const handleTextSend = async () => {
    if (!textInput.trim() || isProcessing) return
    const msg = textInput.trim()
    setTextInput('')
    setIsProcessing(true)
    setStatusMsg('Thinking…')
    addMessage('user', msg, null)

    try {
      const result = await sendTextMessage(msg, sessionId)
      if (!sessionId) setSessionId(result.session_id)
      addMessage('assistant', result.ai_text, result.language)
      if (result.audio_base64) await playBase64Audio(result.audio_base64)
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`)
    } finally {
      setIsProcessing(false)
      setStatusMsg('')
    }
  }

  const handleClear = async () => {
    if (sessionId) await clearSession(sessionId)
    setSessionId(null)
    setMessages([])
    setStatusMsg('')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 20px', background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#1a1a1a' }}>
            🎙 Voice AI Assistant
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: '#888' }}>
            Speak in English or हिंदी
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd',
            background: '#fff', cursor: 'pointer', fontSize: 13, color: '#666',
          }}>
            Clear chat
          </button>
        )}
      </header>

      {/* Messages */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px', maxWidth: 720, width: '100%', margin: '0 auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 80, color: '#aaa' }}>
            <div style={{ fontSize: 64 }}>🎤</div>
            <p style={{ marginTop: 16, fontSize: 16 }}>
              Press the mic button to start talking
            </p>
            <p style={{ fontSize: 13 }}>Supports English and Hindi</p>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} role={msg.role} text={msg.text} language={msg.language} />
        ))}
        {statusMsg && (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 13, padding: '8px 0' }}>
            {statusMsg}
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input bar */}
      <footer style={{
        background: '#fff', borderTop: '1px solid #eee',
        padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center',
        maxWidth: 720, width: '100%', margin: '0 auto', boxSizing: 'border-box',
        width: '100%',
      }}>
        {recError && <p style={{ color: '#e74c3c', fontSize: 12 }}>{recError}</p>}
        <input
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleTextSend()}
          placeholder="Type a message or press the mic…"
          disabled={isProcessing || isRecording}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 24, border: '1px solid #ddd',
            fontSize: 15, outline: 'none', background: '#fafafa',
          }}
        />
        <button
          onClick={handleTextSend}
          disabled={!textInput.trim() || isProcessing || isRecording}
          style={{
            padding: '10px 18px', borderRadius: 24, border: 'none',
            background: '#6c63ff', color: '#fff', fontSize: 14, cursor: 'pointer',
            opacity: (!textInput.trim() || isProcessing) ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          Send
        </button>
        <MicButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onClick={handleMicClick}
        />
      </footer>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.4), 0 0 0 8px rgba(231,76,60,0.2); }
          70% { box-shadow: 0 0 0 10px rgba(231,76,60,0), 0 0 0 20px rgba(231,76,60,0); }
          100% { box-shadow: 0 0 0 0 rgba(231,76,60,0), 0 0 0 8px rgba(231,76,60,0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  )
}
