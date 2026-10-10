import { useEffect, useRef, useState } from 'react'
import { actions, useSystem } from './system/store.js'
import BootScreen from './system/BootScreen.jsx'
import LockScreen from './system/LockScreen.jsx'
import { ShutdownScreen, SleepScreen } from './system/PowerScreens.jsx'
import MenuBar from './system/MenuBar.jsx'
import Desktop from './system/Desktop.jsx'
import Dock from './system/Dock.jsx'
import Window from './system/Window.jsx'
import ControlCenter from './system/ControlCenter.jsx'
import NotificationCenter from './system/NotificationCenter.jsx'
import Spotlight from './system/Spotlight.jsx'
import Launchpad from './system/Launchpad.jsx'
import MissionControl from './system/MissionControl.jsx'
import AppSwitcher from './system/AppSwitcher.jsx'
import Dialog from './system/Dialog.jsx'
import ContextMenu from './system/ContextMenu.jsx'
import Toasts from './system/Toasts.jsx'
import MobileHome from './system/MobileHome.jsx'
import sound from './system/sound.js'

/* ------------------------------------------------------------------ *
 * Screenshot (Cmd/Ctrl+Shift+3) — serialises the live DOM into a PNG.
 * ------------------------------------------------------------------ */
function captureScreenshot() {
  const root = document.querySelector('.app-root')
  if (!root) return
  const width = window.innerWidth
  const height = window.innerHeight
  const clone = root.cloneNode(true)
  // Remove bezels that don't translate well
  clone.querySelectorAll('.launchpad, .switcher, .menu, .ctx').forEach((n) => n.remove())
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${new XMLSerializer().serializeToString(clone)}</div>
    </foreignObject></svg>`
  const blob = new Blob([html], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width * 2
    canvas.height = height * 2
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.scale(2, 2)
    ctx.drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(url)
    const a = document.createElement('a')
    a.download = `Screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
    actions.notify({ appId: 'finder', title: 'Screenshot', body: 'Saved to your Downloads.' })
  }
  img.src = url
  img.onerror = () => actions.notify({ appId: 'finder', title: 'Screenshot', body: 'Could not capture — sorry!' })
}

/* ------------------------------------------------------------------ *
 * Global keyboard shortcuts
 * ------------------------------------------------------------------ */
function useShortcuts() {
  const stateRef = useRef(null)
  const st = useSystem()

  useEffect(() => {
    stateRef.current = st
  }, [st])

  useEffect(() => {
    const down = (e) => {
      const mod = e.metaKey || e.ctrlKey
      const s = stateRef.current
      if (s.phase !== 'desktop') return

      if (mod && e.key === ' ' && !e.shiftKey) {
        e.preventDefault()
        if (s.spotlightOpen) actions.closeSpotlight()
        else actions.openSpotlight()
      } else if (mod && e.key === 'Tab') {
        e.preventDefault()
        if (!s.switcherOpen) actions.openSwitcher()
        else actions.cycleSwitcher(e.shiftKey ? -1 : 1)
      } else if (mod && e.key.toLowerCase() === 'q') {
        e.preventDefault()
        const win = s.windows.find((w) => w.id === s.activeWindowId)
        if (win) actions.requestQuit(win.appId)
      } else if (mod && e.key.toLowerCase() === 'w') {
        e.preventDefault()
        actions.closeActive()
      } else if (mod && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        actions.minimizeActive()
      } else if (mod && e.key === ',') {
        e.preventDefault()
        actions.openApp('settings')
      } else if (mod && e.shiftKey && e.key === '3') {
        e.preventDefault()
        captureScreenshot()
      } else if (e.key === 'F1' || e.key === 'F3' || (e.key === 'm' && e.ctrlKey)) {
        e.preventDefault()
        actions.toggleLaunchpad()
      } else if (mod && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        actions.lock()
      }
    }
    const up = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Tab' && stateRef.current?.switcherOpen) {
        actions.closeSwitcher()
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])
}

/* ------------------------------------------------------------------ *
 * Battery API
 * ------------------------------------------------------------------ */
