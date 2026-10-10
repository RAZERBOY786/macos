import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function Music() {
  const tracks = profile.tracks
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const audioRef = useRef(null)
  const track = tracks[index]

  /* Real audio when a src is provided, otherwise a simulated clock. */
  useEffect(() => {
    const audio = audioRef.current
    if (audio && track.src) {
      if (audio.getAttribute('src') !== track.src) audio.src = track.src
      audio.volume = volume
      if (playing) audio.play().catch(() => {})
      else audio.pause()
    }
  }, [playing, index, track.src, volume])

  useEffect(() => {
    if (!playing || track.src) return
    const id = setInterval(() => {
      setTime((t) => {
        if (t + 1 >= track.duration) {
          if (repeat) return 0
          next(true)
          return 0
        }
        return t + 1
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, repeat, track.src])

  const play = (i = index) => {
    setIndex(i)
    setTime(0)
    setPlaying(true)
  }
  const next = (auto = false) => {
    let n = shuffle ? Math.floor(Math.random() * tracks.length) : (index + 1) % tracks.length
    if (n === index && tracks.length > 1) n = (n + 1) % tracks.length
    setIndex(n)
    setTime(0)
    if (auto && !repeat) setPlaying(true)
  }
  const prev = () => {
    setIndex((i) => (i - 1 + tracks.length) % tracks.length)
    setTime(0)
  }

  return (
    <div className="music">
      <audio ref={audioRef} />
      <div className="music__side">
        <div className="sidebar__section">Library</div>
        {[
          ['Listen Now', 'play'],
          ['Browse', 'grid'],
          ['Radio', 'bolt'],
        ].map(([n, ic]) => (
          <div key={n} className={`sidebar__item ${n === 'Listen Now' ? 'active' : ''}`}>
            <span className="ic" style={{ color: 'var(--pink)' }}>
              <Icon name={ic} size={15} />
            </span>
            {n}
          </div>
        ))}
        <div className="sidebar__section">Playlists</div>
        <div className="sidebar__item">
          <span className="ic" style={{ color: 'var(--purple)' }}>
            <Icon name="music" size={15} />
          </span>
          Focus Mix
        </div>
      </div>

      <div className="music__main">
        <div className="music__body">
          <h2 style={{ margin: '0 0 18px' }}>Made for You</h2>
          <div className="album-grid">
            {tracks.map((t, i) => (
              <div key={t.id} className="album" onDoubleClick={() => play(i)} onClick={() => setIndex(i)}>
                <div className="album__art" style={{ background: `linear-gradient(135deg, ${t.color}, rgba(0,0,0,0.35))` }}>
                  {playing && i === index ? <Icon name="pause" size={26} color="#fff" /> : <Icon name="music" size={26} color="#fff" />}
                </div>
                <b>{t.title}</b>
                <span>{t.artist}</span>
              </div>
            ))}
          </div>

          <h2 style={{ margin: '26px 0 12px' }}>Up Next</h2>
          <div>
            {tracks.map((t, i) => (
              <div
                key={t.id}
                className="setting-row"
                style={{ cursor: 'pointer', background: i === index ? 'rgba(0,0,0,0.04)' : 'transparent' }}
                onClick={() => play(i)}
              >
                <div className="info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 5, background: `linear-gradient(135deg, ${t.color}, rgba(0,0,0,0.3))` }} />
                  <div>
                    <b>{t.title}</b>
                    <span>{t.artist}</span>
                  </div>
                </div>
                <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{fmt(t.duration)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="player">
          <div className="player__now">
            <span className="player__art" style={{ background: `linear-gradient(135deg, ${track.color}, rgba(0,0,0,0.35))` }} />
            <div style={{ lineHeight: 1.25, minWidth: 0 }}>
              <b style={{ fontSize: 12.5, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</b>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{track.artist}</span>
            </div>
          </div>

          <div className="player__controls">
            <button className="playbtn" onClick={() => setShuffle((s) => !s)} style={{ opacity: shuffle ? 1 : 0.5 }}>
              <Icon name="shuffle" size={16} />
            </button>
            <button className="playbtn" onClick={prev}>
              <Icon name="skipBack" size={18} />
            </button>
            <button className="playbtn big" onClick={() => setPlaying((p) => !p)}>
              <Icon name={playing ? 'pause' : 'play'} size={16} />
            </button>
            <button className="playbtn" onClick={() => next(false)}>
              <Icon name="skipForward" size={18} />
            </button>
            <button className="playbtn" onClick={() => setRepeat((r) => !r)} style={{ opacity: repeat ? 1 : 0.5 }}>
              <Icon name="repeat" size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', width: 34 }}>{fmt(time)}</span>
            <div className="progress">
              <i style={{ width: `${(time / track.duration) * 100}%` }} />
              <input type="range" min="0" max={track.duration} value={time} onChange={(e) => setTime(+e.target.value)} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-3)', width: 34 }}>{fmt(track.duration)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120 }}>
            <Icon name={volume === 0 ? 'volumeMute' : 'volume'} size={15} color="var(--text-3)" />
            <input
              className="slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
