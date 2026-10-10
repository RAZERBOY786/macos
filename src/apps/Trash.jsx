import { useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'
import sound from '../system/sound.js'

const initial = [{ id: 'd1', name: 'old-draft.txt', detail: 'A draft I no longer need' }]

export default function Trash() {
  const [items, setItems] = useState(initial)
  const [restored, setRestored] = useState([])

  const empty = () => {
    sound.trash()
    setItems([])
  }
  const restore = (id) => {
    const it = items.find((i) => i.id === id)
    setItems((it2) => it2.filter((i) => i.id !== id))
    setRestored((r) => [...r, it])
  }

  return (
    <div className="trash app">
      <div className="sidebar">
        <div className="sidebar__section">Trash</div>
        <div className="sidebar__item active">
          <span className="ic"><Icon name="trash" size={15} /></span> Trash
        </div>
      </div>
      <div className="app-main">
        <div className="toolbar">
          <b style={{ fontSize: 14 }}>Trash</b>
          <div className="spacer" />
          <span className="badge">{items.length} items</span>
          <button className="btn" style={{ flex: 'none', marginLeft: 10 }} onClick={empty}>Empty</button>
        </div>
        <div className="app-scroll">
          {items.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: 42 }}>🗑️</span>
              <div>Trash is empty</div>
            </div>
          ) : (
            <table className="finder-list">
              <thead><tr><th>Name</th><th>Original Location</th><th></th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td><Icon name="file" size={14} /> {it.name}</td>
                    <td style={{ color: 'var(--text-3)' }}>Desktop</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn" style={{ flex: 'none' }} onClick={() => restore(it.id)}>Restore</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {restored.length > 0 && (
            <div style={{ padding: 16, color: 'var(--text-3)', fontSize: 12 }}>
              Restored: {restored.map((r) => r.name).join(', ')} (visible on the Desktop as {profile.firstName}'s files)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
