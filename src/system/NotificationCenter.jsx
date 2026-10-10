import { useState } from 'react'
import { actions, useSystem } from './store.js'
import { profile } from '../data/profile.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import Icon from '../icons/UIIcons.jsx'
import { LOCATION, useWeather, weatherIcon, weatherLabel } from './useWeather.js'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const round = (v) => Math.round(v)

function ago(t) {
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000))
  if (s < 60) return 'now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

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
  const weather = useWeather()
  const cur = weather?.current
  const daily = weather?.daily
  const wxIcon = cur ? weatherIcon(cur.weather_code, cur.is_day === 1) : 'cloud'
  const open = s.notifCenterOpen

  if (!open) return null

  const topNote = s.notes?.[0] || profile.notes?.[0]
  const hi = daily ? round(daily.temperature_2m_max[0]) : null
  const lo = daily ? round(daily.temperature_2m_min[0]) : null

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

      <button className="widget weather-widget" onClick={() => actions.openApp('weather')}>
        <div>
          <div className="cc-label" style={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>Weather</div>
          <div style={{ fontSize: 13.5 }}>{LOCATION.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {cur ? `${weatherLabel(cur.weather_code)} · H:${hi}° L:${lo}°` : 'Loading…'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon name={wxIcon} size={30} color="#ff9500" />
          <div className="temp">{cur ? `${round(cur.temperature_2m)}°` : '--°'}</div>
        </div>
      </button>

      <div className="widget">
        <div className="cc-label">Notes</div>
        <button className="note-quick" onClick={() => actions.openApp('notes')}>
          <b>{topNote?.title || 'New Note'}</b>
          <span>{topNote?.body?.split('\n')[0] || 'No additional text'}</span>
        </button>
        <button className="widget-label-btn" onClick={() => actions.openApp('notes')}>
          Open Notes ›
        </button>
      </div>

      <div className="widget">
        <div className="cc-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Notifications</span>
          {s.notifications.length > 0 && (
            <button className="link-btn" onClick={actions.clearNotifications}>
              Clear
            </button>
          )}
        </div>
        {s.notifications.length === 0 && (
          <div style={{ padding: '18px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
            No Notifications
          </div>
        )}
        {s.notifications.slice(0, 8).map((n, i) => (
          <button
            key={n.id}
            className="notification notif-row"
            style={{ '--i': i }}
            onClick={() => {
              actions.openApp(n.appId)
              actions.closeAllPanels()
            }}
          >
            <span className="notification__ic">
              <AppIcon app={n.appId} size={34} />
            </span>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <b>{n.title}</b>
              <p>{n.body}</p>
            </div>
            <span style={{ color: 'var(--text-3)', fontSize: 10.5, flex: 'none' }}>{ago(n.time)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
