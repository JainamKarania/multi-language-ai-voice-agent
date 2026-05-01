import { useState, useRef, useCallback } from 'react'

const MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', 'audio/mp4']

function getSupportedMimeType() {
  return MIME_TYPES.find(type => MediaRecorder.isTypeSupported(type)) || ''
}

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = getSupportedMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.start(250) // collect chunks every 250ms
      setIsRecording(true)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        resolve(null)
        return
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        chunksRef.current = []
        streamRef.current?.getTracks().forEach(t => t.stop())
        setIsRecording(false)
        resolve(blob)
      }

      recorder.stop()
    })
  }, [])

  return { isRecording, startRecording, stopRecording, error }
}
