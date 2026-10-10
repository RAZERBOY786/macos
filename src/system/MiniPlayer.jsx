import { actions } from './store.js'
import { useMusic, TrackArt, fmt, toggle, next, prev, seek } from './music.jsx'
import Icon from '../icons/UIIcons.jsx'

export default function MiniPlayer() {
  const mu = useMusic()
  const t = mu.queue[mu.qIndex] || null
  if (!t) return null
  const total = t.src && mu.dur ? mu.dur : t.duration

  return (
    <div className="minibar" onMouseDown={(e) => e.stopPropagation()}>
      <button className="minibar__open" onClick={() => actions.openApp('music')} title="Open Music">
        <TrackArt t={t} size={30} className="minibar__art" />
      </button>
      <button className="minibar__meta" onClick={() => actions.openApp('music')}>
        <b>{t.title}</b>
        <span>{t.artist}</span>
      </button>
      <div className="minibar__controls">
        <button className="playbtn" onClick={prev} aria-label="Previous">
          <Icon name="skipBack" size={15} />
        </button>
        <button className="playbtn big" onClick={toggle} aria-label={mu.playing ? 'Pause' : 'Play'}>
          <Icon name={mu.playing ? 'pause' : 'play'} size={14} />
        </button>
        <button className="playbtn" onClick={next} aria-label="Next">
          <Icon name="skipForward" size={15} />
        </button>
      </div>
      <div className="progress minibar__progress">
        <i style={{ width: `${total ? Math.min(100, (mu.time / total) * 100) : 0}%` }} />
        <input type="range" min="0" max={total || 0} value={mu.time} onChange={(e) => seek(+e.target.value)} />
      </div>
      <span className="minibar__time">{fmt(mu.time)}</span>
    </div>
  )
}
