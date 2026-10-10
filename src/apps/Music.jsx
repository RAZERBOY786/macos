import { useEffect, useRef, useState } from 'react'
import Icon from '../icons/UIIcons.jsx'

/* ------------------------------------------------------------------ *
 * Music — a proper Apple-Music-style player.
 *
 * Catalog + audio come from the Audius public API (no API key needed),
 * which streams *full-length* tracks (the /stream endpoint 302-redirects
 * to a signed CDN file). The library is built from a handful of Hindi +
 * English search buckets, all cached for instant re-opens. Search hits
 * Audius live with debouncing.
 * ------------------------------------------------------------------ */
const AUDIUS_FALLBACK = 'https://api.audius.co'
const APP_NAME = 'MacOSPortfolio'
const PALETTE = ['#ff2d55', '#ff9500', '#ffcc00', '#34c759', '#5ac8fa', '#007aff', '#af52de', '#ff375f']

const fmt = (s) => {  if (!isFinite(s) || s < 0) s = 0
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
const isHttp = (u) => typeof u === 'string' && /^https?:\/\//.test(u)

function hashColor(str) {
  let h = 0
  for (let i = 0; i < (str || '').length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return PALETTE[Math.abs(h) % PALETTE.length]
}

/* Resolve a working Audius discovery host (falls back gracefully). */
let AUDIUS = null
async function apiBase() {
  if (AUDIUS) return AUDIUS
  try {
    const r = await fetch(AUDIUS_FALLBACK, { headers: { Accept: 'application/json' } })
    const d = await r.json()
    AUDIUS = (Array.isArray(d?.data) && d.data.find(isHttp)) || AUDIUS_FALLBACK
  } catch {
    AUDIUS = AUDIUS_FALLBACK
  }
  return AUDIUS
}

function mapTrack(t) {
  return {
    id: t.id,
    title: t.title || t.album_name || 'Untitled',
    artist: t.user?.name || t.user?.handle || 'Unknown Artist',
    album: t.album_name || t.genre || 'Single',
    duration: t.duration || 0,
    src: `${AUDIUS}/v1/tracks/${t.id}/stream?app_name=${APP_NAME}`,
    art: t.artwork?.['480x480'] || t.artwork?.['150x150'] || '',
    color: hashColor(t.title || t.id),
    plays: t.play_count || 0,
  }
}

async function audiusSearch(query, limit = 30) {
  const base = await apiBase()
  try {
    const r = await fetch(`${base}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=${APP_NAME}&limit=${limit}`)
    if (!r.ok) return []
    const d = await r.json()
    return (d.data || []).map(mapTrack)
  } catch {
    return []
  }
}

async function audiusTrending(limit = 40) {
  const base = await apiBase()
  try {
    const r = await fetch(`${base}/v1/tracks/trending?app_name=${APP_NAME}&limit=${limit}`)
    if (!r.ok) return []
    const d = await r.json()
    return (d.data || []).map(mapTrack)
  } catch {
    return []
  }
}

const STATIONS = [
  { id: 'hindi', name: 'Hindi', color: '#ff9500', icon: 'music', terms: ['hindi songs', 'arijit singh', 'atif aslam', 'bollywood hits'] },
  { id: 'english', name: 'English', color: '#007aff', icon: 'star', terms: ['english songs', 'ed sheeran', 'top pop hits', 'rock anthems'] },
  { id: 'punjabi', name: 'Punjabi', color: '#ffcc00', icon: 'bolt', terms: ['punjabi songs', 'diljit dosanjh'] },
  { id: 'romance', name: 'Romance', color: '#ff2d55', icon: 'heart', terms: ['romantic hindi songs', 'love songs'] },
  { id: 'party', name: 'Party', color: '#af52de', icon: 'sun', terms: ['party mix', 'dance hits'] },
  { id: 'chill', name: 'Chill', color: '#34c759', icon: 'moon', terms: ['lofi beats', 'chill mix'] },
]

let libCache = null

async function loadLibrary(onBatch) {
  await apiBase()
  const seen = new Set()
  const out = []
  const add = (list, station) => {
    let added = false
    for (const t of list) {
      if (seen.has(t.id)) continue
      seen.add(t.id)
      out.push({ ...t, station })
      added = true
    }
    if (added) onBatch?.([...out])
  }

  /* Global hits land first so the UI fills instantly. */
  add(await audiusTrending(40), 'trending')

  const tasks = []
  for (const st of STATIONS) for (const term of st.terms) tasks.push({ id: st.id, term })

  /* Fetch the rest with limited concurrency (keeps things fast + polite). */
  let cursor = 0
  const worker = async () => {
    while (cursor < tasks.length) {
      const { id, term } = tasks[cursor++]
      add(await audiusSearch(term, 12), id)
    }
  }
  await Promise.all(Array.from({ length: 5 }, worker))
  return out
}

export default function Music() {
  const [library, setLibrary] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [view, setView] = useState('listen')
  const [station, setStation] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [resultsFor, setResultsFor] = useState('')
  const [queue, setQueue] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const audioRef = useRef(null)
  const track = queue[qIndex] || null
  const total = track ? (track.src && dur ? dur : track.duration) : 0
  const searching = view === 'search' && query.trim().length >= 2 && resultsFor !== query.trim()

  /* Load the library once (cached so re-opening is instant). */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let list = libCache
      if (!list) {
        list = await loadLibrary((partial) => {
          if (cancelled) return
          setLibrary(partial)
          setCount(partial.length)
        })
        if (cancelled) return
        if (list.length > 0) libCache = list
      }
      if (cancelled) return
      if (list.length > 0) setLibrary(list)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /* Live search against Audius (debounced). */
  useEffect(() => {
    const q = query.trim()
    if (view !== 'search' || q.length < 2) return
    let alive = true
    const id = setTimeout(async () => {
      const r = await audiusSearch(q, 30)
      if (!alive) return
      setResults(r)
      setResultsFor(q)
    }, 400)
    return () => {
      alive = false
      clearTimeout(id)
    }
  }, [query, view])

  /* Drive the <audio> element. */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    if (isHttp(track.src)) {
      if (audio.getAttribute('src') !== track.src) audio.src = track.src
      audio.volume = volume
      if (playing) audio.play().catch(() => {})
      else audio.pause()
    } else {
      audio.pause()
    }
  }, [playing, qIndex, track, volume])

  const liveRef = useRef({})
  const playTrack = (t, list = queue) => {
    const idx = list.findIndex((x) => x.id === t.id)
    if (idx < 0) return
    setQueue(list)
    setQIndex(idx)
    setTime(0)
    setDur(0)
    setPlaying(true)
  }
  const playList = (list, start = 0, doShuffle = false) => {
    if (!list.length) return
    setQueue(list)
    setShuffle(doShuffle)
    setQIndex(Math.min(start, list.length - 1))
    setTime(0)
    setDur(0)
    setPlaying(true)
  }
  const next = (auto = false) => {
    const n = queue.length
    if (!n) return
    let i = shuffle ? Math.floor(Math.random() * n) : (qIndex + 1) % n
    if (i === qIndex && n > 1) i = (i + 1) % n
    setQIndex(i)
    setTime(0)
    setDur(0)
    if (auto && !repeat) setPlaying(true)
  }
  const prev = () => {
    if (!queue.length) return
    setQIndex((i) => (i - 1 + queue.length) % queue.length)
    setTime(0)
    setDur(0)
  }
  useEffect(() => {
    liveRef.current = { next, repeat, len: queue.length }
  })

  /* Reflect real time/duration; advance on end; skip on error. */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setTime(audio.currentTime || 0)
    const onLoaded = () => {
      if (isFinite(audio.duration) && audio.duration > 0) setDur(audio.duration)
    }
    const onEnded = () => {
      const live = liveRef.current
      if (live.repeat) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      } else {
        live.next(true)
      }
    }
    const onError = () => {
      const live = liveRef.current
      if (live.len > 1) live.next(true)
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const seek = (v) => {
    const audio = audioRef.current
    if (track?.src && audio) audio.currentTime = v
    setTime(v)
  }

  const openHome = (v) => {
    setView(v)
    setStation(null)
    setQuery('')
  }
  const openStation = (id) => {
    setStation(id)
    setQuery('')
  }

  const stationTracks = station ? library.filter((t) => t.station === station) : []
  const stationMeta = STATIONS.find((s) => s.id === station)
  const topPicks = library.filter((t) => t.station === 'trending' || t.station === 'english').slice(0, 8)
  const title = station ? stationMeta?.name : { listen: 'Listen Now', browse: 'Browse', radio: 'Radio', search: 'Search' }[view]

  return (
    <div className="music">
      <audio ref={audioRef} preload="metadata" />

      {/* Sidebar */}
      <div className="music__side">
        <div className="music__side-group">
          <div className="label">Home</div>
          {[
            ['Listen Now', 'play', 'listen'],
            ['Browse', 'grid', 'browse'],
            ['Radio', 'bolt', 'radio'],
          ].map(([n, ic, v]) => (
            <div key={n} className={`sidebar__item ${view === v && !station ? 'active' : ''}`} onClick={() => openHome(v)}>
              <span className="ic" style={{ color: 'var(--pink)' }}>
                <Icon name={ic} size={15} />
              </span>
              {n}
            </div>
          ))}
        </div>
        <div className="music__side-group">
          <div className="label">Playlists</div>
          {STATIONS.map((s) => (
            <div key={s.id} className={`sidebar__item ${station === s.id ? 'active' : ''}`} onClick={() => openStation(s.id)}>
              <span className="ic" style={{ color: s.color }}>
                <Icon name={s.icon} size={15} />
              </span>
              {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="music__main">
        <div className="music__top">
          <div className="music__nav">
            <button
              className="music__navbtn"
              onClick={() => (station ? setStation(null) : setView('listen'))}
              disabled={view === 'listen' && !station}
            >
              <Icon name="chevronLeft" size={18} />
            </button>
            <button className="music__navbtn" disabled>
              <Icon name="chevronRight" size={18} />
            </button>
          </div>
          <div className="music__title">{title}</div>
          <div className="music__search">
            <Icon name="search" size={14} color="var(--text-3)" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setView('search')
                setStation(null)
              }}
              placeholder="Search songs & artists"
            />
            {query && (
              <button className="music__searchclear" onClick={() => setQuery('')}>
                <Icon name="x" size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="music__body">
          {loading && !library.length ? (
            <div className="music__loading">
              <Icon name="music" size={30} color="var(--pink)" />
              <b>Loading Hindi &amp; English music…</b>
              <span>{count} tracks found</span>
            </div>
          ) : station ? (
            <>
              <Hero
                title={stationMeta?.name || 'Playlist'}
                subtitle={`${stationTracks.length} songs`}
                color={stationMeta?.color}
                onPlay={() => playList(stationTracks, 0, true)}
              />
              <SongList tracks={stationTracks} current={track} playing={playing} onPlay={(t) => playTrack(t, stationTracks)} />
            </>
          ) : view === 'browse' ? (
            <>
              <Hero title="Browse" subtitle="Stations for every mood" color="#007aff" />
              <SectionHead title="Genres" />
              <div className="tile-grid">
                {STATIONS.map((s) => (
                  <button key={s.id} className="tile" style={{ background: `linear-gradient(135deg, ${s.color}, rgba(0,0,0,0.42))` }} onClick={() => openStation(s.id)}>
                    <Icon name={s.icon} size={22} color="#fff" />
                    <div>
                      <b>{s.name}</b>
                      <span>{library.filter((t) => t.station === s.id).length} songs</span>
                    </div>
                  </button>
                ))}
              </div>
              <SectionHead title="New Releases" />
              <CardRow tracks={library.slice(0, 10)} current={track} playing={playing} onPlay={(t) => playTrack(t, library.slice(0, 10))} />
            </>
          ) : view === 'radio' ? (
            <>
              <Hero title="Portfolio Radio" subtitle="Endless shuffle across the whole library" color="#af52de" onPlay={() => playList(library, Math.floor(Math.random() * library.length), true)} playLabel="Start Radio" />
              <SectionHead title="Stations" />
              <div className="tile-grid">
                {STATIONS.map((s) => {
                  const list = library.filter((t) => t.station === s.id)
                  return (
                    <button key={s.id} className="tile" style={{ background: `linear-gradient(135deg, ${s.color}, rgba(0,0,0,0.42))` }} onClick={() => playList(list, Math.floor(Math.random() * list.length), true)}>
                      <Icon name={s.icon} size={22} color="#fff" />
                      <div>
                        <b>{s.name} Radio</b>
                        <span>Shuffle · {list.length} songs</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <SectionHead title="All Songs" />
              <SongList tracks={library} current={track} playing={playing} onPlay={(t) => playTrack(t, library)} />
            </>
          ) : view === 'search' ? (
            <>
              {query.trim().length < 2 ? (
                <div className="music__hint">
                  <Icon name="search" size={26} color="var(--text-3)" />
                  <b>Search Hindi &amp; English songs</b>
                  <span>Try “Arijit Singh”, “Ed Sheeran”, “Punjabi”…</span>
                  <div className="music__chips">
                    {['Arijit Singh', 'Ed Sheeran', 'Punjabi', 'Lofi', 'Bollywood', 'Romantic'].map((c) => (
                      <button key={c} className="chip" onClick={() => setQuery(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <SectionHead title={searching ? 'Searching…' : `Results for “${query.trim()}”`} />
                  <SongList tracks={results} current={track} playing={playing} onPlay={(t) => playTrack(t, results)} />
                  {!searching && !results.length && <p className="music__empty">No songs found.</p>}
                </>
              )}
            </>
          ) : (
            <>
              <Hero title="Listen Now" subtitle="Your Hindi & English mix" color="#ff2d55" onPlay={() => playList(library, 0, true)} playLabel="Play" />
              <SectionHead title="Top Picks" />
              <CardRow tracks={topPicks} current={track} playing={playing} onPlay={(t) => playTrack(t, topPicks)} />
              <SectionHead title="Stations" />
              <div className="tile-grid">
                {STATIONS.map((s) => (
                  <button key={s.id} className="tile" style={{ background: `linear-gradient(135deg, ${s.color}, rgba(0,0,0,0.42))` }} onClick={() => openStation(s.id)}>
                    <Icon name={s.icon} size={22} color="#fff" />
                    <div>
                      <b>{s.name}</b>
                      <span>{library.filter((t) => t.station === s.id).length} songs</span>
                    </div>
                  </button>
                ))}
              </div>
              <SectionHead title="Songs" />
              <SongList tracks={library} current={track} playing={playing} onPlay={(t) => playTrack(t, library)} />
            </>
          )}
        </div>

        {/* Player */}
        <div className="player">
          <div className="player__now">
            {track ? (
              <>
                <Art t={track} size={46} className="player__art" />
                <div style={{ lineHeight: 1.25, minWidth: 0 }}>
                  <b style={{ fontSize: 12.5, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</b>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.artist}</span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Not playing</span>
            )}
          </div>

          <div className="player__controls">
            <button className="playbtn" onClick={() => setShuffle((s) => !s)} style={{ opacity: shuffle ? 1 : 0.5 }}>
              <Icon name="shuffle" size={16} />
            </button>
            <button className="playbtn" onClick={prev}>
              <Icon name="skipBack" size={18} />
            </button>
            <button className="playbtn big" onClick={() => setPlaying((p) => !p)} disabled={!track}>
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
              <i style={{ width: `${total ? Math.min(100, (time / total) * 100) : 0}%` }} />
              <input type="range" min="0" max={total || 0} value={time} onChange={(e) => seek(+e.target.value)} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-3)', width: 34 }}>{fmt(total)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120 }}>
            <Icon name={volume === 0 ? 'volumeMute' : 'volume'} size={15} color="var(--text-3)" />
            <input className="slider" type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(+e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Art({ t, size, className = '' }) {
  const style = t?.art
    ? { background: `center/cover no-repeat url(${t.art})` }
    : { background: `linear-gradient(135deg, ${t?.color || '#888'}, rgba(0,0,0,0.35))` }
  return <div className={className} style={{ ...style, width: size, height: size, flex: 'none' }} />
}

function Hero({ title, subtitle, color = '#ff2d55', onPlay, playLabel = 'Play' }) {
  return (
    <div className="hero" style={{ background: `linear-gradient(120deg, ${color}, rgba(0,0,0,0.45))` }}>
      <Icon name="music" size={44} color="rgba(255,255,255,0.85)" />
      <div className="hero__info">
        <span className="hero__kind">FEATURED</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {onPlay && (
          <button className="hero__play" onClick={onPlay}>
            <Icon name="play" size={15} /> {playLabel}
          </button>
        )}
      </div>
    </div>
  )
}

function SectionHead({ title }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
    </div>
  )
}

function CardRow({ tracks, current, playing, onPlay }) {
  return (
    <div className="scroll-row">
      {tracks.map((t) => (
        <div key={t.id} className="card" onDoubleClick={() => onPlay(t)} title={`${t.title} — ${t.artist}`}>
          <div className="card__art-wrap">
            <Art t={t} className="card__art" size={148} />
            <button className="card__play" onClick={() => onPlay(t)}>
              <Icon name={playing && current?.id === t.id ? 'pause' : 'play'} size={18} color="#fff" />
            </button>
          </div>
          <b>{t.title}</b>
          <span>{t.artist}</span>
        </div>
      ))}
    </div>
  )
}

function SongList({ tracks, current, playing, onPlay }) {
  if (!tracks.length) return null
  return (
    <div className="songlist">
      {tracks.map((t, i) => {
        const active = current?.id === t.id
        return (
          <button key={t.id} className={`song ${active ? 'active' : ''}`} onClick={() => onPlay(t)}>
            <span className="song__num">{playing && active ? <Icon name="volume" size={13} color="var(--pink)" /> : i + 1}</span>
            <Art t={t} size={38} className="song__art" />
            <span className="song__meta">
              <b>{t.title}</b>
              <span>{t.artist}</span>
            </span>
            <span className="song__dur">{fmt(t.duration)}</span>
          </button>
        )
      })}
    </div>
  )
}
