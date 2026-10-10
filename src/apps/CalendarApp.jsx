import { useState } from 'react'
import Icon from '../icons/UIIcons.jsx'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarApp() {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(today.getDate())

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevDays - i, muted: true })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false })
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - firstDow - daysInMonth + 1, muted: true })

  const events = {
    [today.getDate()]: ['Team standup', 'Design review'],
    [Math.min(daysInMonth, today.getDate() + 3)]: ['Deploy to production'],
    [Math.max(1, today.getDate() - 2)]: ['1:1 with manager'],
  }

  const move = (dir) => setCursor(new Date(year, month + dir, 1))

  return (
    <div className="calendar">
      <div className="calendar__head">
        <div>
          <span className="calendar__title">{cursor.toLocaleString('en-US', { month: 'long' })}</span>{' '}
          <span style={{ fontSize: 22, color: 'var(--text-3)' }}>{year}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="iconbtn" onClick={() => move(-1)}>
            <Icon name="chevronLeft" />
          </button>
          <button className="btn" style={{ flex: 'none' }} onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today.getDate()) }}>
            Today
          </button>
          <button className="iconbtn" onClick={() => move(1)}>
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>

      <div className="calendar__dow">
        {DOW.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateRows: `auto 1fr`, minHeight: 0 }}>
        <div className="calendar__grid" style={{ display: 'contents' }} />
        <div className="calendar__grid">
          {cells.map((c, i) => {
            const isToday = !c.muted && c.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            return (
              <div
                key={i}
                className={`calendar__cell ${c.muted ? 'muted' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => !c.muted && setSelected(c.day)}
                style={{ outline: selected === c.day && !c.muted ? '2px solid var(--blue)' : 'none' }}
              >
                <span className="num">{c.day}</span>
                {!c.muted && events[c.day]?.map((e) => (
                  <span className="calendar__event" key={e}>{e}</span>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
