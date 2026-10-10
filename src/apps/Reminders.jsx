import { useEffect, useState } from 'react'
import { actions, useSystem } from '../system/store.js'
import Icon from '../icons/UIIcons.jsx'

const defaults = [
  { id: 1, label: 'Update portfolio projects', done: false },
  { id: 2, label: 'Review pull requests', done: true },
  { id: 3, label: 'Write blog post about React 19', done: false },
  { id: 4, label: 'Learn a new database', done: false },
]

export default function Reminders() {
  const state = useSystem()
  const [items, setItems] = useState(state.reminders || defaults)
  const [text, setText] = useState('')

  useEffect(() => {
    actions.setReminders(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const toggle = (id) => setItems((it) => it.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  const add = () => {
    if (!text.trim()) return
    setItems((it) => [...it, { id: Date.now(), label: text.trim(), done: false }])
    setText('')
  }
  const remove = (id) => setItems((it) => it.filter((i) => i.id !== id))

  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="toolbar">
        <b style={{ fontSize: 18, color: 'var(--orange)' }}>Reminders</b>
        <div className="spacer" />
        <span className="badge">{items.filter((i) => !i.done).length} left</span>
      </div>
      <div className="reminders">
        {items.map((r) => (
          <div key={r.id} className={`reminder ${r.done ? 'done' : ''}`}>
            <button className={`checkbox ${r.done ? 'done' : ''}`} onClick={() => toggle(r.id)}>
              <Icon name="check" size={12} />
            </button>
            <span className="label">{r.label}</span>
            <button className="iconbtn" onClick={() => remove(r.id)} style={{ width: 24, height: 24 }}>
              <Icon name="x" size={13} />
            </button>
          </div>
        ))}
        <div className="reminder">
          <span className="checkbox" style={{ borderStyle: 'dashed' }} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Add a reminder…"
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, color: 'var(--text)', fontSize: 14 }}
          />
        </div>
      </div>
    </div>
  )
}
