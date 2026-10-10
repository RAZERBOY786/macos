/**
 * sound.js — tiny synthesized system sounds via the Web Audio API.
 * No audio files required. Respects the system volume + mute + sound toggle.
 */
import { getState } from './store.js'

let ctx = null

function ac() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function enabled() {
  const { soundOn, muted, volume } = getState()
  return soundOn && !muted && volume > 0
}

function tone({ freq = 440, dur = 0.09, type = 'sine', gain = 0.2, sweep = 0, delay = 0 }) {
  const c = ac()
  if (!c) return
  const vol = getState().volume
  const t = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + sweep), t + dur)
  const peak = gain * vol
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export const sound = {
  /** Prime the audio context on the first user gesture. */
  unlock() {
    ac()
  },
  click() {
    if (!enabled()) return
    tone({ freq: 1800, dur: 0.04, type: 'triangle', gain: 0.08, sweep: -400 })
  },
  tick() {
    if (!enabled()) return
    tone({ freq: 1100, dur: 0.02, type: 'square', gain: 0.03 })
  },
  open() {
    if (!enabled()) return
    tone({ freq: 520, dur: 0.12, type: 'sine', gain: 0.12, sweep: 260 })
  },
  close() {
    if (!enabled()) return
    tone({ freq: 620, dur: 0.12, type: 'sine', gain: 0.1, sweep: -320 })
  },
  minimize() {
    if (!enabled()) return
    tone({ freq: 900, dur: 0.16, type: 'sine', gain: 0.08, sweep: -600 })
  },
  trash() {
    if (!enabled()) return
    tone({ freq: 240, dur: 0.16, type: 'sawtooth', gain: 0.1, sweep: -120 })
    tone({ freq: 320, dur: 0.14, type: 'triangle', gain: 0.06, sweep: -160, delay: 0.06 })
  },
  error() {
    if (!enabled()) return
    tone({ freq: 220, dur: 0.18, type: 'square', gain: 0.12 })
    tone({ freq: 180, dur: 0.2, type: 'square', gain: 0.12, delay: 0.05 })
  },
  notify() {
    if (!enabled()) return
    tone({ freq: 880, dur: 0.1, type: 'sine', gain: 0.14 })
    tone({ freq: 1320, dur: 0.14, type: 'sine', gain: 0.12, delay: 0.09 })
  },
  /** Startup chime — a warm rising chord. */
  chime() {
    if (!enabled()) return
    tone({ freq: 261.6, dur: 1.1, type: 'sine', gain: 0.14 })
    tone({ freq: 329.6, dur: 1.1, type: 'sine', gain: 0.12, delay: 0.02 })
    tone({ freq: 392.0, dur: 1.2, type: 'sine', gain: 0.12, delay: 0.04 })
    tone({ freq: 523.3, dur: 1.3, type: 'sine', gain: 0.1, delay: 0.09 })
  },
}

export default sound
