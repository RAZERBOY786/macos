import { useEffect, useMemo, useRef, useState } from 'react'
import { actions, useSystem } from './store.js'
import { launchpadApps, appsMeta } from '../data/appsMeta.js'
import { profile } from '../data/profile.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import Icon from '../icons/UIIcons.jsx'

export default function Spotlight() {
  const s = useSystem()
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const q = s.spotlightQuery.trim().toLowerCase()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    if (!q) return []
    const out = []
    launchpadApps.filter((a) => a !== 'launchpad').forEach((a) => {
      if (appsMeta[a].name.toLowerCase().includes(q)) out.push({ type: 'app', id: a, label: appsMeta[a].name, sub: 'Application' })
    })
    profile.projects.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.tech.some((t) => t.toLowerCase().includes(q)))
        out.push({ type: 'project', id: p.id, label: p.title, sub: 'Project · ' + p.year })
    })
    Object.entries(profile.skills).forEach(([group, list]) => {
      list.forEach((skill) => {
        if (skill.toLowerCase().includes(q)) out.push({ type: 'skill', id: skill, label: skill, sub: 'Skill · ' + group })
      })
    })
    profile.notes.forEach((n) => {
      if (n.title.toLowerCase().includes(q)) out.push({ type: 'note', id: n.id, label: n.title, sub: 'Note' })
    })
    return out.slice(0, 12)
  }, [q])

  const run = (r) => {
    if (r.type === 'app') actions.openApp(r.id)
    else if (r.type === 'project') {
      const p = profile.projects.find((x) => x.id === r.id)
      actions.openApp('safari', { props: { project: p } })
    } else if (r.type === 'skill' || r.type === 'note') actions.openApp('notes')
    actions.closeSpotlight()
  }

  const close = (e) => {
    e?.stopPropagation?.()
    actions.closeSpotlight()
  }

  const onKey = (e) => {
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[active]) run(results[active])
    }
  }

  return (
    <div className="spotlight-backdrop" onClick={close}>
      <div className="spotlight" onClick={(e) => e.stopPropagation()}>
        <div className="spotlight__input-row">
          <Icon name="search" size={24} color="var(--text-3)" />
          <input
            ref={inputRef}
            placeholder="Spotlight Search"
            value={s.spotlightQuery}
            onChange={(e) => actions.setSpotlightQuery(e.target.value)}
            onKeyDown={onKey}
          />
        </div>
        <div className="spotlight__results">
          {!q && <div className="spotlight__empty">Start typing to search apps, projects and skills.</div>}
          {q && results.length === 0 && <div className="spotlight__empty">No results for “{s.spotlightQuery}”</div>}
          {results.map((r, i) => (
            <div key={r.id} className={`spotlight__row ${i === active ? 'active' : ''}`} onMouseEnter={() => setActive(i)} onClick={() => run(r)}>
              <span className="ic">
                {r.type === 'app' ? (
                  <AppIcon app={r.id} size={30} />
                ) : r.type === 'project' ? (
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--blue)', display: 'grid', placeItems: 'center' }}>
                    <Icon name="globe" size={16} color="#fff" />
                  </span>
                ) : (
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--purple)', display: 'grid', placeItems: 'center' }}>
                    <Icon name={r.type === 'note' ? 'file' : 'star'} size={16} color="#fff" />
                  </span>
                )}
              </span>
              <div style={{ flex: 1 }}>
                <div className="spotlight__main">{r.label}</div>
                <div className="spotlight__sub">{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}