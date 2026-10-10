import { useEffect, useState } from 'react'
import { BrandLogo } from '../icons/AppIcons.jsx'
import { actions } from './store.js'

/**
 * BootScreen — black screen with a white logo and a progress bar. Once the
 * bar fills it advances straight to the login (lock) screen.
 */
export default function BootScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 9 + 3
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(() => actions.setPhase('lock'), 700)
      }
      setProgress(p)
    }, 150)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="boot">
      <div className="boot__logo">
        <BrandLogo size={76} />
      </div>
      <div className="boot__bar">
        <i style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
