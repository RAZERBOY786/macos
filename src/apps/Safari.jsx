import { useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'
import { actions } from '../system/store.js'

let tabId = 0

function newTab(props = {}) {
  if (props.url && props.project) {
    return { id: ++tabId, title: props.project.title, project: props.project, url: props.url }
  }
  return { id: ++tabId, title: 'Start Page', url: '', start: true }
}

export default function Safari({ win }) {
  const initialProject = win?.props?.project
  const initialUrl = win?.props?.url
  const [tabs, setTabs] = useState(() => {
    if (initialProject || initialUrl) {
      const proj = initialProject || profile.projects.find((p) => p.link === initialUrl)
      return [{ id: ++tabId, title: proj ? proj.title : initialUrl, project: proj, url: initialUrl || '' }]
    }
    return [newTab()]
  })
  const [activeId, setActiveId] = useState(tabs[0].id)
  const [addr, setAddr] = useState('')

  const active = tabs.find((t) => t.id === activeId) || tabs[0]

  const go = (project) => {
    setTabs((ts) => ts.map((t) => (t.id === activeId ? { ...t, title: project.title, project, url: project.link, start: false } : t)))
  }

  const navigate = (value) => {
    const q = value.trim()
    if (!q) return
    const proj = profile.projects.find((p) => p.title.toLowerCase() === q.toLowerCase())
    setTabs((ts) =>
      ts.map((t) =>
        t.id === activeId
          ? proj
            ? { ...t, title: proj.title, project: proj, url: proj.link, start: false }
            : { ...t, title: q, url: q.startsWith('http') ? q : `https://${q}`, start: false, mock: true }
          : t,
      ),
    )
    setAddr('')
  }

  const addTab = () => {
    const t = newTab()
    setTabs((ts) => [...ts, t])
    setActiveId(t.id)
  }
  const closeTab = (id, e) => {
    e.stopPropagation()
    setTabs((ts) => {
      const next = ts.filter((t) => t.id !== id)
      const safe = next.length ? next : [newTab()]
      if (id === activeId) setActiveId(safe[safe.length - 1].id)
      return safe
    })
  }

  const favourites = [
    ...profile.projects.map((p) => ({ label: p.title, color: '#0f97ff', project: p, letter: p.title[0] })),
    { label: 'GitHub', color: '#24292e', href: profile.socials.github, letter: 'G', icon: 'github' },
    { label: 'LinkedIn', color: '#0a66c2', href: profile.socials.linkedin, letter: 'in', icon: 'linkedin' },
    { label: 'X', color: '#000', href: profile.socials.twitter, letter: 'X', icon: 'twitter' },
  ]

  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="safari-tabs">
        {tabs.map((t) => (
          <div key={t.id} className={`safari-tab ${t.id === activeId ? 'active' : ''}`} onClick={() => setActiveId(t.id)}>
            <span>{t.title}</span>
            <span className="x" onClick={(e) => closeTab(t.id, e)}>
              ×
            </span>
          </div>
        ))}
        <button className="iconbtn" onClick={addTab} title="New Tab">
          <Icon name="plus" size={14} />
        </button>
      </div>

      <div className="safari-bar">
        <button className="iconbtn">
          <Icon name="chevronLeft" />
        </button>
        <button className="iconbtn">
          <Icon name="chevronRight" />
        </button>
        <div className="addressbar">
          <Icon name="search" size={13} />
          <input
            placeholder="Search or enter website name"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(addr)}
          />
        </div>
        <button className="iconbtn" onClick={() => actions.notify({ appId: 'safari', title: 'Safari', body: 'This is a demo browser — links open mock pages.' })}>
          <Icon name="share" />
        </button>
      </div>

      <div className="safari-page">
        {active.start && (
          <div className="start-page">
            <h2>Favorites</h2>
            <div className="fav-grid">
              {favourites.map((f) => (
                <div
                  key={f.label}
                  className="fav"
                  onClick={() =>
                    f.project ? go(f.project) : window.open(f.href, '_blank', 'noopener,noreferrer')
                  }
                >
                  <div className="fav__tile" style={{ background: f.color }}>
                    {f.icon ? <Icon name={f.icon} size={22} color="#fff" /> : f.letter}
                  </div>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            <h2>Privacy Report</h2>
            <div className="privacy-card">
              <span className="big">27</span>
              <div>
                <b style={{ fontSize: 13.5 }}>Trackers Prevented</b>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>
                  In the last seven days, Safari prevented 27 trackers from profiling you.
                </p>
              </div>
            </div>
          </div>
        )}

        {!active.start && active.project && (
          <div className="start-page" style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div className="fav__tile" style={{ background: '#0f97ff', width: 62, height: 62, fontSize: 26 }}>
                {active.project.title[0]}
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 24 }}>{active.project.title}</h1>
                <div style={{ color: 'var(--text-3)', fontSize: 13 }}>
                  {active.project.year} · {active.project.tech.join(' · ')}
                </div>
              </div>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7 }}>{active.project.description}</p>
            <div style={{ margin: '18px 0' }}>
              {active.project.tech.map((t) => (
                <span className="pill" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn primary" onClick={() => window.open(active.project.link, '_blank', 'noopener,noreferrer')}>
                Visit Site
              </button>
              <button className="btn" onClick={() => window.open(active.project.repo, '_blank', 'noopener,noreferrer')}>
                Source Code
              </button>
            </div>
          </div>
        )}

        {!active.start && !active.project && (
          <div className="empty-state" style={{ padding: 60 }}>
            <Icon name="globe" size={40} color="var(--text-3)" />
            <div style={{ fontSize: 15 }}>Can't connect to “{active.url}” — this is a portfolio demo.</div>
            <div style={{ fontSize: 12.5 }}>Try the favorites on the start page.</div>
          </div>
        )}
      </div>
    </div>
  )
}
