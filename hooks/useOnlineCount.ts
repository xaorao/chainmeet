import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL || 'http://localhost:3001'

interface UseOnlineCountReturn {
    count: number | null
    isLoading: boolean
    error: Error | null
}

export function useOnlineCount(pollInterval: number = 30000): UseOnlineCountReturn {
    const [count, setCount] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchCount = async () => {
            try {
                const res = await fetch(`${API_URL}/health`)
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`)
                }
                const data = await res.json()
                if (isMounted) {
                    setCount(data.onlineCount ?? data.activeUsers ?? 0)
                    setError(null)
                }
            } catch (err) {
                console.error('Failed to fetch online count:', err)
                if (isMounted) {
                    setError(err as Error)
                    // Don't set count to null on error, keep last known value
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        // Initial fetch
        fetchCount()

        // Poll every interval
        const interval = setInterval(fetchCount, pollInterval)

        return () => {
            isMounted = false
            clearInterval(interval)
        }
    }, [pollInterval])

    return { count, isLoading, error }
}
