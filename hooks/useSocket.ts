import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL || 'http://localhost:3001'

interface ChatMessage {
  message: string
  from: string
}

interface UseSocketReturn {
  socket: Socket | null
  socketId: string | null
  isConnected: boolean
  isConnectError: boolean
  isSearching: boolean
  isMatched: boolean
  partnerId: string | null
  connect: () => void
  disconnect: () => void
  joinQueue: (role: string, interests: string[]) => void
  leaveQueue: () => void
  nextMatch: () => void
  sendChatMessage: (message: string) => void
  onChatMessage: (callback: (data: ChatMessage) => void) => void
  offChatMessage: (callback: (data: ChatMessage) => void) => void
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [socketId, setSocketId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnectError, setIsConnectError] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isMatched, setIsMatched] = useState(false)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    console.log('Connecting to socket server:', SOCKET_URL)

    const newSocket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      transports: ['websocket'],
      autoConnect: true
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setSocketId(newSocket.id || null)
      setIsConnected(true)
      setIsConnectError(false)
    })

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
      setIsSearching(false)
      setIsMatched(false)
      setPartnerId(null)
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setIsConnectError(true)
    })

    // Match found event
    newSocket.on('match_found', ({ partnerId: matchedPartnerId }) => {
      console.log('Match found! Partner:', matchedPartnerId)
      setIsSearching(false)
      setIsMatched(true)
      setPartnerId(matchedPartnerId)
    })

    // Searching event (added to queue)
    newSocket.on('searching', () => {
      console.log('Added to queue, searching for match...')
      setIsSearching(true)
      setIsMatched(false)
      setPartnerId(null)
    })

    // Partner disconnected event
    newSocket.on('partner_disconnected', () => {
      console.log('Partner disconnected')
      setIsMatched(false)
      setPartnerId(null)
    })

    // Error event
    newSocket.on('error', (data) => {
      console.error('Socket error:', data.message)
    })

    socketRef.current = newSocket
    setSocket(newSocket)
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setSocket(null)
      setSocketId(null)
      setIsConnected(false)
      setIsSearching(false)
      setIsMatched(false)
      setPartnerId(null)
    }
  }, [])

  const joinQueue = useCallback((role: string, interests: string[]) => {
    if (socketRef.current?.connected) {
      console.log('Joining queue with:', { role, interests })
      socketRef.current.emit('join_queue', { role, interests })
    }
  }, [])

  const leaveQueue = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('Leaving queue')
      socketRef.current.emit('leave_queue')
      setIsSearching(false)
    }
  }, [])

  const nextMatch = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('Requesting next match')
      socketRef.current.emit('next_match')
      setIsMatched(false)
      setPartnerId(null)
    }
  }, [])

  const sendChatMessage = useCallback((message: string) => {
    if (socketRef.current?.connected && partnerId) {
      console.log('Sending chat message to:', partnerId)
      socketRef.current.emit('chat_message', { message, to: partnerId })
    }
  }, [partnerId])

  const onChatMessage = useCallback((callback: (data: ChatMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.on('chat_message', callback)
    }
  }, [])

  const offChatMessage = useCallback((callback: (data: ChatMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.off('chat_message', callback)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return {
    socket,
    socketId,
    isConnected,
    isConnectError,
    isSearching,
    isMatched,
    partnerId,
    connect,
    disconnect,
    joinQueue,
    leaveQueue,
    nextMatch,
    sendChatMessage,
    onChatMessage,
    offChatMessage
  }
}

