import { useEffect, useState } from 'react'
import { launchpadApps, appsMeta } from '../data/appsMeta.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import Icon from '../icons/UIIcons.jsx'
import { registry } from './registry.jsx'
import { useSystem } from './store.js'

const dockHome = ['messages', 'mail', 'safari', 'photos', 'music']

export default function MobileHome() {
  const s = useSystem()
  const [open, setOpen] = useState(null)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const wallpaper = s.wallpapers.find((w) => w.id === s.wallpaperId) || s.wallpapers[0]
  const App = open ? registry[open] : null

  if (App) {
    return (
      <div className="ios-window">
        <div className="ios-window__bar">
          <button onClick={() => setOpen(null)}>‹ Back</button>
          <div style={{ flex: 1, textAlign: 'center' }}>{appsMeta[open]?.name}</div>
          <button style={{ opacity: 0 }}>‹</button>
        </div>
        <div className="window__body">
          <App />
        </div>
      </div>
    )
  }

  return (
    <div className="ios" style={{ backgroundImage: wallpaper.css }}>
      <div className="ios__clock">
        <div className="date">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <div className="time">{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}</div>
      </div>

      <div className="ios__grid">
        {launchpadApps.map((a) => (
          <div key={a} className="ios__app" onClick={() => setOpen(a)}>
            <div className="ios__app__icon">
              <AppIcon app={a} size={62} />
            </div>
            <span>{appsMeta[a].name}</span>
          </div>
        ))}
      </div>

      <div className="ios__dock">
        {dockHome.map((a) => (
          <div key={a} className="ios__app" onClick={() => setOpen(a)}>
            <div className="ios__app__icon">
              <AppIcon app={a} size={58} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 130, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.7)' }} />
    </div>
  )
}