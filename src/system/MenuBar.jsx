import { useEffect, useRef, useState } from 'react'
import { actions, useSystem } from './store.js'
import { appsMeta } from '../data/appsMeta.js'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'
import { BrandLogo } from '../icons/AppIcons.jsx'
import { LOCATION, useWeather, weatherIcon, weatherLabel } from './useWeather.js'

/* ---------------------------------------------------------------- *
 * Menu definitions
 * ---------------------------------------------------------------- */
function appleMenu() {
  return [
    { label: 'About This Mac', onClick: () => actions.openApp('about') },
    { type: 'sep' },
    { label: 'System Settings…', onClick: () => actions.openApp('settings') },
    { label: 'App Store…', onClick: () => actions.openApp('appstore') },
    { label: 'Recent Items', submenu: (state) => (state.recentlyOpened.length ? state.recentlyOpened.map((a) => ({ label: appsMeta[a]?.name || a, onClick: () => actions.openApp(a) })) : [{ label: 'None', disabled: true }]) },
    { type: 'sep' },
    { label: 'Force Quit…', shortcut: '⌥⌘⎋', onClick: () => actions.showDialog({ forceQuit: true, title: 'Force Quit Applications', message: 'Select an app to force quit.' }) },
    { type: 'sep' },
    { label: 'Sleep', onClick: () => actions.sleep() },
    { label: 'Restart…', onClick: () => actions.restart() },
    { label: 'Shut Down…', onClick: () => actions.shutdown() },
    { type: 'sep' },
    { label: 'Lock Screen', shortcut: '⌃⌘Q', onClick: () => actions.lock() },
    { label: 'Log Out…', shortcut: '⇧⌘Q', onClick: () => actions.lock() },
  ]
}

function appMenu(appId) {
  const name = appsMeta[appId]?.name || 'Finder'
  return [
    { label: `About ${name}`, onClick: () => actions.openApp('about') },
    { type: 'sep' },
    { label: 'Settings…', shortcut: '⌘,', onClick: () => actions.openApp('settings') },
    { type: 'sep' },
    { label: `Hide ${name}`, shortcut: '⌘H', onClick: () => actions.minimizeActive() },
    { label: 'Hide Others', shortcut: '⌥⌘H', disabled: true },
    { label: 'Show All', disabled: true },
    { type: 'sep' },
    { label: `Quit ${name}`, shortcut: '⌘Q', onClick: () => actions.requestQuit(appId) },
  ]
}

const fileMenu = [
  { label: 'New Window', shortcut: '⌘N', onClick: () => actions.closeAllPanels() },
  { label: 'Open…', shortcut: '⌘O' },
  { type: 'sep' },
  { label: 'Close Window', shortcut: '⌘W', onClick: () => actions.closeActive() },
  { label: 'Save', shortcut: '⌘S' },
  { type: 'sep' },
  { label: 'Print…', shortcut: '⌘P', onClick: () => window.print() },
]

const editMenu = [
  { label: 'Undo', shortcut: '⌘Z' },
  { label: 'Redo', shortcut: '⇧⌘Z' },
  { type: 'sep' },
  { label: 'Cut', shortcut: '⌘X' },
  { label: 'Copy', shortcut: '⌘C' },
  { label: 'Paste', shortcut: '⌘V' },
  { label: 'Select All', shortcut: '⌘A' },
]

const viewMenu = [
  { label: 'as Icons', shortcut: '⌘1' },
  { label: 'as List', shortcut: '⌘2' },
  { label: 'as Columns', shortcut: '⌘3' },
  { type: 'sep' },
  { label: 'Enter Full Screen', shortcut: '⌃⌘F', onClick: () => { const el = document; if (el.fullscreenElement) el.exitFullscreen(); else el.documentElement.requestFullscreen?.() } },
]

const goMenu = [
  { label: 'Back', shortcut: '⌘[' },
  { label: 'Forward', shortcut: '⌘]' },
  { type: 'sep' },
  { label: 'Applications', onClick: () => actions.navigateFinder('smart:applications') },
  { label: 'Desktop', onClick: () => actions.navigateFinder('smart:desktop') },
  { label: 'Documents', onClick: () => actions.navigateFinder('documents') },
  { label: 'Downloads', onClick: () => actions.navigateFinder('downloads') },
]

function windowMenu(state) {
  const rows = state.windows.map((w) => ({ label: w.title, onClick: () => actions.focusWindow(w.id, true), check: w.id === state.activeWindowId }))
  return [
    { label: 'Minimise', shortcut: '⌘M', onClick: () => actions.minimizeActive() },
    { label: 'Zoom', onClick: () => state.activeWindowId && actions.maximizeWindow(state.activeWindowId) },
    { type: 'sep' },
    ...(rows.length ? rows : [{ label: 'No Windows', disabled: true }]),
    { type: 'sep' },
    { label: 'Bring All to Front' },
  ]
}

function helpMenu(appId) {
  return [
    { label: `${appsMeta[appId]?.name || 'Finder'} Help`, onClick: () => actions.notify({ appId, title: 'Help', body: 'This is a portfolio demo — try the Dock or Spotlight!' }) },
    { type: 'sep' },
    { label: 'Contact Me', onClick: () => actions.openApp('contacts') },
    { label: 'Download Résumé', onClick: () => window.open(profile.resumeUrl, '_blank') },
  ]
}

/* ---------------------------------------------------------------- *
 * Dropdown
 * ---------------------------------------------------------------- */
