import { useEffect, useMemo, useRef, useState } from 'react'
import { actions, useSystem } from './store.js'
import { profile } from '../data/profile.js'
import sound from './sound.js'
import Icon from '../icons/UIIcons.jsx'

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function LockScreen() {
  const state = useSystem()
  const now = useNow()
  const [pw, setPw] = useState('')
  const [shake, setShake] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [zoom, setZoom] = useState(false)
  const inputRef = useRef(null)

  const wallpaper = useMemo(
    () => state.wallpapers.find((w) => w.id === state.wallpaperId) || state.wallpapers[0],
    [state.wallpapers, state.wallpaperId],
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const login = () => {
    if (!pw.trim()) {
      setShake(true)
      sound.error()
      setTimeout(() => setShake(false), 450)
      return
    }
    setPulse(true)
    sound.open()
    setTimeout(() => {
      setPulse(false)
      setZoom(true)
      setTimeout(() => actions.unlock(), 650)
    }, 550)
  }

  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className={`lock ${zoom ? 'lock__zoom' : ''}`}>
      <div className="lock__bg" style={{ backgroundImage: wallpaper.css }} />

      <div className="lock__clock">
        <div className="lock__date">{dateStr}</div>
        <div className="lock__time">{timeStr}</div>
      </div>

      <div className={`lock__avatar ${pulse ? 'rs-pulse' : ''}`} style={{ backgroundImage: `url("${profile.avatar}")` }} />
      <div className="lock__name">{profile.name}</div>

      <div className={`lock__field ${shake ? 'shake' : ''}`}>
        <Icon name="lock" size={15} color="rgba(255,255,255,0.85)" />
        <input
          ref={inputRef}
          type="password"
          placeholder="Enter Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
        />
        <button onClick={login} aria-label="Log in" style={{ display: 'grid', placeItems: 'center', color: '#fff' }}>
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
      <div className="lock__hint">Touch ID or enter password</div>

      <div className="lock__bottom">
        <button onClick={() => { sound.click(); actions.restart() }}>
          <Icon name="restart" size={20} />
          Restart
        </button>
        <button onClick={() => { sound.click(); actions.shutdown() }}>
          <Icon name="power" size={20} />
          Shut Down
        </button>
        <button onClick={() => { sound.click(); actions.sleep() }}>
          <Icon name="sleep" size={20} />
          Sleep
        </button>
      </div>
    </div>
  )
}
