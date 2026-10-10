/**
 * store.js — a tiny dependency-free global store.
 * State lives outside React; components subscribe via useSystem().
 * A subset is persisted to localStorage.
 */
import { useEffect, useReducer } from 'react'
import { appsMeta } from '../data/appsMeta.js'

const STORAGE_KEY = 'macos-portfolio-v1'

/* ------------------------------------------------------------------ *
 * Default state
 * ------------------------------------------------------------------ */
function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const persisted = loadPersisted()

export function defaultWallpapers() {
  return [
    { id: 'sonoma', name: 'Sonoma', css: 'linear-gradient(160deg,#a8c0ff 0%,#fbc2eb 55%,#ffd9a0 100%)' },
    { id: 'ventura', name: 'Ventura', css: 'linear-gradient(200deg,#5b7cfa 0%,#8f6ed5 45%,#e0a3c4 100%)' },
    { id: 'graphite', name: 'Graphite', css: 'linear-gradient(160deg,#e8e8ec 0%,#c3c4c9 60%,#9a9ba1 100%)' },
    { id: 'sunrise', name: 'Sunrise', css: 'linear-gradient(180deg,#ff9a6c 0%,#ff6b9d 45%,#845ec2 100%)' },
    { id: 'aqua', name: 'Aqua', css: 'linear-gradient(160deg,#5ac8fa 0%,#007aff 60%,#1b3b8b 100%)' },
  ]
}

function initialState() {
  return {
    /* OS lifecycle */
    phase: persisted.phase === 'desktop' ? 'boot' : 'boot', // always boot on reload
    booted: false,
    userInteracted: false,
    shuttingDown: false,

    /* appearance */
    theme: persisted.theme || 'light', // light | dark | auto
    wallpaperId: persisted.wallpaperId || 'sonoma',
    wallpapers: defaultWallpapers(),
    brightness: persisted.brightness ?? 1, // 0.35 .. 1
    volume: persisted.volume ?? 0.7,
    muted: persisted.muted ?? false,

    /* system toggles */
    wifi: persisted.wifi ?? true,
    bluetooth: persisted.bluetooth ?? true,
    airdrop: persisted.airdrop ?? false,
    focus: false,
    airplane: false,
    wifiNetwork: 'Portfolio 5G',
    battery: 0.86,
    batteryCharging: false,

    /* dock */
    dock: persisted.dock || {
      size: 52,
      magnification: true,
      magnifyScale: 1.6,
      position: 'bottom',
      minimizeEffect: 'genie',
    },
    dockRunning: [], // appIds with open windows
    bouncing: null,

    /* windows */
    windows: [],
    activeWindowId: null,
    zTop: 10,
    closeDialog: null, // { appId, winId }

    /* panels & overlays */
    controlCenterOpen: false,
    notifCenterOpen: false,
    spotlightOpen: false,
    spotlightQuery: '',
    launchpadOpen: false,
    missionOpen: false,

    /* menus / context */
    openMenu: null, // { name, x, y }
    contextMenu: null, // { x, y, items }
    dialog: null, // { title, message, actions, icon }

    /* notifications */
    notifications: [],
    toasts: [],

    /* desktop */
    selectedIcons: [],
    desktopFolders: persisted.desktopFolders || ['Projects'],

    /* user data */
    notes: persisted.notes || null,
    reminders: persisted.reminders || null,
    files: persisted.files || null,

    /* misc */
    showHint: persisted.seenHint ? false : true,
    recentlyOpened: [],
    soundOn: persisted.soundOn ?? true,
    switcherOpen: false,
    switcherIndex: 0,
  }
}

let state = initialState()
const listeners = new Set()

/* ------------------------------------------------------------------ *
 * Persistence
 * ------------------------------------------------------------------ */
