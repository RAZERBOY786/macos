import { useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'
import { actions } from '../system/store.js'

const colors = ['#007aff', '#34c759', '#ff9500', '#af52de', '#ff2d55', '#5ac8fa', '#5856d6', '#ffcc00']

export default function AppStore() {
  const [installed, setInstalled] = useState({})
  const all = Object.entries(profile.skills).flatMap(([group, list]) =>
    list.map((name) => ({ name, group })),
  )

  const install = (name) => {
    setInstalled((i) => ({ ...i, [name]: true }))
    actions.notify({ appId: 'appstore', title: 'App Store', body: `“${name}” installed 🎉` })
    actions.notify({ appId: 'appstore', title: 'Skill unlocked', body: `${name} is now part of my toolkit.` })
  }

  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="toolbar">
        <Icon name="grid" size={15} color="var(--text-3)" />
        <b style={{ fontSize: 14 }}>Discover</b>
        <div className="spacer" />
        <span className="badge">{all.length} skills</span>
      </div>

      <div className="app-scroll" style={{ background: 'var(--window-bg-2)' }}>
        <div style={{ padding: '24px 26px 6px' }}>
          <h2 style={{ margin: 0 }}>Skills, packaged as apps</h2>
          <p style={{ color: 'var(--text-3)', marginTop: 4 }}>Everything I install into every project I build.</p>
        </div>
        <div className="store-grid">
          {all.map((s, i) => (
            <div className="store-card" key={s.name}>
              <span className="ic">
                <span
                  style={{
                    width: 54, height: 54, borderRadius: 14, display: 'grid', placeItems: 'center',
                    background: `linear-gradient(135deg, ${colors[i % colors.length]}, rgba(0,0,0,0.35))`,
                    color: '#fff', fontWeight: 700, fontSize: 20,
                  }}
                >
                  {s.name.slice(0, 2)}
                </span>
              </span>
              <div style={{ flex: 1 }}>
                <b>{s.name}</b>
                <p>{s.group} · Ready for production</p>
                <button
                  className="install-btn"
                  style={{ background: installed[s.name] ? 'var(--hover)' : 'var(--blue)', color: installed[s.name] ? 'var(--text)' : '#fff' }}
                  onClick={() => install(s.name)}
                >
                  {installed[s.name] ? 'Installed' : 'GET'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
