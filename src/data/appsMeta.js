/**
 * appsMeta.js — static metadata for every app.
 * The actual React component lives in system/registry.jsx so this file stays
 * free of JSX and can be imported by the store without circular deps.
 */
export const appsMeta = {
  finder: { id: 'finder', name: 'Finder', w: 900, h: 560, color: '#3aa0ff' },
  launchpad: { id: 'launchpad', name: 'Launchpad', w: 0, h: 0 },
  safari: { id: 'safari', name: 'Safari', w: 940, h: 620, color: '#0f97ff' },
  messages: { id: 'messages', name: 'Messages', w: 760, h: 540, color: '#3ddb67' },
  mail: { id: 'mail', name: 'Mail', w: 860, h: 560, color: '#147efb' },
  maps: { id: 'maps', name: 'Maps', w: 840, h: 560, color: '#4bd964' },
  photos: { id: 'photos', name: 'Photos', w: 860, h: 580, color: '#ff5f9e' },
  facetime: { id: 'facetime', name: 'FaceTime', w: 620, h: 460, color: '#3ddb67' },
  calendar: { id: 'calendar', name: 'Calendar', w: 820, h: 560, color: '#ff3b30' },
  contacts: { id: 'contacts', name: 'Contacts', w: 720, h: 520, color: '#a2845e' },
  notes: { id: 'notes', name: 'Notes', w: 820, h: 540, color: '#ffd60a' },
  reminders: { id: 'reminders', name: 'Reminders', w: 620, h: 520, color: '#ff9500' },
  music: { id: 'music', name: 'Music', w: 900, h: 600, color: '#fc3c44' },
  appstore: { id: 'appstore', name: 'App Store', w: 860, h: 580, color: '#1a8cff' },
  terminal: { id: 'terminal', name: 'Terminal', w: 660, h: 440, color: '#1c1c1e' },
  calculator: { id: 'calculator', name: 'Calculator', w: 254, h: 400, color: '#5f5f63' },
  settings: { id: 'settings', name: 'System Settings', w: 840, h: 580, color: '#8e8e93' },
  weather: { id: 'weather', name: 'Weather', w: 700, h: 540, color: '#4a90d9' },
  clock: { id: 'clock', name: 'Clock', w: 640, h: 520, color: '#161618' },
  preview: { id: 'preview', name: 'Preview', w: 820, h: 620, color: '#7d7d82' },
  about: { id: 'about', name: 'About This Mac', w: 480, h: 520, color: '#c9c9ce' },
  trash: { id: 'trash', name: 'Trash', w: 720, h: 460, color: '#8e8e93' },
}

/* Dock order (Trash is placed after a separator) */
export const dockApps = [
  'finder',
  'launchpad',
  'safari',
  'messages',
  'mail',
  'maps',
  'photos',
  'facetime',
  'calendar',
  'contacts',
  'notes',
  'reminders',
  'music',
  'appstore',
  'terminal',
  'calculator',
  'settings',
]

/* Apps shown in the Launchpad (excludes Launchpad itself + Trash) */
export const launchpadApps = [
  'finder', 'safari', 'messages', 'mail', 'maps', 'photos', 'facetime',
  'calendar', 'contacts', 'notes', 'reminders', 'music', 'appstore',
  'terminal', 'calculator', 'settings', 'weather', 'clock',
  'preview', 'about',
]

/* Apps that can appear in the Cmd+Tab switcher */
export const switchableApps = launchpadApps.filter((a) => a !== 'launchpad')
