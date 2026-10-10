import { actions, useSystem } from './store.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import { appsMeta } from '../data/appsMeta.js'

export default function MissionControl() {
  const s = useSystem()
  if (!s.missionOpen) return null
  const wins = s.windows.filter((w) => !w.minimized)

  return (
    <div className="mission" onMouseDown={(e) => { if (e.target === e.currentTarget) actions.closeMission() }}>
      <div className="mission__grid">
        <div className="mission__card" onClick={() => { actions.closeMission() }}>
          <div className="mission__thumb">
            <AppIcon app="finder" size={80} />
          </div>
          <div className="mission__name">Desktop</div>
        </div>
        {wins.map((w) => (
          <div
            key={w.id}
            className="mission__card"
            onClick={() => {
              actions.focusWindow(w.id, true)
              actions.closeMission()
            }}
          >
            <div className="mission__thumb">
              <div style={{ width: '60%', height: '70%', borderRadius: 8, background: 'var(--window-bg)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', display: 'grid', placeItems: 'center' }}>
                <AppIcon app={w.appId} size={52} />
              </div>
            </div>
            <div className="mission__name">{w.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}