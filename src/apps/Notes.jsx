import { useEffect, useState } from 'react'
import { profile } from '../data/profile.js'
import { actions, useSystem } from '../system/store.js'
import Icon from '../icons/UIIcons.jsx'

export default function Notes() {
  const state = useSystem()
  const [notes, setNotes] = useState(state.notes || profile.notes)
  const [activeId, setActiveId] = useState((state.notes || profile.notes)[0].id)

  const active = notes.find((n) => n.id === activeId) || notes[0]

  useEffect(() => {
    actions.setNotes(notes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes])

  const update = (field, value) => {
    setNotes((ns) => ns.map((n) => (n.id === active.id ? { ...n, [field]: value } : n)))
  }

  const addNote = () => {
    const n = { id: 'note-' + Date.now(), title: 'New Note', body: '' }
    setNotes((ns) => [n, ...ns])
    setActiveId(n.id)
  }

  const remove = (id) => {
    setNotes((ns) => {
      const next = ns.filter((n) => n.id !== id)
      const safe = next.length ? next : [{ id: 'note-empty', title: 'Untitled', body: '' }]
      setActiveId(safe[0].id)
      return safe
    })
  }

  return (
    <div className="app">
      <div className="notes-list">
        <div className="toolbar" style={{ borderBottom: '0.5px solid var(--hairline)', background: 'transparent' }}>
          <button className="iconbtn" onClick={addNote}>
            <Icon name="plus" />
          </button>
          <div className="spacer" />
          <button className="iconbtn" onClick={() => remove(active.id)}>
            <Icon name="trash" />
          </button>
        </div>
        {notes.map((n) => (
          <div key={n.id} className={`note-row ${n.id === activeId ? 'active' : ''}`} onClick={() => setActiveId(n.id)}>
            <b>{n.title || 'New Note'}</b>
            <span>{n.body.split('\n')[0] || 'No additional text'}</span>
          </div>
        ))}
      </div>

      <div className="note-editor">
        <input
          value={active.title}
          onChange={(e) => update('title', e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 22, fontWeight: 700, color: 'var(--text)', width: '100%', marginBottom: 10 }}
        />
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <textarea value={active.body} onChange={(e) => update('body', e.target.value)} placeholder="Start typing…" />
      </div>
    </div>
  )
}
