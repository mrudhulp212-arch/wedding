import { useEffect, useRef, useState } from 'react'

// An original, gentle waltz, synthesized locally without external audio files.
const bars = [
  [48, [64, 67, 72, 71, 67, 64]],
  [45, [64, 69, 72, 76, 72, 69]],
  [53, [65, 69, 72, 74, 72, 69]],
  [43, [67, 71, 74, 72, 71, 67]],
  [48, [64, 67, 72, 76, 74, 72]],
  [45, [69, 72, 76, 79, 76, 72]],
  [53, [69, 72, 77, 76, 74, 72]],
  [43, [67, 71, 74, 71, 67, 62]],
]

export default function WeddingMusic() {
  const player = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    let disposed = false
    const start = async () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext || disposed) return
      try {
        if (!player.current) {
          const context = new AudioContext()
          const master = context.createGain()
          master.gain.value = 0.16
          master.connect(context.destination)
          const note = (pitch, time, duration, volume) => {
            const envelope = context.createGain()
            envelope.gain.setValueAtTime(0, time)
            envelope.gain.linearRampToValueAtTime(volume, time + 0.025)
            envelope.gain.exponentialRampToValueAtTime(0.001, time + duration)
            envelope.connect(master)
            for (const [multiple, strength] of [[1, 1], [2, 0.24], [3, 0.06]]) {
              const oscillator = context.createOscillator()
              const harmonic = context.createGain()
              oscillator.frequency.value = 440 * 2 ** ((pitch - 69) / 12) * multiple
              harmonic.gain.value = strength
              oscillator.connect(harmonic).connect(envelope)
              oscillator.start(time)
              oscillator.stop(time + duration + 0.05)
              oscillator.onended = () => { oscillator.disconnect(); harmonic.disconnect() }
            }
            window.setTimeout(() => envelope.disconnect(), Math.max(0, (time + duration + 0.2 - context.currentTime) * 1000))
          }
          let next = 0
          let bar = 0
          const schedule = () => {
            if (context.state !== 'running') return
            if (next < context.currentTime) next = context.currentTime + 0.1
            while (next < context.currentTime + 1) {
              const [bass, melody] = bars[bar % bars.length]
              note(bass, next, 2.8, 0.32)
              note(bass + 12, next + 1, 1.7, 0.12)
              melody.forEach((pitch, i) => note(pitch, next + i * 0.5, 1.8, 0.23))
              next += 3
              bar += 1
            }
          }
          player.current = { context, timer: window.setInterval(schedule, 250), schedule }
        }
        await player.current.context.resume()
        if (!disposed && player.current.context.state === 'running') {
          player.current.schedule()
          setPlaying(true)
          window.removeEventListener('pointerdown', start)
          window.removeEventListener('touchend', start)
          window.removeEventListener('keydown', start)
        }
      } catch {
        // The visible control remains available when autoplay is blocked.
      }
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('touchend', start, { passive: true })
    window.addEventListener('keydown', start)
    start()
    return () => {
      disposed = true
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('touchend', start)
      window.removeEventListener('keydown', start)
      if (player.current) {
        window.clearInterval(player.current.timer)
        player.current.context.close()
        player.current = null
      }
    }
  }, [])

  const toggle = async () => {
    const audio = player.current
    if (!audio) return
    try {
      if (audio.context.state === 'running') {
        await audio.context.suspend()
        setPlaying(false)
      } else {
        await audio.context.resume()
        audio.schedule()
        setPlaying(audio.context.state === 'running')
      }
    } catch { setPlaying(false) }
  }

  return (
    <button className="music-toggle" type="button" onPointerDown={event => event.stopPropagation()} onTouchEnd={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause romantic music' : 'Play romantic music'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {playing ? <><path d="M9 5v14M15 5v14" /></> : <><path d="M9 18V5l11-2v13M9 8l11-2" /><ellipse cx="6" cy="18" rx="3" ry="2" /><ellipse cx="17" cy="16" rx="3" ry="2" /></>}
      </svg>
    </button>
  )
}
