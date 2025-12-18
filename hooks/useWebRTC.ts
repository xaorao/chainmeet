import { useEffect, useRef, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'

interface UseWebRTCReturn {
  remoteStream: MediaStream | null
  peerConnection: RTCPeerConnection | null
  connectionState: RTCPeerConnectionState | null
  iceConnectionState: RTCIceConnectionState | null
  initializePeer: (partnerId: string, initiator: boolean, localStream: MediaStream) => void
  closePeer: () => void
}

// ICE servers with TURN support from environment variables
const getICEServers = (): RTCIceServer[] => {
  const servers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ]

  // Add TURN server if configured
  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL
  const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME
  const turnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL

  if (turnUrl && turnUsername && turnCredential) {
    servers.push({
      urls: turnUrl,
      username: turnUsername,
      credential: turnCredential
    })
    console.log('TURN server configured:', turnUrl)
  } else {
    console.warn('No TURN server configured. Some users may have connectivity issues.')
  }

  return servers
}

export function useWebRTC(socket: Socket | null): UseWebRTCReturn {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | null>(null)
  const [iceConnectionState, setIceConnectionState] = useState<RTCIceConnectionState | null>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const partnerIdRef = useRef<string | null>(null)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const closePeer = useCallback(() => {
    // Clear timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
      connectionTimeoutRef.current = null
    }

    if (peerRef.current) {
      peerRef.current.ontrack = null
      peerRef.current.onicecandidate = null
      peerRef.current.onconnectionstatechange = null
      peerRef.current.oniceconnectionstatechange = null
      peerRef.current.close()
      peerRef.current = null
    }
    setRemoteStream(null)
    setConnectionState(null)
    setIceConnectionState(null)
    partnerIdRef.current = null
  }, [])

  const initializePeer = useCallback(async (partnerId: string, initiator: boolean, localStream: MediaStream) => {
    if (!socket) {
      console.error('Cannot initialize peer: socket not connected')
      return
    }

    closePeer()
    partnerIdRef.current = partnerId

    console.log(`Initializing Peer. Initiator: ${initiator}, Partner: ${partnerId}`)

    const iceServers = getICEServers()
    const pc = new RTCPeerConnection({ iceServers })
    peerRef.current = pc

    // Add local tracks
    localStream.getTracks().forEach(track => {
      console.log('Adding local track:', track.kind)
      pc.addTrack(track, localStream)
    })

    // Handle remote tracks
    pc.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind)
      if (event.streams[0]) {
        console.log('Setting remote stream')
        setRemoteStream(event.streams[0])
      }
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate')
        socket.emit('signal', {
          target: partnerId,
          type: 'candidate',
          candidate: event.candidate
        })
      }
    }

    // Track connection state
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState)
      setConnectionState(pc.connectionState)

      if (pc.connectionState === 'connected') {
        // Clear timeout on successful connection
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current)
          connectionTimeoutRef.current = null
        }
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState)
      setIceConnectionState(pc.iceConnectionState)
    }

    // Set connection timeout (30 seconds)
    connectionTimeoutRef.current = setTimeout(() => {
      if (peerRef.current && peerRef.current.connectionState !== 'connected') {
        console.error('Connection timeout - failed to connect within 30 seconds')
        setConnectionState('failed')
      }
    }, 30000)

    // Create and send offer (if initiator)
    if (initiator) {
      try {
        console.log('Creating offer...')
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        })
        await pc.setLocalDescription(offer)
        console.log('Sending offer to partner')
        socket.emit('signal', {
          target: partnerId,
          type: 'offer',
          sdp: offer
        })
      } catch (err) {
        console.error('Error creating offer:', err)
      }
    }
  }, [socket, closePeer])

  // Handle incoming signals
  useEffect(() => {
    if (!socket) return

    const handleSignal = async (data: { sender: string; type: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }) => {
      const pc = peerRef.current

      console.log('Signal received:', data.type, 'from:', data.sender)

      // Only process signals from our current partner
      if (data.sender !== partnerIdRef.current) {
        console.log('Ignoring signal from non-partner:', data.sender)
        return
      }

      if (!pc) {
        console.error('No peer connection available for signal')
        return
      }

      try {
        if (data.type === 'offer' && data.sdp) {
          console.log('Processing offer...')
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          console.log('Sending answer to partner')
          socket.emit('signal', {
            target: data.sender,
            type: 'answer',
            sdp: answer
          })
        } else if (data.type === 'answer' && data.sdp) {
          console.log('Processing answer...')
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        } else if (data.type === 'candidate' && data.candidate) {
          console.log('Processing ICE candidate...')
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        }
      } catch (err) {
        console.error('Error handling signal:', err)
      }
    }

    socket.on('signal', handleSignal)

    return () => {
      socket.off('signal', handleSignal)
    }
  }, [socket])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closePeer()
    }
  }, [closePeer])

  return {
    remoteStream,
    peerConnection: peerRef.current,
    connectionState,
    iceConnectionState,
    initializePeer,
    closePeer
  }
}

