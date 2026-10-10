import { useState } from 'react'
import { fileSystem, findNode, pathTo } from '../data/fs.js'
import { actions } from '../system/store.js'
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

export default function Finder({ win }) {
  const initial = (win?.props?.location && findNode(fileSystem, win.props.location)) || fileSystem
  const [stack, setStack] = useState([initial])
  const [view, setView] = useState('icon')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [getInfo, setGetInfo] = useState(null)

  const current = stack[stack.length - 1]
  const rawChildren = current.children || []
  const children = query.trim()
    ? rawChildren.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : rawChildren

  const open = (node) => {
    if (node.type === 'folder' || node.type === 'drive' || node.type === 'project') {
      if (node.type === 'project') return setGetInfo(node)
      sound.click()
      setStack((s) => [...s, node])
      setSelected(null)
    } else if (node.type === 'pdf') {
      actions.openApp('preview', { props: { nodeId: node.id } })
    } else if (node.type === 'app') {
      actions.openApp(node.appId)
    } else if (node.type === 'image') {
      actions.openApp('photos')
    } else {
      setGetInfo(node)
    }
  }

  const back = () => stack.length > 1 && setStack((s) => s.slice(0, -1))
  const forward = () => {}

  const crumb = pathTo(fileSystem, current.id).map((n) => n.name)

  return (
    <div className="app" style={{ position: 'relative' }}>
      <div className="sidebar">
        <div className="sidebar__section">Favorites</div>
        {[
          ['AirDrop', 'bolt'],
          ['Recents', 'clock'],
          ['Applications', 'applications'],
          ['Desktop', 'desktop'],
          ['Documents', 'file'],
          ['Downloads', 'download'],
        ].map(([n, ic]) => (
          <div key={n} className="sidebar__item">
            <span className="ic">
              <Icon name={ic} size={15} />
            </span>
            {n}
          </div>
        ))}
        <div className="sidebar__section">iCloud</div>
        <div className="sidebar__item">
          <span className="ic">
            <Icon name="cloud" size={15} />
          </span>
          iCloud Drive
        </div>
        <div className="sidebar__section">Locations</div>
        <div
          className={`sidebar__item ${current.id === 'macintosh-hd' ? 'active' : ''}`}
          onClick={() => setStack([fileSystem])}
        >
          <span className="ic">
            <Icon name="desktop" size={15} />
          </span>
          Macintosh HD
        </div>
        <div className="sidebar__item">
          <span className="ic">
            <Icon name="globe" size={15} />
          </span>
          Network
        </div>
        <div className="sidebar__section">Tags</div>
        {[
          ['Work', '#ff9500'],
          ['Personal', '#34c759'],
          ['Important', '#ff3b30'],
        ].map(([n, c]) => (
          <div key={n} className="sidebar__item">
            <span className="ic" style={{ color: c }}>
              <Icon name="tag" size={15} />
            </span>
            {n}
          </div>
        ))}
      </div>

      <div className="app-main">
        <div className="toolbar">
          <button className="iconbtn" onClick={back} disabled={stack.length < 2} style={{ opacity: stack.length < 2 ? 0.35 : 1 }}>
            <Icon name="chevronLeft" />
          </button>
          <button className="iconbtn" onClick={forward} style={{ opacity: 0.35 }}>
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
                    <td style={{ color: 'var(--text-3)' }}>{node.type}</td>
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
            <p><span>Kind</span><span>{getInfo.type}</span></p>
            <p><span>Size</span><span>{getInfo.name.length * 24} KB</span></p>
            <p><span>Created</span><span>2024</span></p>
            <p><span>Owner</span><span>{getInfo.type}</span></p>
          </div>
          {getInfo.project && (
            <button
              className="btn primary"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => actions.openApp('safari', { props: { url: getInfo.project.link } })}
            >
              Open Link
            </button>
          )}
        </div>
      )}
    </div>
  )
}
