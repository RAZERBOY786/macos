/**
 * AppIcons.jsx — original squircle-style SVG app icons.
 * No copyrighted Apple assets; these are drawn from scratch.
 */
import React from 'react'

const R = 15 // corner radius on a 64 grid -> macOS squircle feel

function Squircle({ children, from, to, angle = '135deg', stroke }) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 64 64" className="svgicon" width="100%" height="100%" role="img">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${angle === '135deg' ? 0 : 0})`}>
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill={`url(#${id})`} stroke={stroke || 'rgba(0,0,0,0.08)'} strokeWidth="0.5" />
      {children}
    </svg>
  )
}

const white = '#ffffff'

export const Icons = {
  finder: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="finder-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3fb6ff" />
          <stop offset="1" stopColor="#0a84ff" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#finder-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <path d="M32 4v56" stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" />
      <path d="M32 4c10 0 12 12 12 28s-2 28-12 28" fill="rgba(255,255,255,0.10)" />
      <path d="M32 4C22 4 20 16 20 32s2 28 12 28" fill="rgba(255,255,255,0.18)" />
      <circle cx="22" cy="26" r="2.4" fill="#0a3d7a" />
      <circle cx="42" cy="26" r="2.4" fill="#0a3d7a" />
      <path d="M22 40c4 4 16 4 20 0" stroke="#0a3d7a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  ),

  launchpad: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="rgba(255,255,255,0.001)" />
      {[
        ['#ff5f57', 21, 21], ['#febc2e', 32, 21], ['#28c840', 43, 21],
        ['#3aa0ff', 21, 32], ['#af52de', 32, 32], ['#ff9500', 43, 32],
        ['#5ac8fa', 21, 43], ['#ff2d55', 32, 43], ['#34c759', 43, 43],
      ].map(([c, x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={c} />
      ))}
    </svg>
  ),

  safari: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="safari-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1fb0ff" />
          <stop offset="1" stopColor="#0a6cff" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#safari-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="24" fill="#fff" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180
        const x1 = 32 + Math.cos(a) * 21
        const y1 = 32 + Math.sin(a) * 21
        const x2 = 32 + Math.cos(a) * 24
        const y2 = 32 + Math.sin(a) * 24
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 2 ? '#d0d0d5' : '#9aa0aa'} strokeWidth="1.2" />
      })}
      <polygon points="32,32 45,20 36,36" fill="#ff3b30" />
      <polygon points="32,32 19,44 28,28" fill="#e5e5ea" />
      <circle cx="32" cy="32" r="2" fill="#fff" stroke="#9aa0aa" strokeWidth="0.5" />
    </svg>
  ),

  messages: (p) => (
    <Icons._greenBubble p={p} text="💬" />
  ),
  _greenBubble: ({ p, text }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="msg-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5cf07a" />
          <stop offset="1" stopColor="#1ecb46" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#msg-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <path d="M20 18h24a7 7 0 0 1 7 7v12a7 7 0 0 1-7 7H31l-9 8v-8h-2a7 7 0 0 1-7-7V25a7 7 0 0 1 7-7z" fill="#fff" />
    </svg>
  ),

  mail: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="mail-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3faeff" />
          <stop offset="1" stopColor="#0a6cff" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#mail-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="12" y="20" width="40" height="24" rx="4" fill="#fff" />
      <path d="M12 24l20 13 20-13" fill="none" stroke="#0a6cff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  maps: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#dff3e4" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <path d="M4 44l18-10 18 8 20-12v30H4z" fill="#a8e6b8" />
      <path d="M4 30l16 8 20-12 20 8v-30H4z" fill="#cdeed7" />
      <path d="M32 24c-4 0-7 3-7 7 0 5 7 12 7 12s7-7 7-12c0-4-3-7-7-7z" fill="#ff3b30" />
      <circle cx="32" cy="31" r="2.6" fill="#fff" />
    </svg>
  ),

  photos: (p) => {
    const cols = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#5856d6', '#af52de', '#ff2d55']
    return (
      <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
        <rect x="2" y="2" width="60" height="60" rx={R} fill="#fff" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 8
          const cx = 32 + Math.cos(a) * 12.5
          const cy = 32 + Math.sin(a) * 12.5
          return <ellipse key={i} cx={cx} cy={cy} rx="9" ry="5.5" fill={cols[i]} opacity="0.85" transform={`rotate(${(i * 360) / 8} ${cx} ${cy})`} />
        })}
        <circle cx="32" cy="32" r="4.5" fill="#fff" />
      </svg>
    )
  },

  facetime: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="ft-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5cf07a" />
          <stop offset="1" stopColor="#1ecb46" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#ft-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="12" y="20" width="26" height="24" rx="6" fill="#fff" />
      <path d="M40 27l12-6v22l-12-6z" fill="#fff" />
    </svg>
  ),

  calendar: (p) => {
    const d = new Date()
    return (
      <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
        <rect x="2" y="2" width="60" height="60" rx={R} fill="#fff" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        <path d={`M2 17h60v-${1}H2z`} fill="#fff" />
        <rect x="2" y="2" width="60" height="15" fill="#ff3b30" />
        <text x="32" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Inter,Arial">
          {d.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
        </text>
        <text x="32" y="50" textAnchor="middle" fontSize="30" fontWeight="600" fill="#1d1d1f" fontFamily="Inter,Arial">
          {d.getDate()}
        </text>
      </svg>
    )
  },

  contacts: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#f6f3ee" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="4" y="4" width="8" height="56" fill="#e3ddd3" rx="9" />
      {[16, 26, 36, 46].map((y) => (
        <rect key={y} x="3" y={y} width="7" height="3" rx="1.5" fill="#b9ad9c" />
      ))}
      <circle cx="34" cy="25" r="8" fill="#9a8c78" />
      <path d="M20 52c0-8 6-13 14-13s14 5 14 13z" fill="#9a8c78" />
    </svg>
  ),

  notes: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#fff" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="2" y="2" width="60" height="14" fill="#ffcc00" rx="15" />
      <rect x="2" y="10" width="60" height="6" fill="#ffcc00" />
      {[24, 32, 40, 48].map((y) => (
        <line key={y} x1="12" y1={y} x2="52" y2={y} stroke="#e6e6ea" strokeWidth="1.6" />
      ))}
    </svg>
  ),

  reminders: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#fff" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      {[
        ['#ff3b30', 22], ['#ff9500', 34], ['#007aff', 46],
      ].map(([c, y]) => (
        <g key={y}>
          <circle cx="16" cy={y - 4} r="5" fill={c} />
          <line x1="26" y1={y - 4} x2="52" y2={y - 4} stroke="#d5d5da" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  ),

  music: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="music-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5c74" />
          <stop offset="1" stopColor="#f8244b" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#music-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <path d="M42 16l-18 4v22a7 7 0 1 0 3 0V26l12-2.6v14.6a7 7 0 1 0 3 0z" fill="#fff" />
    </svg>
  ),

  appstore: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="store-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fb8ff" />
          <stop offset="1" stopColor="#0a6cff" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#store-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <path d="M32 15v34M18 20l28 24M46 20L18 44M18 20h28v24H18z" fill="none" stroke="none" />
      <g stroke="#fff" strokeWidth="3.4" strokeLinecap="round">
        <line x1="22" y1="42" x2="42" y2="42" />
        <line x1="26" y1="24" x2="38" y2="42" />
        <line x1="38" y1="24" x2="26" y2="42" />
      </g>
    </svg>
  ),

  terminal: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#1b1b1d" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      <rect x="2" y="2" width="60" height="12" fill="#2c2c2e" rx="15" />
      <circle cx="12" cy="8" r="2" fill="#ff5f57" />
      <circle cx="20" cy="8" r="2" fill="#febc2e" />
      <circle cx="28" cy="8" r="2" fill="#28c840" />
      <text x="12" y="34" fontSize="14" fill="#f5f5f7" fontFamily="monospace">$_</text>
      <text x="12" y="50" fontSize="10" fill="#5ac8fa" fontFamily="monospace">hack</text>
    </svg>
  ),

  vscode: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#0a2a4a" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M46 12l-20 18 8 8-8 8 20 18V12z" fill="#fff" />
      <path d="M26 30L12 20l-5 3 10 9-10 9 5 3 14-10z" fill="#4aa8ff" />
    </svg>
  ),

  calculator: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#1c1c1e" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      <rect x="12" y="12" width="40" height="12" rx="3" fill="#3a3a3c" />
      <rect x="12" y="28" width="9" height="9" rx="2" fill="#5f5f63" />
      <rect x="25" y="28" width="9" height="9" rx="2" fill="#5f5f63" />
      <rect x="38" y="28" width="9" height="9" rx="2" fill="#ff9f0a" />
      <rect x="12" y="41" width="9" height="9" rx="2" fill="#5f5f63" />
      <rect x="25" y="41" width="9" height="9" rx="2" fill="#5f5f63" />
      <rect x="38" y="41" width="9" height="9" rx="2" fill="#ff9f0a" />
    </svg>
  ),

  settings: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#8e8e93" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="12" y="18" width="40" height="6" rx="3" fill="#fff" />
      <rect x="12" y="30" width="40" height="6" rx="3" fill="#fff" opacity="0.8" />
      <rect x="12" y="42" width="40" height="6" rx="3" fill="#fff" opacity="0.65" />
      <circle cx="40" cy="21" r="5" fill="#dcdce0" stroke="#8e8e93" />
      <circle cx="22" cy="33" r="5" fill="#dcdce0" stroke="#8e8e93" />
      <circle cx="34" cy="45" r="5" fill="#dcdce0" stroke="#8e8e93" />
    </svg>
  ),

  weather: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="weather-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fa8e8" />
          <stop offset="1" stopColor="#2f6fb5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#weather-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <circle cx="26" cy="26" r="9" fill="#ffd60a" />
      <path d="M20 42a9 9 0 0 1 1-18 12 12 0 0 1 22 4 8 8 0 0 1-1 14z" fill="#fff" />
    </svg>
  ),

  clock: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#111113" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="#f5f5f7" strokeWidth="0.8" opacity="0.4" />
      <circle cx="32" cy="32" r="21" fill="#0a0a0b" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180
        const x1 = 32 + Math.cos(a) * 19
        const y1 = 32 + Math.sin(a) * 19
        const x2 = 32 + Math.cos(a) * 21
        const y2 = 32 + Math.sin(a) * 21
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f5f5f7" strokeWidth="1" opacity="0.7" />
      })}
      {[
        ['#ff9500', 10, 0], ['#ff9500', 18, 180], ['#ffcc00', 15, 150],
      ].map(([c, len, deg], i) => {
        const a = (deg * Math.PI) / 180
        return <line key={i} x1="32" y1="32" x2={32 + Math.sin(a) * len} y2={32 - Math.cos(a) * len} stroke={c} strokeWidth={i < 2 ? 1.6 : 1.2} strokeLinecap="round" />
      })}
      <circle cx="32" cy="32" r="1.8" fill="#fff" />
    </svg>
  ),

  preview: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="#f2f2f4" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <path d="M16 10h22l10 10v34H16z" fill="#fff" stroke="#d0d0d6" strokeWidth="0.8" />
      <path d="M38 10v10h10" fill="#e6e6ea" stroke="#d0d0d6" strokeWidth="0.8" />
      <line x1="22" y1="28" x2="42" y2="28" stroke="#c4c4cc" strokeWidth="1.6" />
      <line x1="22" y1="35" x2="42" y2="35" stroke="#c4c4cc" strokeWidth="1.6" />
      <line x1="22" y1="42" x2="34" y2="42" stroke="#c4c4cc" strokeWidth="1.6" />
    </svg>
  ),

  trash: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="trash-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9e9ee" />
          <stop offset="1" stopColor="#c2c2c9" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#trash-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="18" y="14" width="28" height="5" rx="2.5" fill="#9a9aa2" />
      <path d="M22 20h20l-2.5 30a3 3 0 0 1-3 3H27.5a3 3 0 0 1-3-3z" fill="#fff" opacity="0.9" stroke="#b0b0b8" strokeWidth="0.6" />
      {[29, 32.5, 36].map((x) => (
        <line key={x} x1={x} y1="26" x2={x} y2="46" stroke="#c4c4cc" strokeWidth="1.4" />
      ))}
    </svg>
  ),

  about: (p) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" {...p}>
      <defs>
        <linearGradient id="about-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0f0f4" />
          <stop offset="1" stopColor="#b8b8c0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx={R} fill="url(#about-bg)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="15" fill="none" stroke="#6d6d75" strokeWidth="2.4" />
      <circle cx="32" cy="32" r="6" fill="#6d6d75" />
      <path d="M32 17a15 15 0 0 1 13 7.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  ),

  /* Finder file/folder glyphs */
  folder: () => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M6 16a4 4 0 0 1 4-4h14l5 6h25a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="#4aa8ff" />
      <path d="M6 22h52v28a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="#6fbaff" />
    </svg>
  ),
  pdf: () => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M16 6h20l12 12v40H16z" fill="#fff" stroke="#d0d0d6" strokeWidth="1" />
      <path d="M36 6v12h12" fill="#ececef" stroke="#d0d0d6" strokeWidth="1" />
      <rect x="20" y="34" width="24" height="14" rx="3" fill="#ff3b30" />
      <text x="32" y="45" fontFamily="Inter,Arial" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">PDF</text>
    </svg>
  ),
  generic: () => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M16 6h20l12 12v40H16z" fill="#fff" stroke="#d0d0d6" strokeWidth="1" />
      <path d="M36 6v12h12" fill="#ececef" stroke="#d0d0d6" strokeWidth="1" />
    </svg>
  ),
  hd: () => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect x="6" y="14" width="52" height="36" rx="5" fill="#e6e6ea" stroke="#b9b9c0" strokeWidth="1" />
      <rect x="12" y="22" width="40" height="20" rx="3" fill="#c9c9d1" />
      <circle cx="32" cy="32" r="6" fill="#8e8e93" />
      <circle cx="50" cy="44" r="1.6" fill="#28c840" />
    </svg>
  ),
}

/* Map an appId to its icon; unknown falls back to a generic squircle */
export function AppIcon({ app, size = 48, style }) {
  const Comp = Icons[app] || Icons.generic
  return (
    <span style={{ width: size, height: size, display: 'inline-block', ...style }}>
      <Comp />
    </span>
  )
}

/* Original brand mark (used on boot + menu bar). Not Apple's logo. */
export function BrandLogo({ size = 54, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Portfolio logo">
      <rect x="4" y="4" width="56" height="56" rx="16" fill="none" stroke={color} strokeWidth="4" />
      <path d="M20 42V22l12 12 12-12v20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default Icons
