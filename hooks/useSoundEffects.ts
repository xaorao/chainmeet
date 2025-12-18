import { useState, useEffect, useCallback } from 'react'

interface UseSoundEffectsReturn {
    playMatch: () => void
    playMessage: () => void
    playDisconnect: () => void
    playClick: () => void
    isMuted: boolean
    toggleMute: () => void
}

export function useSoundEffects(): UseSoundEffectsReturn {
    const [isMuted, setIsMuted] = useState(false)
    const [sounds, setSounds] = useState<{
        match: HTMLAudioElement | null
        message: HTMLAudioElement | null
        disconnect: HTMLAudioElement | null
        click: HTMLAudioElement | null
    }>({ match: null, message: null, disconnect: null, click: null })

    useEffect(() => {
        // Create audio elements with Web Audio API fallback
        if (typeof window !== 'undefined') {
            // Use data URIs for simple sounds (no external files needed)
            const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine'): HTMLAudioElement => {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                const oscillator = audioContext.createOscillator()
                const gainNode = audioContext.createGain()

                oscillator.connect(gainNode)
                gainNode.connect(audioContext.destination)

                oscillator.frequency.value = frequency
                oscillator.type = type

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

                // Create a dummy audio element that triggers the sound
                const audio = new Audio()
                    ; (audio as any)._play = () => {
                        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
                        const osc = ctx.createOscillator()
                        const gain = ctx.createGain()
                        osc.connect(gain)
                        gain.connect(ctx.destination)
                        osc.frequency.value = frequency
                        osc.type = type
                        gain.gain.setValueAtTime(0.3, ctx.currentTime)
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
                        osc.start(ctx.currentTime)
                        osc.stop(ctx.currentTime + duration)
                    }
                return audio
            }

            setSounds({
                match: createBeep(880, 0.3, 'sine'),      // High pitch for match
                message: createBeep(440, 0.1, 'sine'),    // Medium pitch for message
                disconnect: createBeep(220, 0.5, 'sawtooth'), // Low pitch for disconnect
                click: createBeep(1000, 0.05, 'square'),  // Quick click
            })
        }
    }, [])

    const playSound = useCallback((sound: HTMLAudioElement | null) => {
        if (sound && !isMuted) {
            try {
                if ((sound as any)._play) {
                    (sound as any)._play()
                } else {
                    sound.currentTime = 0
                    sound.play().catch(() => { })
                }
            } catch (e) {
                // Ignore audio errors
            }
        }
    }, [isMuted])

    return {
        playMatch: useCallback(() => playSound(sounds.match), [playSound, sounds.match]),
        playMessage: useCallback(() => playSound(sounds.message), [playSound, sounds.message]),
        playDisconnect: useCallback(() => playSound(sounds.disconnect), [playSound, sounds.disconnect]),
        playClick: useCallback(() => playSound(sounds.click), [playSound, sounds.click]),
        isMuted,
        toggleMute: useCallback(() => setIsMuted(m => !m), [])
    }
}