function useBattery() {
  useEffect(() => {
    const nav = navigator
    if (!nav.getBattery) return
    nav.getBattery().then((bat) => {
      const update = () => actions.setBattery(bat.level, bat.charging)
      update()
      bat.addEventListener('levelchange', update)
      bat.addEventListener('chargingchange', update)
    }).catch(() => {})
  }, [])
}

function useTheme() {
  const s = useSystem()
  useEffect(() => {
    const root = document.documentElement
    let theme = s.theme
    if (theme === 'auto') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    root.dataset.theme = theme
    root.style.setProperty('--blue', s.accent)
  }, [s.theme, s.accent])
}

/* ------------------------------------------------------------------ *
 * Device mode — phone/tablet show the iOS home, desktop shows macOS.
 * Honours ?os=desktop / ?os=ios overrides. Re-evaluated on resize so
 * rotating the device or resizing the browser switches live.
 * ------------------------------------------------------------------ */
function computeMobile() {
  const os = new URLSearchParams(window.location.search).get('os')
  if (os === 'desktop') return false
  if (os === 'ios') return true
  return window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
}

/* ------------------------------------------------------------------ *
 * App
 * ------------------------------------------------------------------ */
export default function App() {
  const s = useSystem()
  useShortcuts()
  useBattery()
  useTheme()
  const [isMobile, setIsMobile] = useState(computeMobile)

  useEffect(() => {
    const os = new URLSearchParams(window.location.search).get('os')
    if (os === 'desktop' || os === 'ios') return
    const mq = window.matchMedia('(max-width: 820px), (pointer: coarse)')
    const update = () => setIsMobile(computeMobile())
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  /* demo helpers — ?skp=1 boots straight to desktop, ?wall & ?app preload */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const wall = q.get('wall')
    const app = q.get('app')
    if (wall) actions.setWallpaper(wall)
    if (q.has('skp') || app) {
      const t = setTimeout(() => {
        if (app) actions.openApp(app)
        actions.unlock()
      }, 60)
      return () => clearTimeout(t)
    }
  }, [])

  /* first-interaction unlocks audio */
  useEffect(() => {
    const unlock = () => sound.unlock()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  /* hint auto-dismiss */
  useEffect(() => {
    if (!s.showHint) return
    const t = setTimeout(() => actions.dismissHint(), 8000)
    return () => clearTimeout(t)
  }, [s.showHint])

  if (s.phase === 'shutdown') return <ShutdownScreen />
  if (s.phase === 'sleep') return <SleepScreen />
  if (s.phase !== 'desktop') return <BootOrLock phase={s.phase} />
  if (isMobile) {
    return (
      <div className="app-root">
        <MobileHome />
      </div>
    )
  }

  return (
    <div className="app-root" onMouseDown={() => actions.closeAllPanels()}>
      <MenuBar />
      <Desktop />
      <div className="window-layer" style={{ position: 'absolute', inset: '26px 0 0 0', zIndex: 10, pointerEvents: 'none' }}>
        {s.windows
          .filter((w) => !w.minimized)
          .map((w) => (
            <div key={w.id} style={{ pointerEvents: 'auto' }}>
              <Window win={w} active={s.activeWindowId === w.id} dockPosition={s.dock.position} />
            </div>
          ))}
      </div>
      <Dock />

      {s.controlCenterOpen && <ControlCenter />}
      {s.notifCenterOpen && <NotificationCenter />}
      {s.spotlightOpen && <Spotlight />}
      {s.launchpadOpen && <Launchpad />}
      {s.missionOpen && <MissionControl />}
      {s.switcherOpen && <AppSwitcher />}
      <Dialog />
      <ContextMenu />
      <Toasts />

      {s.showHint && <div className="hint">Double-click icons to open apps · Press ⌘Space for Spotlight</div>}

      <div className="dim-overlay" style={{ opacity: (1 - s.brightness) * 0.82 }} />
    </div>
  )
}

function BootOrLock({ phase }) {
  if (phase === 'boot') return <BootScreen />
  if (phase === 'lock') return <LockScreen />
  return null
}