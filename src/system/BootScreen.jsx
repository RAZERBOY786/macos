import { useEffect, useRef, useState } from 'react'
import { BrandLogo } from '../icons/AppIcons.jsx'
import sound from './sound.js'
import { actions } from './store.js'

/**
 * BootScreen — black screen, white logo, a progress bar, then a
 * "click / press any key to start" hint. The startup chime plays on the
 * first user interaction (browsers require a gesture before audio).
 */
export default function BootScreen() {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 9 + 3
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(() => setReady(true), 450)
      }
      setProgress(p)
    }, 150)
    return () => clearInterval(id)
  }, [])

  const start = () => {
    if (startedRef.current || !ready) return
    startedRef.current = true
    sound.unlock()
    sound.chime()
    actions.markInteracted()
    setTimeout(() => actions.setPhase('lock'), 900)
  }

  useEffect(() => {
    if (!ready) return
    const onKey = () => start()
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className={`boot ${ready ? 'boot--clickable' : ''}`} onMouseDown={start}>
      <div className="boot__logo">
        <BrandLogo size={76} />
      </div>
      <div className="boot__bar">
        <i style={{ width: `${progress}%` }} />
      </div>
      {ready && <div className="boot__hint">Press any key or click to start</div>}
    </div>
  )
}
