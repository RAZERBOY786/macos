import { useEffect, useState } from 'react'
import { actions, useSystem } from './store.js'
import { launchpadApps, appsMeta } from '../data/appsMeta.js'
import { AppIcon } from '../icons/AppIcons.jsx'

const PER_PAGE = 18

export default function Launchpad() {
  const s = useSystem()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') actions.closeLaunchpad()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!s.launchpadOpen) return null

  const list = launchpadApps.filter((a) => appsMeta[a].name.toLowerCase().includes(q.toLowerCase()))
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const pageItems = list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <div className="launchpad" onMouseDown={(e) => { if (e.target === e.currentTarget) actions.closeLaunchpad() }}>
      <input
        className="launchpad__search"
        placeholder="Search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setPage(0) }}
        autoFocus
      />
      <div className="launchpad__grid">
        {pageItems.map((a) => (
          <div key={a} className="lp-app" onClick={() => actions.openApp(a)}>
            <div className="lp-app__icon">
              <AppIcon app={a} size={84} />
            </div>
            <span className="lp-app__label">{appsMeta[a].name}</span>
          </div>
        ))}
      </div>
      <div className="launchpad__dots">
        {Array.from({ length: pages }).map((_, i) => (
          <i key={i} className={i === page ? 'on' : ''} />
        ))}
      </div>
    </div>
  )
}