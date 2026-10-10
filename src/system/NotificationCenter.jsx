import { useState } from 'react'
import { actions, useSystem } from './store.js'
import { profile } from '../data/profile.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import Icon from '../icons/UIIcons.jsx'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function MiniCalendar({ now }) {
  const y = now.getFullYear()
  const m = now.getMonth()
  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  return (
    <div className="cal-widget__grid">
      {DOW.map((d, i) => (
        <span className="dow" key={i}>{d}</span>
      ))}
      {cells.map((d, i) => (
        <span key={i} className={`day ${d === now.getDate() ? 'today' : ''}`}>
          {d ?? ''}
        </span>
      ))}
    </div>
  )
}

export default function NotificationCenter() {
  const s = useSystem()
  const [now] = useState(() => new Date())
  const open = s.notifCenterOpen

  if (!open) return null

  return (
    <div className="panel notif-center" onMouseDown={(e) => e.stopPropagation()}>
      <div className="widget" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <MiniCalendar now={now} />
        <button className="widget-label-btn" onClick={() => actions.openApp('calendar')}>
          Open Calendar ›
        </button>
      </div>

      <div className="widget weather-widget">
        <div>
          <div className="cc-label" style={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>Weather</div>
          <div style={{ fontSize: 13.5 }}>{profile.location.split(',')[0]}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>H:72° L:58°</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon name="sun" size={30} color="#ff9500" />
          <div className="temp">68°</div>
        </div>
      </div>

      <div className="widget">
        <div className="cc-label">Notes</div>
        <div style={{ width: 200, height: 96, margin: '0 auto', background: 'var(--yellow)', borderRadius: 8, padding: 10, color: '#4a3300', fontSize: 12.5, lineHeight: 1.5, boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
          <b style={{ display: 'block' }}>Quick note</b>
          {s.notes?.[0]?.body?.split('\n')[0] || profile.notes[0].body.split('\n')[0]}
        </div>
        <button className="widget-label-btn" onClick={() => actions.openApp('notes')}>
          Open Notes ›
        </button>
      </div>

      <div className="widget">
        <div className="cc-label">Notifications</div>
        <button className="widget-label-btn" style={{ float: 'none' }} onClick={actions.clearNotifications}>
          Clear ›
        </button>
        {s.notifications.length === 0 && (
          <div style={{ padding: '18px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
            No Notifications
          </div>
        )}
        {s.notifications.slice(0, 8).map((n) => (
          <div key={n.id} className="notification" style={{ marginBottom: 8 }}>
            <span className="notification__ic">
              <AppIcon app={n.appId} size={34} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{n.title}</b>
              <p>{n.body}</p>
            </div>
            <span style={{ color: 'var(--text-3)', fontSize: 10.5, flex: 'none' }}>
              {new Date(n.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}