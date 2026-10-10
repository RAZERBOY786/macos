import { useSystem } from './store.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import { appsMeta } from '../data/appsMeta.js'

export default function AppSwitcher() {
  const s = useSystem()
  if (!s.switcherOpen) return null
  const apps = s.dockRunning
  const idx = s.switcherIndex % Math.max(1, apps.length)

  return (
    <div className="switcher">
      {apps.map((a, i) => (
        <div key={a} className={`switcher__item ${i === idx ? 'active' : ''}`} style={{ position: 'relative' }}>
          <AppIcon app={a} size={'100%'} />
          {i === idx && <span className="switcher__label">{appsMeta[a]?.name}</span>}
        </div>
      ))}
    </div>
  )
}