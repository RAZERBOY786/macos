import { useEffect, useMemo, useState } from 'react'
import { profile } from '../data/profile.js'
import { actions, useSystem } from '../system/store.js'
import Icon from '../icons/UIIcons.jsx'

const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length

function noteDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const today = new Date()
  const yest = new Date()
  yest.setDate(today.getDate() - 1)
  const same = (a, b) => a.toDateString() === b.toDateString()
  if (same(d, today)) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (same(d, yest)) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Notes() {
  const state = useSystem()
  const [notes, setNotes] = useState(state.notes || profile.notes)
  const [activeId, setActiveId] = useState((state.notes || profile.notes)[0]?.id)
  const [query, setQuery] = useState('')

  const active = notes.find((n) => n.id === activeId) || notes[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notes
    return notes.filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(q))
  }, [notes, query])

  useEffect(() => {
    actions.setNotes(notes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes])

  const update = (field, value) => {
    setNotes((ns) => ns.map((n) => (n.id === active.id ? { ...n, [field]: value, updatedAt: Date.now() } : n)))
  }

  const addNote = () => {
    const now = Date.now()
    const n = { id: 'note-' + now, title: '', body: '', createdAt: now, updatedAt: now }
    setNotes((ns) => [n, ...ns])
    setActiveId(n.id)
    setQuery('')
  }

  const remove = (id) => {
    setNotes((ns) => {
      const next = ns.filter((n) => n.id !== id)
      const safe = next.length ? next : [{ id: 'note-empty', title: 'Untitled', body: '', updatedAt: Date.now() }]
      setActiveId(safe[0].id)
      return safe
    })
  }

  return (
    <div className="app">
      <div className="notes-list">
        <div className="notes-toolbar">
          <button className="iconbtn" title="New Note" onClick={addNote}>
            <Icon name="plus" />
          </button>
          <div className="notes-search">
            <Icon name="search" size={13} color="var(--text-3)" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
          </div>
        </div>

        {filtered.map((n) => {
          const firstLine = n.body.split('\n').find((l) => l.trim())
          return (
            <div key={n.id} className={`note-row ${n.id === activeId ? 'active' : ''}`} onClick={() => setActiveId(n.id)}>
              <b>{n.title || firstLine || 'New Note'}</b>
              <span>
                <em>{noteDate(n.updatedAt || n.createdAt)}</em>
                {n.title ? firstLine || 'No additional text' : 'No additional text'}
              </span>
            </div>
          )
        })}
        {!filtered.length && <div className="notes-empty">No notes match “{query}”.</div>}
      </div>

      <div className="note-editor">
        <div className="note-editor__bar">
          <span className="note-editor__date">
            {active.updatedAt
              ? new Date(active.updatedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <div className="spacer" />
          <button className="iconbtn" title="Delete Note" onClick={() => remove(active.id)}>
            <Icon name="trash" />
          </button>
        </div>

        <input
          className="note-editor__title"
          value={active.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Title"
        />

        <textarea className="note-editor__body" value={active.body} onChange={(e) => update('body', e.target.value)} placeholder="Start typing…" />

        <div className="note-editor__status">
          {words(active.body)} words · {active.body.length} characters
        </div>
      </div>
    </div>
  )
}
