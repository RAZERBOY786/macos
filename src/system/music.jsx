import { useEffect, useReducer } from 'react'

let state = {
  queue: [],
  qIndex: -1,
  playing: false,
  time: 0,
  dur: 0,
  volume: 0.7,
  shuffle: false,
  repeat: false,
}

const current = () => state.queue[state.qIndex] || null
const listeners = new Set()
const isHttp = (u) => typeof u === 'string' && /^https?:\/\//.test(u)

const audio = typeof document !== 'undefined' ? new Audio() : null
if (audio) {
  audio.preload = 'metadata'
  const attach = () => document.body?.appendChild(audio)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach)
  else attach()
}

const set = (patch) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

function applyTrack() {
  const t = current()
  if (!t) return
  if (isHttp(t.src)) {
    if (audio.getAttribute('src') !== t.src) audio.src = t.src
    audio.volume = state.volume
  } else {
    audio.pause()
    set({ playing: false })
  }
}

function step(canPlay = false) {
  const n = state.queue.length
  if (!n) return
  let i = state.shuffle ? Math.floor(Math.random() * n) : (state.qIndex + 1) % n
  if (i === state.qIndex && n > 1) i = (i + 1) % n
  set({ qIndex: i, time: 0, dur: 0 })
  applyTrack()
  if (canPlay && !state.repeat) audio.play().catch(() => {})
}

if (audio) {
  audio.addEventListener('timeupdate', () => set({ time: audio.currentTime || 0 }))
  audio.addEventListener('loadedmetadata', () => {
    if (isFinite(audio.duration) && audio.duration > 0) set({ dur: audio.duration })
  })
  audio.addEventListener('ended', () => {
    if (state.repeat) {
      audio.currentTime = 0
      audio.play().catch(() => {})
      set({ time: 0 })
    } else step(true)
  })
  audio.addEventListener('error', () => {
    if (state.queue.length > 1) step(true)
  })
}

export function play(list, index = 0, shuffle = false) {
  if (!list || !list.length) return
  set({ queue: list, qIndex: index, shuffle, time: 0, dur: 0, playing: true })
  applyTrack()
  audio.play().catch(() => {})
}

export function playTrack(t, list) {
  const src = list || state.queue
  const idx = src.findIndex((x) => x.id === t.id)
  if (idx < 0) return
  play(src, idx)
}

export function toggle() {
  if (!current()) return
  if (state.playing) {
    audio.pause()
    set({ playing: false })
  } else {
    set({ playing: true })
    audio.play().catch(() => {})
  }
}

export function next() {
  step(false)
  if (!state.playing) audio.play().catch(() => {})
}

export function prev() {
  const n = state.queue.length
  if (!n) return
  const i = (state.qIndex - 1 + n) % n
  set({ qIndex: i, time: 0, dur: 0 })
  applyTrack()
}

export function seek(v) {
  if (current() && audio) audio.currentTime = v
  set({ time: v })
}

export function setVolume(v) {
  if (audio) audio.volume = v
  set({ volume: v })
}

export const setShuffle = (v) => set({ shuffle: v })
export const setRepeat = (v) => set({ repeat: v })

export function useMusic() {
  const [, force] = useReducer((x) => x + 1, 0)
  useEffect(() => {
    listeners.add(force)
    return () => listeners.delete(force)
  }, [])
  return state
}

export function TrackArt({ t, size = 46, className = '' }) {
  const style = t?.art
    ? { background: `center/cover no-repeat url("${t.art}")` }
    : { background: `linear-gradient(135deg, ${t?.color || '#888'}, rgba(0,0,0,0.35))` }
  return <div className={className} style={{ ...style, width: size, height: size, flex: 'none' }} />
}

export const fmt = (s) => {
  if (!isFinite(s) || s < 0) s = 0
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}