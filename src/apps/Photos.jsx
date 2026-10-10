import { useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

const colors = [
  'linear-gradient(135deg,#5ac8fa,#007aff)',
  'linear-gradient(135deg,#ff9f0a,#ff2d55)',
  'linear-gradient(135deg,#af52de,#5856d6)',
  'linear-gradient(135deg,#34c759,#30d158)',
  'linear-gradient(135deg,#ff2d55,#ff9f0a)',
  'linear-gradient(135deg,#ffcc00,#ff9500)',
]

export default function Photos() {
  const items = profile.projects.map((p, i) => ({ ...p, bg: colors[i % colors.length] }))
  const [open, setOpen] = useState(null)
  const [zoom, setZoom] = useState(1)

  const move = (dir) => {
    if (open == null) return
    setOpen((open + dir + items.length) % items.length)
    setZoom(1)
  }

  return (
    <div className="app" style={{ flexDirection: 'column', position: 'relative' }}>
      <div className="toolbar">
        <b style={{ fontSize: 14 }}>Library</b>
        <div className="spacer" />
        <span className="badge">{items.length} items</span>
      </div>
      <div className="app-scroll">
        <div className="photo-grid">
          {items.map((it, i) => (
            <div key={it.id} className="photo-cell" style={{ background: it.bg }} onClick={() => { setOpen(i); setZoom(1) }}>
              <span style={{ fontSize: 12, padding: 6, textAlign: 'center' }}>{it.title}</span>
            </div>
          ))}
        </div>
      </div>

      {open != null && (
        <div className="photo-viewer" onClick={() => setOpen(null)}>
          <button className="photo-viewer__close" onClick={() => setOpen(null)}>
            <Icon name="x" size={16} color="#fff" />
          </button>
          <button className="photo-viewer__nav prev" onClick={(e) => { e.stopPropagation(); move(-1) }}>
            <Icon name="chevronLeft" size={20} color="#fff" />
          </button>
          <div
            className="photo-viewer__img"
            style={{ background: items[open].bg, transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center' }}>
              <div>{items[open].title}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>{items[open].tech.join(' · ')}</div>
            </div>
          </div>
          <button className="photo-viewer__nav next" onClick={(e) => { e.stopPropagation(); move(1) }}>
            <Icon name="chevronRight" size={20} color="#fff" />
          </button>
          <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
            <button className="btn" style={{ flex: 'none' }} onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(2, z + 0.25)) }}>
              Zoom +
            </button>
            <button className="btn" style={{ flex: 'none' }} onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.5, z - 0.25)) }}>
              Zoom −
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
