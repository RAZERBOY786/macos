import { useEffect } from 'react'
import { actions } from './store.js'
import sound from './sound.js'
import Icon from '../icons/UIIcons.jsx'

export function ShutdownScreen() {
  return (
    <div className="power">
      <button
        onClick={() => {
          sound.unlock()
          actions.powerOn()
        }}
      >
        Click to power on
      </button>
    </div>
  )
}

export function SleepScreen() {
  useEffect(() => {
    const wake = () => {
      sound.unlock()
      actions.setPhase('lock')
    }
    window.addEventListener('keydown', wake)
    window.addEventListener('mousedown', wake)
    return () => {
      window.removeEventListener('keydown', wake)
      window.removeEventListener('mousedown', wake)
    }
  }, [])
  return (
    <div className="power" style={{ background: '#000' }}>
      <div style={{ color: '#555', fontSize: 13, textAlign: 'center' }}>
        <Icon name="sleep" size={30} color="#555" style={{ marginBottom: 12 }} />
        <div>Sleeping…</div>
        <div style={{ marginTop: 6, color: '#3a3a3a' }}>Press any key to wake</div>
      </div>
    </div>
  )
}