function Dropdown({ items, x, y, onClose, depth = 0, state }) {
  return (
    <div
      className="menu"
      style={depth ? undefined : { left: x, top: y }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((it, i) => {
        if (it.type === 'sep') return <div className="menu__sep" key={i} />
        return <MenuRow key={i} item={it} onClose={onClose} depth={depth} state={state} />
      })}
    </div>
  )
}

function MenuRow({ item, onClose, depth, state }) {
  const [open, setOpen] = useState(false)
  const sub = typeof item.submenu === 'function' ? item.submenu(state) : item.submenu
  return (
    <div
      className={`menu__row ${item.disabled ? 'disabled' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => {
        if (item.disabled) return
        if (sub) return
        item.onClick?.()
        onClose()
      }}
    >
      {item.check && <span className="check">✓</span>}
      <span className="menu__label">{item.label}</span>
      {item.shortcut && <span className="menu__shortcut">{item.shortcut}</span>}
      {sub && <span className="menu__shortcut">›</span>}
      {sub && open && (
        <div className="menu__sub">
          <Dropdown items={sub} depth={depth + 1} onClose={onClose} state={state} />
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * MenuBar
 * ---------------------------------------------------------------- */
const APP_MENUS = ['File', 'Edit', 'View', 'Go', 'Window', 'Help']

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function MenuBar() {
  const state = useSystem()
  const weather = useWeather()
  const wx = weather?.current
  const wxIcon = wx ? weatherIcon(wx.weather_code, wx.is_day) : null
  const [menu, setMenu] = useState(null) // { id, x, y }
  const barRef = useRef(null)
  const now = useClock()

  const activeApp = state.windows.find((w) => w.id === state.activeWindowId)?.appId ||
    state.windows[state.windows.length - 1]?.appId || 'finder'

  const open = (e, id) => {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    setMenu({ id, x: r.left, y: r.bottom + 3 })
  }

  const itemsFor = (id) => {
    if (id === 'apple') return appleMenu()
    if (id === 'app') return appMenu(activeApp)
    if (id === 'File') return fileMenu
    if (id === 'Edit') return editMenu
    if (id === 'View') return viewMenu
    if (id === 'Go') return goMenu
    if (id === 'Window') return windowMenu(state)
    if (id === 'Help') return helpMenu(activeApp)
    return []
  }

  return (
    <>
      <div className="menubar" ref={barRef} onMouseDown={(e) => { e.stopPropagation(); actions.closeAllPanels() }}>
        <div className={`menubar__item ${menu?.id === 'apple' ? 'open' : ''}`} onClick={(e) => open(e, 'apple')}>
          <span className="menubar__icon">
            <BrandLogo size={15} color="currentColor" />
          </span>
        </div>

        <div className={`menubar__item bold ${menu?.id === 'app' ? 'open' : ''}`} onClick={(e) => open(e, 'app')}>
          {appsMeta[activeApp]?.name || 'Finder'}
        </div>

        {APP_MENUS.map((m) => (
          <div key={m} className={`menubar__item ${menu?.id === m ? 'open' : ''}`} onClick={(e) => open(e, m)}>
            {m}
          </div>
        ))}

        <div className="menubar__spacer" />

        <div className="menubar__right">
          <div className="menubar__item" title={`Battery ${Math.round(state.battery * 100)}%`}>
            <span className="menubar__icon" style={{ gap: 4 }}>
              <span style={{ fontSize: 12 }}>{Math.round(state.battery * 100)}%</span>
              <Icon name={state.batteryCharging ? 'bolt' : 'battery'} size={18} />
            </span>
          </div>
          <div className="menubar__item">
            <Icon name={state.wifi ? 'wifi' : 'wifiOff'} size={17} />
          </div>
          <div className="menubar__item" style={{ opacity: state.bluetooth ? 1 : 0.4 }}>
            <Icon name="bluetooth" size={15} />
          </div>
          {wxIcon && (
            <div
              className="menubar__item"
              title={wx ? `${LOCATION.name} · ${Math.round(wx.temperature_2m)}° · ${weatherLabel(wx.weather_code)}` : LOCATION.name}
              onClick={() => actions.openApp('weather')}
            >
              <span className="menubar__icon" style={{ gap: 4 }}>
                <span style={{ fontSize: 12 }}>{Math.round(wx.temperature_2m)}°</span>
                <Icon name={wxIcon} size={13} />
              </span>
            </div>
          )}
          <div className={`menubar__item ${state.controlCenterOpen ? 'open' : ''}`} onClick={() => actions.toggleControlCenter()}>
            <Icon name="controlCenter" size={16} />
          </div>
          <div className="menubar__item" onClick={() => actions.openSpotlight()}>
            <Icon name="spotlight" size={16} />
          </div>
          <div className="menubar__item" onClick={() => actions.notify({ appId: 'facetime', title: 'Siri', body: "Hi! I can't hear you yet, but feel free to reach out." })}>
            <Icon name="siri" size={16} />
          </div>
          <div className={`menubar__item menubar__clock ${state.notifCenterOpen ? 'open' : ''}`} onClick={() => actions.toggleNotifCenter()}>
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
            {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </div>
        </div>
      </div>

      {menu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 5100 }} onMouseDown={() => setMenu(null)} />
          <Dropdown items={itemsFor(menu.id)} x={menu.x} y={menu.y} state={state} onClose={() => setMenu(null)} />
        </>
      )}
    </>
  )
}
