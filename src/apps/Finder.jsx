import { useEffect, useState } from 'react'
import { fileSystem, findNode, pathTo, findNodesByTag, desktopIcons } from '../data/fs.js'
import { appsMeta } from '../data/appsMeta.js'
import { profile } from '../data/profile.js'
import { actions, useSystem } from '../system/store.js'
import sound from '../system/sound.js'
import Icon from '../icons/UIIcons.jsx'
import { Icons } from '../icons/AppIcons.jsx'

function NodeIcon({ node, size = 46 }) {
  const wrap = (Comp) => (
    <span style={{ width: size, height: size, display: 'block' }}>
      <Comp />
    </span>
  )
  if (node.type === 'drive') return wrap(Icons.hd)
  if (node.type === 'pdf') return wrap(Icons.pdf)
  if (node.type === 'folder' || node.type === 'project') return wrap(Icons.folder)
  if (node.type === 'app') {
    const C = Icons[node.appId] || Icons.generic
    return wrap(C)
  }
  if (node.type === 'image') {
    return (
      <span
        style={{
          width: size,
          height: size,
          display: 'block',
          borderRadius: 4,
          background: node.color || '#5ac8fa',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        }}
      />
    )
  }
  return wrap(Icons.generic)
}

const KIND_LABEL = {
  app: 'Application',
  folder: 'Folder',
  drive: 'Volume',
  project: 'Folder',
  pdf: 'PDF Document',
  image: 'Image',
  file: 'Document',
}
const kindLabel = (type) => KIND_LABEL[type] || type

function snapshot(node) {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    appId: node.appId,
    detail: node.detail,
    color: node.color,
    link: node.project?.link || node.link,
  }
}

/* Locations: real FS nodes, or "smart" virtual folders (recents, tags, …) */
function parseLoc(v) {
  return v?.startsWith('smart:')
    ? { type: 'smart', kind: v.slice(6) }
    : { type: 'node', id: v || 'macintosh-hd' }
}

