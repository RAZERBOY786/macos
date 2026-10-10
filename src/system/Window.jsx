import { useEffect, useRef, useState } from 'react'
import { actions } from './store.js'
import sound from './sound.js'
import { registry } from './registry.jsx'
import Icon from '../icons/UIIcons.jsx'

export default function Window({ win, active, dockPosition }) {
  const App = registry[win.appId]
  const [pos, setPos] = useState({ x: win.x, y: win.y })
  const [size, setSize] = useState({ w: win.w, h: win.h })
  const [closing, setClosing] = useState(false)
  const [minimizing, setMinimizing] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [geom, setGeom] = useState({ x: win.x, y: win.y, w: win.w, h: win.h })
  const dragRef = useRef(null)

  // sync when the store changes geometry (maximise etc.)
  if (win.x !== geom.x || win.y !== geom.y || win.w !== geom.w || win.h !== geom.h) {
    setGeom({ x: win.x, y: win.y, w: win.w, h: win.h })
    setPos({ x: win.x, y: win.y })
    setSize({ w: win.w, h: win.h })
  }

  // keep the window on-screen when the viewport changes (resize / rotate)
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (win.maximized) {
        actions.updateWindowGeom(win.id, { x: 0, y: 27, w: vw, h: vh - 27 })
        return
      }
      const w = Math.min(size.w, Math.max(260, vw - 20))
      const h = Math.min(size.h, Math.max(180, vh - 26 - 20))
      const x = Math.max(-w + 120, Math.min(pos.x, vw - 120))
      const y = Math.max(26, Math.min(pos.y, vh - 40))
      if (w !== size.w || h !== size.h || x !== pos.x || y !== pos.y) {
        setSize({ w, h })
        setPos({ x, y })
        actions.updateWindowGeom(win.id, { x, y, w, h })
      }
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [size.w, size.h, pos.x, pos.y, win.maximized, win.id])

  const startDrag = (e) => {
    if (win.maximized) return
    if (e.target.closest('.traffic') || e.target.closest('button') || e.target.closest('input')) return
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const ox = pos.x
    const oy = pos.y
    dragRef.current = { startX, startY, ox, oy }
    setInteracting(true)
    document.body.style.cursor = 'grabbing'

    const move = (ev) => {
      const nx = Math.max(-size.w + 120, Math.min(window.innerWidth - 120, ox + (ev.clientX - startX)))
      const ny = Math.max(26, Math.min(window.innerHeight - 40, oy + (ev.clientY - startY)))
      setPos({ x: nx, y: ny })
    }
    const up = () => {
      document.body.style.cursor = ''
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setInteracting(false)
      setPos((p) => {
        actions.updateWindowGeom(win.id, { x: p.x, y: p.y })
        return p
      })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const startResize = (e, dir) => {
    e.preventDefault()
    e.stopPropagation()
    setInteracting(true)
    const startX = e.clientX
    const startY = e.clientY
    const o = { ...pos, ...size }
    const move = (ev) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      let { x, y, w, h } = o
      if (dir.includes('e')) w = Math.max(320, o.w + dx)
      if (dir.includes('s')) h = Math.max(200, o.h + dy)
      if (dir.includes('w')) {
        w = Math.max(320, o.w - dx)
        x = o.x + (o.w - w)
      }
      if (dir.includes('n')) {
        h = Math.max(200, o.h - dy)
        y = Math.max(26, o.y + (o.h - h))
      }
      setPos({ x, y })
      setSize({ w, h })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setInteracting(false)
      setPos((p) => {
        actions.updateWindowGeom(win.id, { x: p.x, y: p.y, w: size.w, h: size.h })
        return p
      })
      setSize((s) => {
        actions.updateWindowGeom(win.id, { w: s.w, h: s.h })
        return s
      })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const close = () => {
    sound.close()
    setClosing(true)
    setTimeout(() => actions.closeWindow(win.id), 200)
  }
  const minimize = () => {
    sound.minimize()
    setMinimizing(true)
    setTimeout(() => actions.minimizeWindow(win.id), 320)
  }

  if (!App) return null

  return (
    <div
      className={`window ${active ? '' : 'inactive'} ${win.maximized ? 'maximized' : ''} ${closing ? 'closing' : ''} ${minimizing ? 'minimizing' : ''} ${interacting ? 'dragging' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: win.z,
        transformOrigin: dockPosition === 'bottom' ? 'bottom center' : 'center',
      }}
      onPointerDown={() => actions.focusWindow(win.id)}
    >
      <div className="window__titlebar" onPointerDown={startDrag} onDoubleClick={() => actions.maximizeWindow(win.id)}>
        <div className="window__traffic">
          <button className="traffic red" onClick={close} title="Close">
            <Icon name="x" size={7} strokeWidth={2.4} />
          </button>
          <button className="traffic yellow" onClick={minimize} title="Minimise">
            <Icon name="minus" size={7} strokeWidth={2.4} />
          </button>
          <button className="traffic green" onClick={() => actions.maximizeWindow(win.id)} title="Maximise">
            <Icon name="plus" size={7} strokeWidth={2.4} />
          </button>
        </div>
        <div className="window__title">{win.title}</div>
      </div>

      <div className="window__body">
        <App win={win} />
      </div>

      {!win.maximized && (
        <>
          {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((d) => (
            <div key={d} className={`window__resize ${d}`} onPointerDown={(e) => startResize(e, d)} />
          ))}
        </>
      )}
    </div>
  )
}
