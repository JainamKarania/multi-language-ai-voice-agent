const BASE = '/api'

export async function processVoice(audioBlob, sessionId) {
  const form = new FormData()
  const ext = audioBlob.type.includes('mp4') ? 'mp4' : audioBlob.type.includes('ogg') ? 'ogg' : 'webm'
  form.append('audio', audioBlob, `recording.${ext}`)
  if (sessionId) form.append('session_id', sessionId)

  const res = await fetch(`${BASE}/voice/process`, { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Voice processing failed')
  }
  return res.json()
}

export async function sendTextMessage(message, sessionId, language = null) {
  const res = await fetch(`${BASE}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId, language, tts: true }),
  })
  if (!res.ok) throw new Error('Chat failed')
  return res.json()
}

export async function clearSession(sessionId) {
  await fetch(`${BASE}/voice/session/${sessionId}`, { method: 'DELETE' })
}

export function playBase64Audio(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const blob = new Blob([bytes], { type: 'audio/mpeg' })
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  audio.onended = () => URL.revokeObjectURL(url)
  return audio.play()
}