export default function Finder({ win }) {
  const s = useSystem()
  const [loc, setLoc] = useState(() => parseLoc(win?.props?.location))
  const [back, setBack] = useState([])
  const [fwd, setFwd] = useState([])
  const [view, setView] = useState('icon')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [getInfo, setGetInfo] = useState(null)

  const appChildren = Object.values(appsMeta)
    .filter((m) => m.id !== 'launchpad')
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((m) => ({ id: 'app-' + m.id, name: m.name, type: 'app', appId: m.id }))

  const desktopChildren = [
    ...desktopIcons.map((d) => {
      if (d.kind === 'hd') return { id: 'macintosh-hd', name: d.name, type: 'drive' }
      if (d.kind === 'pdf') return { id: 'resume', name: d.name, type: 'pdf', detail: 'Portfolio résumé' }
      if (d.kind === 'trash') return { id: 'trash', name: d.name, type: 'folder' }
      return { id: 'projects', name: d.name, type: 'folder' }
    }),
    ...s.desktopFolders.map((f) => ({ id: 'f-' + f, name: f, type: 'folder', children: [] })),
  ]

  const smartFolders = {
    recents: { id: 'smart-recents', name: 'Recents', children: s.recentItems },
    applications: { id: 'smart-applications', name: 'Applications', children: appChildren },
    desktop: { id: 'smart-desktop', name: 'Desktop', children: desktopChildren },
    icloud: {
      id: 'smart-icloud',
      name: 'iCloud Drive',
      children: ['projects', 'documents', 'photos']
        .map((id) => findNode(fileSystem, id))
        .filter(Boolean),
    },
    network: {
      id: 'smart-network',
      name: 'Network',
      children: [
        {
          id: 'net-mac',
          name: `${profile.firstName}’s MacBook Pro`,
          type: 'folder',
          children: [findNode(fileSystem, 'me')].filter(Boolean),
        },
      ],
    },
  }

  const resolve = (l) => {
    if (!l) return fileSystem
    if (l.type === 'smart') {
      const tag = l.kind.startsWith('tags/') ? l.kind.slice(5) : null
      if (tag) {
        return { id: 'smart-tag-' + tag, name: tag, children: findNodesByTag(fileSystem, tag) }
      }
      return smartFolders[l.kind] || { id: 'smart-' + l.kind, name: l.kind, children: [] }
    }
    return l.node || findNode(fileSystem, l.id) || fileSystem
  }

  const current = resolve(loc)
  const rawChildren = current.children || []
  const children = query.trim()
    ? rawChildren.filter((c) => c.name?.toLowerCase().includes(query.toLowerCase()))
    : rawChildren

  const navigate = (next) => {
    setBack((b) => [...b, loc])
    setFwd([])
    setLoc(next)
    setSelected(null)
    setQuery('')
  }

  const goBack = () => {
    if (!back.length) return
    setFwd((f) => [...f, loc])
    setLoc(back[back.length - 1])
    setBack((b) => b.slice(0, -1))
  }
  const goForward = () => {
    if (!fwd.length) return
    setBack((b) => [...b, loc])
    setLoc(fwd[fwd.length - 1])
    setFwd((f) => f.slice(0, -1))
  }

  const activeLoc = (l) =>
    l.type === 'smart'
      ? loc?.type === 'smart' && loc.kind === l.kind
      : loc?.type === 'node' && loc.id === l.id

  useEffect(() => {
    const target = win?.props?.location
    if (!target) return
    const next = parseLoc(target)
    const key = next.type === 'smart' ? 'smart:' + next.kind : next.id
    const cur = loc.type === 'smart' ? 'smart:' + loc.kind : loc.id
    if (key === cur) return
    navigate(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win?.props?.location])

  const open = (node) => {
    actions.addRecent(snapshot(node))
    if (node.type === 'project') {
      const link = node.project?.link || node.link
      if (link) return actions.openApp('safari', { props: { url: link } })
      return setGetInfo(node)
    }
    if (node.type === 'folder' || node.type === 'drive') {
      if (node.id === 'trash') return actions.openApp('trash')
      sound.click()
      const real = findNode(fileSystem, node.id)
      navigate(real ? { type: 'node', id: node.id } : { type: 'node', id: node.id, node })
      return
    }
    if (node.type === 'pdf') {
      return actions.openApp('preview', { props: { nodeId: node.id } })
    }
    if (node.type === 'app') return actions.openApp(node.appId)
    if (node.type === 'image') return actions.openApp('photos')
    setGetInfo(node)
  }

  const crumb = pathTo(fileSystem, current.id).length
    ? pathTo(fileSystem, current.id).map((n) => n.name)
    : [current.name]

  const favorites = [
    { label: 'AirDrop', icon: 'bolt', kind: 'airdrop' },
    { label: 'Recents', icon: 'clock', kind: 'recents' },
    { label: 'Applications', icon: 'applications', kind: 'applications' },
    { label: 'Desktop', icon: 'desktop', kind: 'desktop' },
    { label: 'Documents', icon: 'file', id: 'documents' },
    { label: 'Downloads', icon: 'download', id: 'downloads' },
  ]

  const locationsSide = [
    { label: 'Macintosh HD', icon: 'desktop', id: 'macintosh-hd' },
    { label: 'Network', icon: 'globe', kind: 'network' },
  ]

  return (
    <div className="app" style={{ position: 'relative' }}>
      <div className="sidebar">
        <div className="sidebar__section">Favorites</div>
        {favorites.map((item) => {
          const l = item.kind ? { type: 'smart', kind: item.kind } : { type: 'node', id: item.id }
          return (
            <div
              key={item.label}
              className={`sidebar__item ${activeLoc(l) ? 'active' : ''}`}
              onClick={() => navigate(l)}
            >
              <span className="ic">
                <Icon name={item.icon} size={15} />
              </span>
              {item.label}
            </div>
          )
        })}
        <div className="sidebar__section">iCloud</div>
        <div
          className={`sidebar__item ${activeLoc({ type: 'smart', kind: 'icloud' }) ? 'active' : ''}`}
          onClick={() => navigate({ type: 'smart', kind: 'icloud' })}
        >
          <span className="ic">
            <Icon name="cloud" size={15} />
          </span>
          iCloud Drive
        </div>
        <div className="sidebar__section">Locations</div>
        {locationsSide.map((item) => {
          const l = item.kind ? { type: 'smart', kind: item.kind } : { type: 'node', id: item.id }
          return (
            <div
              key={item.label}
              className={`sidebar__item ${activeLoc(l) ? 'active' : ''}`}
              onClick={() => navigate(l)}
            >
              <span className="ic">
                <Icon name={item.icon} size={15} />
              </span>
              {item.label}
            </div>
          )
        })}
        <div className="sidebar__section">Tags</div>
        {[
          ['Work', '#ff9500'],
          ['Personal', '#34c759'],
          ['Important', '#ff3b30'],
        ].map(([n, c]) => (
          <div
            key={n}
            className={`sidebar__item ${activeLoc({ type: 'smart', kind: 'tags/' + n }) ? 'active' : ''}`}
            onClick={() => navigate({ type: 'smart', kind: 'tags/' + n })}
          >
            <span className="ic" style={{ color: c }}>
              <Icon name="tag" size={15} />
            </span>
            {n}
          </div>
        ))}
      </div>

      <div className="app-main">
        <div className="toolbar">
          <button className="iconbtn" onClick={goBack} disabled={!back.length} style={{ opacity: back.length ? 1 : 0.35 }}>
            <Icon name="chevronLeft" />
          </button>
          <button className="iconbtn" onClick={goForward} disabled={!fwd.length} style={{ opacity: fwd.length ? 1 : 0.35 }}>
            <Icon name="chevronRight" />
          </button>
          <span style={{ fontWeight: 600, fontSize: 13, marginLeft: 4 }}>{current.name}</span>
          <div className="spacer" />
          <button className={`iconbtn ${view === 'icon' ? 'on' : ''}`} onClick={() => setView('icon')}>
            <Icon name="grid" />
          </button>
          <button className={`iconbtn ${view === 'list' ? 'on' : ''}`} onClick={() => setView('list')}>
            <Icon name="list" />
          </button>
          <button className={`iconbtn ${view === 'column' ? 'on' : ''}`} onClick={() => setView('column')}>
            <Icon name="columns" />
          </button>
          <button className={`iconbtn ${view === 'gallery' ? 'on' : ''}`} onClick={() => setView('gallery')}>
            <Icon name="gallery" />
          </button>
          <div className="searchbox" style={{ marginLeft: 8 }}>
            <Icon name="search" size={14} />
            <input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="app-scroll">
          {children.length === 0 && <div className="empty-state">Folder is empty</div>}

          {view === 'icon' && children.length > 0 && (
            <div className="finder-grid">
              {children.map((node) => (
                <div
                  key={node.id}
                  className={`finder-item ${selected === node.id ? 'selected' : ''}`}
                  onClick={() => setSelected(node.id)}
                  onDoubleClick={() => open(node)}
                >
                  <NodeIcon node={node} className="finder-item__img" />
                  <span>{node.name}</span>
                </div>
              ))}
            </div>
          )}

          {view === 'list' && children.length > 0 && (
            <table className="finder-list">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Name</th>
                  <th>Kind</th>
                  <th>Size</th>
                  <th>Date Modified</th>
                </tr>
              </thead>
              <tbody>
                {children.map((node) => (
                  <tr
                    key={node.id}
                    className={selected === node.id ? 'selected' : ''}
                    onClick={() => setSelected(node.id)}
                    onDoubleClick={() => open(node)}
                  >
                    <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <NodeIcon node={node} size={18} />
                      {node.name}
                    </td>
                    <td style={{ color: 'var(--text-3)' }}>{kindLabel(node.type)}</td>
                    <td style={{ color: 'var(--text-3)' }}>{(node.name.length * 12) % 4096 + ' KB'}</td>
                    <td style={{ color: 'var(--text-3)' }}>Today, 11:32 AM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {view === 'column' && children.length > 0 && (
            <div className="finder-grid" style={{ gridTemplateColumns: '1fr' }}>
              {children.map((node) => (
                <div
                  key={node.id}
                  className={`finder-item ${selected === node.id ? 'selected' : ''}`}
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 10, padding: '6px 14px' }}
                  onClick={() => setSelected(node.id)}
                  onDoubleClick={() => open(node)}
                >
                  <NodeIcon node={node} size={22} />
                  <span>{node.name}</span>
                </div>
              ))}
            </div>
          )}

          {view === 'gallery' && children.length > 0 && (
            <div className="finder-grid">
              {children.map((node) => (
                <div key={node.id} className="finder-item" onDoubleClick={() => open(node)} onClick={() => setSelected(node.id)}>
                  <span style={{ width: 120, height: 90, display: 'block', borderRadius: 6, background: 'linear-gradient(135deg,#5ac8fa,#af52de)' }} />
                  <span>{node.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pathbar">
          <Icon name="home" size={13} />
          {crumb.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="chevronRight" size={11} /> {c}
            </span>
          ))}
        </div>
      </div>

      {getInfo && (
        <div
          style={{
            position: 'absolute', right: 20, top: 60, width: 260, borderRadius: 10,
            background: 'var(--sheet-bg)', boxShadow: 'var(--shadow-window)', padding: 16, zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <b style={{ fontSize: 13 }}>{getInfo.name} Info</b>
            <button className="iconbtn" onClick={() => setGetInfo(null)}>
              <Icon name="x" size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', marginBottom: 10 }}>
            <NodeIcon node={getInfo} size={64} />
          </div>
          <div className="getinfo">
            <p><span>Kind</span><span>{kindLabel(getInfo.type)}</span></p>
            <p><span>Size</span><span>{getInfo.name.length * 24} KB</span></p>
            <p><span>Created</span><span>2024</span></p>
            <p><span>Owner</span><span>{kindLabel(getInfo.type)}</span></p>
          </div>
          {(getInfo.project?.link || getInfo.link) && (
            <button
              className="btn primary"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => actions.openApp('safari', { props: { url: getInfo.project?.link || getInfo.link } })}
            >
              Open Link
            </button>
          )}
        </div>
      )}
    </div>
  )
}