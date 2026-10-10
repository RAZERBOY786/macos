/**
 * UIIcons.jsx — small monochrome stroke icons used across the OS UI.
 * All drawn from scratch with currentColor so they adapt to any theme.
 */

const paths = {
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronUp: <path d="M6 15l6-6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  back: <path d="M11 5l-7 7 7 7M4 12h16" />,
  forward: <path d="M13 5l7 7-7 7M20 12H4" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="M20 6L9 17l-5-5" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  dots: (
    <>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  columns: (
    <>
      <rect x="3" y="4" width="7" height="16" rx="1.5" />
      <rect x="14" y="4" width="7" height="16" rx="1.5" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l5-5 4 4 3-3 6 6" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 8.5a15 15 0 0 1 19 0" />
      <path d="M6 12a10 10 0 0 1 12 0" />
      <path d="M9 15.3a5 5 0 0 1 6 0" />
      <circle cx="12" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  wifiOff: (
    <>
      <path d="M2.5 8.5a15 15 0 0 1 19 0" opacity="0.35" />
      <path d="M9 15.3a5 5 0 0 1 6 0" />
      <circle cx="12" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
      <path d="M4 4l16 16" />
    </>
  ),
  bluetooth: <path d="M7 7l10 10-5 4V3l5 4L7 17" />,
  battery: (
    <>
      <rect x="2" y="8" width="17" height="8" rx="2.5" />
      <path d="M21.5 11v2" />
    </>
  ),
  controlCenter: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <path d="M4 10h16M10 4v16" />
    </>
  ),
  spotlight: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  siri: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v6l4 2" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
    </>
  ),
  volumeMute: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9z" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </>
  ),
  brightness: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </>
  ),
  play: <path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  skipBack: (
    <>
      <path d="M18 6v12L9 12z" fill="currentColor" stroke="none" />
      <path d="M6 5v14" />
    </>
  ),
  skipForward: (
    <>
      <path d="M6 6v12l9-6z" fill="currentColor" stroke="none" />
      <path d="M18 5v14" />
    </>
  ),
  shuffle: <path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5" />,
  repeat: <path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  power: (
    <>
      <path d="M12 3v9" />
      <path d="M7.5 6.5a8 8 0 1 0 9 0" />
    </>
  ),
  restart: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />,
  sleep: <path d="M12 3a9 9 0 1 0 9 9c-5 0-9-4-9-9z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5l1.5 2.6 3-.6.5 3 2.7 1.4-1.3 2.8 1.3 2.8-2.7 1.4-.5 3-3-.6L12 21.5l-1.5-2.6-3 .6-.5-3L4.3 15l1.3-2.8L4.3 9.4 7 8l.5-3 3 .6z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </>
  ),
  moon: <path d="M12 3a9 9 0 1 0 9 9c-5 0-9-4-9-9z" />,
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.6" />
      <circle cx="16.5" cy="16" r="2.6" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  folderPlus: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M12 11v5M9.5 13.5h5" />
    </>
  ),
  file: <path d="M6 3h8l4 4v14H6z M14 3v4h4" />,
  home: <path d="M4 11l8-7 8 7M6 10v9h12v-9" />,
  desktop: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 17v3" />
    </>
  ),
  applications: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  cloud: <path d="M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 18 18z" />,
  rain: (
    <>
      <path d="M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 18 18z" />
      <path d="M8 21l-1 2M13 21l-1 2M18 21l-1 2" />
    </>
  ),
  snow: (
    <>
      <path d="M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 18 18z" />
      <path d="M7 21h2M12 21h2M17 21h2" />
    </>
  ),
  storm: (
    <>
      <path d="M7 17a4 4 0 0 1 0-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 18 17z" />
      <path d="M12 16.5l-3 4h3l-1.5 3.5" />
    </>
  ),
  wind: (
    <>
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4h8l9 9-8 8z" />
      <circle cx="7.5" cy="7.5" r="1.4" />
    </>
  ),
  share: (
    <>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
    </>
  ),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  heart: <path d="M12 20s-7-4.6-7-9.5A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.5C19 15.4 12 20 12 20z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: <path d="M5 4h4l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5V20a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3" />
    </>
  ),
  github: (
    <path
      d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5A3.9 3.9 0 0 1 6.5 6c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"
      fill="currentColor"
      stroke="none"
    />
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" stroke="none" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7" stroke="#fff" strokeWidth="1.8" />
    </>
  ),
  twitter: (
    <path
      d="M17.5 3h3l-6.6 7.5L21.8 21h-5.8l-4.3-5.6L6.7 21H3.6l7-8L2.7 3h5.9l3.9 5.2z"
      fill="currentColor"
      stroke="none"
    />
  ),
  refresh: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />,
  download: <path d="M12 4v10M8 10l4 4 4-4M5 20h14" />,
  sidebar: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M9 4v16" />
    </>
  ),
  sliders: <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />,
  key: <path d="M14 7a4 4 0 1 1-3.5 5.9L4 19.4V21h3v-2h2v-2h2l1.2-1.2A4 4 0 0 1 14 7z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </>
  ),
  map: <path d="M9 4L3 7v13l6-3 6 3 6-3V4l-6 3z M9 4v13M15 7v13" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.8" />
      <path d="M3 16l5-5 4 4 3-3 6 6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </>
  ),
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
  hide: <path d="M3 3l18 18M10.6 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-1.1M9.4 5.4A9 9 0 0 1 21 12a9 9 0 0 1-2 3.2M6 6.5A9 9 0 0 0 3 12a9 9 0 0 0 12.5 3.5" />,
  eject: <path d="M5 15l7-7 7 7zM5 18h14" />,
}

export function Icon({ name, size = 16, strokeWidth = 1.7, style, className, color }) {
  const body = paths[name] || paths.info
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {body}
    </svg>
  )
}

export default Icon
