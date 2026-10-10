import { useState } from 'react'
import { actions, useSystem } from './store.js'
import sound from './sound.js'

function Row({ item, onClose, state }) {
  const [open, setOpen] = useState(false)
  const sub = typeof item.submenu === 'function' ? item.submenu(state) : item.submenu
  return (
    <div
      className={`menu__row ${item.disabled ? 'disabled' : ''}`}
      style={{ paddingLeft: item.check ? 20 : 20 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => {
        if (item.disabled || sub) return
        item.onClick?.()
        onClose()
      }}
    >
      {item.check && <span className="check">✓</span>}
      <span className="menu__label">{item.label}</span>
      {sub && <span className="menu__shortcut">›</span>}
      {sub && open && (
        <div className="menu__sub">
          <MenuPanel items={sub} onClose={onClose} state={state} />
        </div>
      )}
    </div>
  )
}

function MenuPanel({ items, onClose, state }) {
  return (
    <div className="menu">
      {items.map((it, i) =>
        it.type === 'sep' ? (
          <div className="menu__sep" key={i} />
        ) : (
          <Row key={i} item={it} onClose={onClose} state={state} />
        ),
      )}
    </div>
  )
}

export default function ContextMenu() {
  const state = useSystem()
  const cm = state.contextMenu
  if (!cm) return null
  const clampedX = Math.min(cm.x, window.innerWidth - 220)
  const clampedY = Math.min(cm.y, window.innerHeight - 220)
  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 8990 }}
        onClick={() => { sound.click(); actions.setContextMenu(null) }}
      />
      <div className="menu ctx" style={{ left: clampedX, top: clampedY, zIndex: 9000 }} onClick={(e) => e.stopPropagation()}>
        {cm.items.map((it, i) =>
          it.type === 'sep' ? (
            <div className="menu__sep" key={i} />
          ) : (
            <Row key={i} item={it} onClose={() => actions.setContextMenu(null)} state={state} />
          ),
        )}
      </div>
    </>
  )
}