function persist() {
  try {
    const {
      theme, wallpaperId, brightness, volume, muted, wifi, bluetooth,
      airdrop, dock, desktopFolders, notes, reminders, files, soundOn,
    } = state
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme, wallpaperId, brightness, volume, muted, wifi, bluetooth,
        airdrop, dock, desktopFolders, notes, reminders, files, soundOn,
        seenHint: true,
      }),
    )
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ *
 * Core API
 * ------------------------------------------------------------------ */
export function getState() {
  return state
}

export function setState(patch) {
  const next = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

export function setPersist(patch) {
  setState(patch)
  persist()
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSystem() {
  const [, force] = useReducer((x) => x + 1, 0)
  useEffect(() => subscribe(force), [])
  return state
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */
export const actions = {
  /* lifecycle */
  setPhase(phase) {
    setState({ phase })
  },
  powerOn() {
    setState({ phase: 'boot', booted: false, shuttingDown: false })
  },
  sleep() {
    setState({ phase: 'sleep' })
  },
  shutdown() {
    setState({ phase: 'shutdown' })
  },
  restart() {
    setState({ phase: 'boot', booted: false, shuttingDown: false, windows: [], dockRunning: [], activeWindowId: null })
  },
  lock() {
    setState({ phase: 'lock', windows: state.windows })
  },
  unlock() {
    setState({ phase: 'desktop' })
  },
  markInteracted() {
    setState({ userInteracted: true })
  },
  setBooted() {
    setState({ booted: true })
  },

  /* appearance */
  setTheme(theme) {
    setPersist({ theme })
  },
  cycleTheme() {
    const order = ['light', 'dark', 'auto']
    const next = order[(order.indexOf(state.theme) + 1) % order.length]
    setPersist({ theme: next })
  },
  setWallpaper(id) {
    setPersist({ wallpaperId: id })
  },
  setBrightness(v) {
    setPersist({ brightness: v })
  },
  setVolume(v) {
    setPersist({ volume: v })
  },
  toggleMute() {
    setPersist({ muted: !state.muted })
  },

  /* toggles */
  toggleWifi() {
    setPersist({ wifi: !state.wifi })
  },
  toggleBluetooth() {
    setPersist({ bluetooth: !state.bluetooth })
  },
  toggleAirdrop() {
    setPersist({ airdrop: !state.airdrop })
  },
  toggleFocus() {
    setState({ focus: !state.focus })
    actions.notify({
      appId: 'settings',
      title: state.focus ? 'Focus Off' : 'Focus On',
      body: state.focus ? 'Notifications are enabled.' : 'Notifications are silenced.',
    })
  },
  toggleAirplane() {
    const airplane = !state.airplane
    setState({ airplane, wifi: airplane ? false : state.wifi, bluetooth: airplane ? false : state.bluetooth })
  },
  setBattery(level, charging) {
    setState({ battery: level, batteryCharging: !!charging })
  },

  /* dock */
  setDock(patch) {
    setPersist({ dock: { ...state.dock, ...patch } })
  },
  setBouncing(appId) {
    setState({ bouncing: appId })
    setTimeout(() => setState({ bouncing: null }), 700)
  },

  /* panels */
  toggleControlCenter() {
    setState({ controlCenterOpen: !state.controlCenterOpen, notifCenterOpen: false, openMenu: null })
  },
  toggleNotifCenter() {
    setState({ notifCenterOpen: !state.notifCenterOpen, controlCenterOpen: false, openMenu: null })
  },
  toggleLaunchpad() {
    setState({ launchpadOpen: !state.launchpadOpen, spotlightOpen: false })
  },
  openLaunchpad() {
    setState({ launchpadOpen: true })
  },
  closeLaunchpad() {
    setState({ launchpadOpen: false })
  },
  toggleSpotlight() {
    setState({ spotlightOpen: !state.spotlightOpen, spotlightQuery: '' })
  },
  openSpotlight() {
    setState({ spotlightOpen: true, spotlightQuery: '' })
  },
  closeSpotlight() {
    setState({ spotlightOpen: false })
  },
  setSpotlightQuery(q) {
    setState({ spotlightQuery: q })
  },
  toggleMission() {
    setState({ missionOpen: !state.missionOpen })
  },
  openMission() {
    setState({ missionOpen: true })
  },
  closeMission() {
    setState({ missionOpen: false })
  },
  closeAllPanels() {
    setState({
      controlCenterOpen: false,
      notifCenterOpen: false,
      spotlightOpen: false,
      launchpadOpen: false,
      openMenu: null,
      contextMenu: null,
      missionOpen: false,
    })
  },

  /* menus / context */
  setOpenMenu(openMenu) {
    setState({ openMenu, controlCenterOpen: false, notifCenterOpen: false })
  },
  setContextMenu(contextMenu) {
    setState({ contextMenu })
  },
  showDialog(dialog) {
    setState({ dialog })
  },
  closeDialog() {
    setState({ dialog: null })
  },

  /* notifications */
  notify({ appId = 'settings', title, body, icon }) {
    if (state.focus) return
    const id = 'n' + Date.now() + Math.random().toString(16).slice(2)
    const note = { id, appId, title, body, icon, time: Date.now() }
    setState({ toasts: [...state.toasts, note], notifications: [note, ...state.notifications].slice(0, 30) })
    setTimeout(() => actions.dismissToast(id), 5200)
  },
  dismissToast(id) {
    setState({ toasts: state.toasts.filter((t) => t.id !== id) })
  },
  clearNotifications() {
    setState({ notifications: [] })
  },

  /* desktop icons */
  selectIcons(ids) {
    setState({ selectedIcons: ids })
  },
  toggleIconSelected(id) {
    const sel = state.selectedIcons
    setState({ selectedIcons: sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id] })
  },
  clearDesktopSelection() {
    setState({ selectedIcons: [] })
  },
  addDesktopFolder(name) {
    setPersist({ desktopFolders: [...state.desktopFolders, name] })
  },

  /* user data */
  setNotes(notes) {
    setPersist({ notes })
  },
  setReminders(reminders) {
    setPersist({ reminders })
  },
  setFiles(files) {
    setPersist({ files })
  },

  /* sound */
  toggleSound() {
    setPersist({ soundOn: !state.soundOn })
  },

  /* hint */
  dismissHint() {
    setPersist({ showHint: false })
  },

  /* app switcher */
  openSwitcher() {
    setState({ switcherOpen: true, switcherIndex: 0 })
  },
  cycleSwitcher(dir = 1) {
    const ids = state.dockRunning
    if (!ids.length) return
    const idx = (state.switcherIndex + dir + ids.length) % ids.length
    setState({ switcherIndex: idx })
  },
  closeSwitcher() {
    const ids = state.dockRunning
    if (ids.length) {
      const appId = ids[state.switcherIndex % ids.length]
      actions.focusApp(appId)
    }
    setState({ switcherOpen: false })
  },

  /* ------------------------------------------------------------------ *
   * Window management
   * ------------------------------------------------------------------ */
  openApp(appId, opts = {}) {
    const meta = appsMeta[appId]
    if (!meta) return
    const existing = state.windows.find((w) => w.appId === appId)
    if (existing && !opts.forceNew) {
      actions.focusWindow(existing.id, true)
      return existing.id
    }
    const id = appId + '-' + Date.now().toString(36)
    const offset = (state.windows.length % 6) * 28
    const baseW = opts.w || meta.w || 760
    const baseH = opts.h || meta.h || 500
    const vw = window.innerWidth
    const vh = window.innerHeight - 26
    const w = Math.min(baseW, vw - 40)
    const h = Math.min(baseH, vh - 40)
    const x = opts.x ?? Math.max(20, Math.round((vw - w) / 2) + offset - 60)
    const y = opts.y ?? Math.max(38, Math.round((vh - h) / 2.4) + offset - 40)
    const win = {
      id,
      appId,
      title: opts.title || meta.name,
      x,
      y,
      w,
      h,
      z: state.zTop + 1,
      minimized: false,
      maximized: false,
      prev: null,
      props: opts.props || {},
    }
    const windows = [...state.windows, win]
    setState({
      windows,
      zTop: state.zTop + 1,
      activeWindowId: id,
      dockRunning: state.dockRunning.includes(appId) ? state.dockRunning : [...state.dockRunning, appId],
      recentlyOpened: [appId, ...state.recentlyOpened.filter((a) => a !== appId)].slice(0, 8),
      contextMenu: null,
      openMenu: null,
      launchpadOpen: false,
      spotlightOpen: false,
    })
    return id
  },

  closeWindow(id) {
    const win = state.windows.find((w) => w.id === id)
    if (!win) return
    const windows = state.windows.filter((w) => w.id !== id)
    const stillOpen = windows.some((w) => w.appId === win.appId)
    setState({
      windows,
      activeWindowId: id === state.activeWindowId ? (windows.length ? windows[windows.length - 1].id : null) : state.activeWindowId,
      dockRunning: stillOpen ? state.dockRunning : state.dockRunning.filter((a) => a !== win.appId),
    })
  },

  minimizeWindow(id) {
    setState({
      windows: state.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
      activeWindowId: null,
    })
  },
  restoreWindow(id) {
    actions.focusWindow(id, true)
  },

  focusWindow(id, unminimize = false) {
    const win = state.windows.find((w) => w.id === id)
    if (!win) return
    setState({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, z: state.zTop + 1, minimized: unminimize ? false : w.minimized } : w,
      ),
      zTop: state.zTop + 1,
      activeWindowId: id,
      openMenu: null,
      contextMenu: null,
    })
  },

  focusApp(appId) {
    const win = state.windows.find((w) => w.appId === appId)
    if (win) {
      actions.focusWindow(win.id, true)
    } else {
      actions.openApp(appId)
    }
  },

  maximizeWindow(id) {
    const win = state.windows.find((w) => w.id === id)
    if (!win) return
    if (win.maximized) {
      setState({ windows: state.windows.map((w) => (w.id === id ? { ...w, ...w.prev, maximized: false, prev: null } : w)) })
    } else {
      setState({
        windows: state.windows.map((w) =>
          w.id === id
            ? { ...w, maximized: true, prev: { x: w.x, y: w.y, w: w.w, h: w.h }, x: 0, y: 27, w: window.innerWidth, h: window.innerHeight - 27 }
            : w,
        ),
      })
    }
  },

  toggleMaximize(id) {
    actions.maximizeWindow(id)
  },

  updateWindowGeom(id, geom) {
    setState({ windows: state.windows.map((w) => (w.id === id ? { ...w, ...geom } : w)) })
  },

  updateWindowTitle(id, title) {
    setState({ windows: state.windows.map((w) => (w.id === id ? { ...w, title } : w)) })
  },

  /* Quit app (closes all its windows, asks confirm) */
  requestQuit(appId) {
    const meta = appsMeta[appId]
    if (!meta) return
    actions.showDialog({
      title: `Are you sure you want to quit ${meta.name}?`,
      message: 'Any unsaved changes will be lost.',
      icon: appId,
      actions: [
        { label: 'Cancel', variant: 'plain' },
        {
          label: 'Quit',
          variant: 'primary',
          onClick: () => {
            const windows = state.windows.filter((w) => w.appId !== appId)
            setState({ windows, dockRunning: state.dockRunning.filter((a) => a !== appId) })
          },
        },
      ],
    })
  },

  quitAppImmediate(appId) {
    setState({
      windows: state.windows.filter((w) => w.appId !== appId),
      dockRunning: state.dockRunning.filter((a) => a !== appId),
    })
  },

  /* close active window */
  closeActive() {
    const win = state.windows.find((w) => w.id === state.activeWindowId)
    if (win) actions.closeWindow(win.id)
  },
  minimizeActive() {
    const win = state.windows.find((w) => w.id === state.activeWindowId)
    if (win) actions.minimizeWindow(win.id)
  },
}

export { initialState }
