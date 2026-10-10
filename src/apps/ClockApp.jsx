import { useEffect, useRef, useState } from 'react'

const cities = [
  ['Cupertino', 'America/Los_Angeles'],
  ['New York', 'America/New_York'],
  ['London', 'Europe/London'],
  ['Tokyo', 'Asia/Tokyo'],
  ['Sydney', 'Australia/Sydney'],
]

function WorldClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const today = now.toLocaleDateString('en-US')
  return (
    <div>
      {cities.map(([city, tz]) => {
        const time = now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true })
        const d = now.toLocaleDateString('en-US', { timeZone: tz })
        const diff = new Date(now.toLocaleString('en-US', { timeZone: tz })).getHours() - now.getHours()
        return (
          <div key={city} className="setting-row">
            <div className="info">
              <b>{city}</b>
              <span>{d === today ? 'Today' : 'Tomorrow'} · {diff >= 0 ? '+' : ''}{diff}HRS</span>
            </div>
            <span style={{ fontSize: 26, fontWeight: 300 }}>{time}</span>
          </div>
        )
      })}
    </div>
  )
}

function Stopwatch() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const ref = useRef(null)
  useEffect(() => {
    if (running) {
      const start = Date.now() - ms
      ref.current = setInterval(() => setMs(Date.now() - start), 30)
    }
    return () => clearInterval(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])
  const fmt = (m) => {
    const cs = Math.floor((m % 1000) / 10)
    const s = Math.floor(m / 1000) % 60
    const min = Math.floor(m / 60000)
    return `${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, fontVariantNumeric: 'tabular-nums', fontWeight: 200 }}>{fmt(ms)}</div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '18px 0' }}>
        <button className="btn" style={{ flex: 'none', padding: '8px 22px' }} onClick={() => setLaps([fmt(ms), ...laps])} disabled={!running}>Lap</button>
        <button className="btn primary" style={{ flex: 'none', padding: '8px 22px' }} onClick={() => setRunning((r) => !r)}>{running ? 'Stop' : 'Start'}</button>
        <button className="btn" style={{ flex: 'none', padding: '8px 22px' }} onClick={() => { setRunning(false); setMs(0); setLaps([]) }}>Reset</button>
      </div>
      <div style={{ maxHeight: 180, overflow: 'auto' }}>
        {laps.map((l, i) => (
          <div key={i} className="setting-row"><span>Lap {laps.length - i}</span><b>{l}</b></div>
        ))}
      </div>
    </div>
  )
}

function Timer() {
  const [total, setTotal] = useState(600)
  const [left, setLeft] = useState(600)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRunning(false)
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])
  const pct = total ? (left / total) * 100 : 0
  return (
    <div style={{ textAlign: 'center', paddingTop: 10 }}>
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 20px' }}>
        <svg viewBox="0 0 100 100" width="220" height="220">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--hairline)" strokeWidth="6" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--orange)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 283} 283`} transform="rotate(-90 50 50)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 40, fontWeight: 200 }}>
          {`${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
        <button className="btn primary" style={{ flex: 'none', padding: '8px 22px' }} onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</button>
        <button className="btn" style={{ flex: 'none', padding: '8px 22px' }} onClick={() => { setRunning(false); setLeft(total) }}>Reset</button>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {[300, 600, 900].map((s) => (
          <button key={s} className="btn" style={{ flex: 'none' }} onClick={() => { setTotal(s); setLeft(s); setRunning(false) }}>{s / 60} min</button>
        ))}
      </div>
    </div>
  )
}

export default function ClockApp() {
  const [tab, setTab] = useState('World Clock')
  const tabs = ['World Clock', 'Stopwatch', 'Timer']
  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="toolbar">
        <div className="segmented">
          {tabs.map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="app-scroll" style={{ padding: '18px 22px' }}>
        {tab === 'World Clock' && <WorldClock />}
        {tab === 'Stopwatch' && <Stopwatch />}
        {tab === 'Timer' && <Timer />}
      </div>
    </div>
  )
}
