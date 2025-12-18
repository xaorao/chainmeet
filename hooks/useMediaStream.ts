import { useState, useEffect, useCallback, useRef } from 'react'

export type MediaType = 'video' | 'audio'

interface UseMediaStreamReturn {
  stream: MediaStream | null
  error: Error | null
  isPending: boolean
  cameraEnabled: boolean
  micEnabled: boolean
  toggleCamera: () => void
  toggleMic: () => void
  resetMedia: () => void
  startVideo: () => Promise<void>
}

export function useMediaStream(): UseMediaStreamReturn {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const streamRef = useRef<MediaStream | null>(null)

  const startVideo = useCallback(async () => {
    setIsPending(true)
    setError(null)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            facingMode: 'user'
        },
        audio: true
      })
      
      streamRef.current = mediaStream
      setStream(mediaStream)
      setCameraEnabled(true)
      setMicEnabled(true)
    } catch (err: any) {
      console.error('Media Access Error:', err)
      setError(err)
    } finally {
      setIsPending(false)
    }
  }, [])

  const toggleCamera = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCameraEnabled(videoTrack.enabled)
      }
    }
  }, [])

  const toggleMic = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicEnabled(audioTrack.enabled)
      }
    }
  }, [])

  const resetMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  useEffect(() => {
    // Only cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return {
    stream,
    error,
    isPending,
    cameraEnabled,
    micEnabled,
    toggleCamera,
    toggleMic,
    resetMedia,
    startVideo
  }
}