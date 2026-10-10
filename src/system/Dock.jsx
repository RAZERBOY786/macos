import { useRef, useState } from 'react'
import { actions, useSystem } from './store.js'
import { dockApps, appsMeta } from '../data/appsMeta.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import sound from './sound.js'

export default function Dock() {
  const state = useSystem()
  const dockRef = useRef(null)
  const [pointerX, setPointerX] = useState(null)
  const dock = state.dock
  const magnify = dock.magnification
  const base = dock.size
  const gap = 6
  const minW = state.windows.filter((w) => w.minimized)

  const ctxMenu = (e, appId) => {
    e.preventDefault()
    sound.click()
    const items = [
      { label: 'Options', submenu: [
        { label: 'Keep in Dock', check: state.dockRunning.includes(appId) },
        { label: 'Show in Finder', onClick: () => actions.openApp('finder') },
      ]},
      { type: 'sep' },
      { label: 'Show in Finder', onClick: () => actions.openApp('finder') },
      { type: 'sep' },
      { label: `Open ${appsMeta[appId]?.name}`, onClick: () => actions.focusApp(appId) },
      { label: `Quit ${appsMeta[appId]?.name}`, disabled: !state.dockRunning.includes(appId), onClick: () => actions.requestQuit(appId) },
    ]
    actions.setContextMenu({ x: e.clientX, y: e.clientY, items, open: true })
  }

  const onMove = (e) => {
    const r = dockRef.current.getBoundingClientRect()
    setPointerX(e.clientX - r.left)
  }

  const scaleFor = (i) => {
    if (!magnify || pointerX == null) return 1
    const itemWidth = base + gap
    const center = itemWidth * i + base / 2
    const dist = Math.abs(pointerX - center)
    return 1 + (dock.magnifyScale - 1) * Math.max(0, 1 - dist / (base * 1.9))
  }

  const launch = (appId, e) => {
    e.stopPropagation()
    sound.open()
    actions.setContextMenu(null)
    actions.openApp(appId)
    actions.setBouncing(appId)
  }

  return (
    <div className="dock-wrap">
      <div
        className="dock"
        ref={dockRef}
        style={{ transform: dock.position === 'left' || dock.position === 'right' ? 'rotate(0)' : undefined }}
        onPointerMove={onMove}
        onPointerLeave={() => setPointerX(null)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {dockApps.map((appId, i) => {
          const running = state.dockRunning.includes(appId)
          const scale = scaleFor(i)
          return (
            <div
              key={appId}
              className={`dock__item ${state.bouncing === appId ? 'bounce' : ''}`}
              style={{
                width: base * scale,
                height: base * scale,
                zIndex: Math.round(scale * 10),
                transform: `translateY(${(scale - 1) * -base * 0.35}px)`,
                transition: 'transform 0.12s cubic-bezier(0.25,0.1,0.25,1)',
              }}
              onClick={(e) => launch(appId, e)}
              onContextMenu={(e) => ctxMenu(e, appId)}
            >
              <AppIcon app={appId} size="100%" />
              <div className="dock__tooltip">{appsMeta[appId]?.name}</div>
              {running && <span className="dock__dot" />}
            </div>
          )
        })}

        <div className="dock__sep" />

        <div
          className="dock__item"
          onClick={(e) => { e.stopPropagation(); actions.openApp('trash') }}
          onContextMenu={(e) => ctxMenu(e, 'trash')}
        >
          <AppIcon app="trash" size="100%" />
          <div className="dock__tooltip">Trash</div>
          {state.dockRunning.includes('trash') && <span className="dock__dot" />}
        </div>

        {minW.map((w) => (
          <div
            key={w.id}
            className="dock__item"
            onClick={(e) => { e.stopPropagation(); actions.restoreWindow(w.id) }}
            title={w.title}
          >
            <span
              style={{
                width: base, height: base, borderRadius: 8, overflow: 'hidden',
                background: 'var(--window-bg)', boxShadow: '0 3px 10px rgba(0,0,0,0.3), inset 0 0 0 1px var(--hairline)',
                display: 'grid', placeItems: 'center', transform: 'scale(0.72)',
              }}
            >
              <AppIcon app={w.appId} size={44} />
            </span>
            <div className="dock__tooltip">{w.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}