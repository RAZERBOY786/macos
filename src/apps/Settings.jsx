import { useState } from 'react'
import { actions, useSystem } from '../system/store.js'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

const NAV = [
  { id: 'wifi', name: 'Wi-Fi', icon: 'wifi', color: '#007aff' },
  { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', color: '#007aff' },
  { id: 'notifications', name: 'Notifications', icon: 'bell', color: '#ff3b30' },
  { id: 'sound', name: 'Sound', icon: 'volume', color: '#ff2d55' },
  { id: 'focus', name: 'Focus', icon: 'moon', color: '#5856d6' },
  { id: 'appearance', name: 'Appearance', icon: 'sun', color: '#1c1c1e' },
  { id: 'wallpaper', name: 'Wallpaper', icon: 'image', color: '#5ac8fa' },
  { id: 'display', name: 'Displays', icon: 'brightness', color: '#007aff' },
  { id: 'battery', name: 'Battery', icon: 'battery', color: '#34c759' },
  { id: 'dock', name: 'Dock & Menu Bar', icon: 'sidebar', color: '#1c1c1e' },
  { id: 'general', name: 'General', icon: 'gear', color: '#8e8e93' },
  { id: 'about', name: 'About', icon: 'info', color: '#8e8e93' },
]

const ACCENTS = ['#007aff', '#af52de', '#ff2d55', '#ff9500', '#34c759', '#8e8e93']

function Row({ title, subtitle, children }) {
  return (
    <div className="setting-row">
      <div className="info">
        <b>{title}</b>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

function Switch({ on, onClick }) {
  return <button className={`switch ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on} />
}

export default function Settings() {
  const state = useSystem()
  const [pane, setPane] = useState('appearance')
  const [tinting, setTinting] = useState(false)
  const [trueTone, setTrueTone] = useState(true)
  const [notifOn, setNotifOn] = useState(true)
  const [previewsOn, setPreviewsOn] = useState(true)

  return (
    <div className="settings">
      <div className="settings__side">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px 14px' }}>
          <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundImage: `url("${profile.avatar}")`, backgroundSize: 'cover' }} />
          <div style={{ lineHeight: 1.2 }}>
            <b style={{ fontSize: 13 }}>{profile.name}</b>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Apple Account</div>
          </div>
        </div>
        {NAV.map((n) => (
          <div key={n.id} className={`settings__item ${pane === n.id ? 'active' : ''}`} onClick={() => setPane(n.id)}>
            <span className="ic" style={{ background: n.color, color: '#fff' }}>
              <Icon name={n.icon} size={14} color="#fff" />
            </span>
            {n.name}
          </div>
        ))}
      </div>

      <div className="settings__pane">
        {pane === 'appearance' && (
          <>
            <h2>Appearance</h2>
            <Row title="Appearance" subtitle="Choose Light, Dark, or match your system.">
              <div className="segmented">
                {['light', 'dark', 'auto'].map((t) => (
                  <button key={t} className={state.theme === t ? 'active' : ''} onClick={() => actions.setTheme(t)}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </Row>
            <Row title="Accent colour" subtitle="Used throughout the system.">
              <div style={{ display: 'flex', gap: 8 }}>
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    aria-label={`Accent colour ${c}`}
                    aria-pressed={state.accent === c}
                    onClick={() => actions.setAccent(c)}
                    style={{
                      width: 20,
                      height: 20,
                      padding: 0,
                      borderRadius: '50%',
                      background: c,
                      boxShadow: state.accent === c ? `0 0 0 2px var(--window-bg), 0 0 0 4px ${c}` : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                  />
                ))}
              </div>
            </Row>
            <Row title="Allow wallpaper tinting" subtitle="Tint windows to match the wallpaper.">
              <Switch on={tinting} onClick={() => setTinting((v) => !v)} />
            </Row>
          </>
        )}

        {pane === 'wallpaper' && (
          <>
            <h2>Wallpaper</h2>
            <div className="wallpaper-grid">
              {state.wallpapers.map((w) => (
                <div
                  key={w.id}
                  className={`wallpaper-thumb ${state.wallpaperId === w.id ? 'active' : ''}`}
                  style={{ backgroundImage: w.css }}
                  onClick={() => actions.setWallpaper(w.id)}
                >
                  <span>{w.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {pane === 'display' && (
          <>
            <h2>Displays</h2>
            <Row title="Brightness" subtitle="Dim the entire screen.">
              <input className="slider" style={{ width: 220 }} type="range" min="0.35" max="1" step="0.01" value={state.brightness} onChange={(e) => actions.setBrightness(+e.target.value)} />
            </Row>
            <Row title="True Tone" subtitle="Automatically adapt display colour.">
              <Switch on={trueTone} onClick={() => setTrueTone((v) => !v)} />
            </Row>
          </>
        )}

        {pane === 'sound' && (
          <>
            <h2>Sound</h2>
            <Row title="Output volume">
              <input className="slider" style={{ width: 220 }} type="range" min="0" max="1" step="0.01" value={state.volume} onChange={(e) => actions.setVolume(+e.target.value)} />
            </Row>
            <Row title="Mute system sounds">
              <Switch on={state.muted} onClick={actions.toggleMute} />
            </Row>
            <Row title="Interface sound effects" subtitle="Clicks, window and trash sounds.">
              <Switch on={state.soundOn} onClick={actions.toggleSound} />
            </Row>
          </>
        )}

        {pane === 'wifi' && (
          <>
            <h2>Wi-Fi</h2>
            <Row title="Wi-Fi">
              <Switch on={state.wifi} onClick={actions.toggleWifi} />
            </Row>
            <Row title={state.wifi ? 'Connected to “' + state.wifiNetwork + '”' : 'Wi-Fi is off'} subtitle={state.wifi ? 'Secure network · Auto-Join' : 'Turn on Wi-Fi to see networks'}>
              <Icon name="wifi" color="var(--green)" />
            </Row>
          </>
        )}

        {pane === 'bluetooth' && (
          <>
            <h2>Bluetooth</h2>
            <Row title="Bluetooth">
              <Switch on={state.bluetooth} onClick={actions.toggleBluetooth} />
            </Row>
            {['Magic Keyboard', 'Magic Mouse', 'AirPods Pro'].map((d) => (
              <Row key={d} title={d} subtitle="Connected">
                <Icon name="bluetooth" color="var(--blue)" />
              </Row>
            ))}
          </>
        )}

        {pane === 'notifications' && (
          <>
            <h2>Notifications</h2>
            <Row title="Allow notifications" subtitle="When the screen is locked.">
              <Switch on={notifOn} onClick={() => setNotifOn((v) => !v)} />
            </Row>
            <Row title="Show previews" subtitle="Always">
              <Switch on={previewsOn} onClick={() => setPreviewsOn((v) => !v)} />
            </Row>
            <Row title="Focus" subtitle="Silence notifications temporarily.">
              <Switch on={state.focus} onClick={actions.toggleFocus} />
            </Row>
          </>
        )}

        {pane === 'focus' && (
          <>
            <h2>Focus</h2>
            <Row title="Do Not Disturb" subtitle="Silence all notifications.">
              <Switch on={state.focus} onClick={actions.toggleFocus} />
            </Row>
          </>
        )}

        {pane === 'battery' && (
          <>
            <h2>Battery</h2>
            <Row title={`${Math.round(state.battery * 100)}%`} subtitle={state.batteryCharging ? 'Charging' : 'On battery power'}>
              <Icon name="battery" color={state.battery > 0.2 ? 'var(--green)' : 'var(--red)'} />
            </Row>
          </>
        )}

        {pane === 'dock' && (
          <>
            <h2>Dock & Menu Bar</h2>
            <Row title="Size">
              <input className="slider" style={{ width: 200 }} type="range" min="36" max="72" step="1" value={state.dock.size} onChange={(e) => actions.setDock({ size: +e.target.value })} />
            </Row>
            <Row title="Magnification">
              <Switch on={state.dock.magnification} onClick={() => actions.setDock({ magnification: !state.dock.magnification })} />
            </Row>
            <Row title="Magnification size">
              <input className="slider" style={{ width: 200 }} type="range" min="1" max="2.2" step="0.05" value={state.dock.magnifyScale} onChange={(e) => actions.setDock({ magnifyScale: +e.target.value })} />
            </Row>
            <Row title="Position on screen">
              <div className="segmented">
                {['left', 'bottom', 'right'].map((p) => (
                  <button key={p} className={state.dock.position === p ? 'active' : ''} onClick={() => actions.setDock({ position: p })}>
                    {p[0].toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </Row>
            <Row title="Minimise windows using">
              <div className="segmented">
                {['genie', 'scale'].map((p) => (
                  <button key={p} className={state.dock.minimizeEffect === p ? 'active' : ''} onClick={() => actions.setDock({ minimizeEffect: p })}>
                    {p[0].toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </Row>
          </>
        )}

        {pane === 'general' && (
          <>
            <h2>General</h2>
            <Row title="About" subtitle={`${profile.system.model} · ${profile.system.chip}`}>
              <button className="btn" style={{ flex: 'none' }} onClick={() => actions.openApp('about')}>More Info</button>
            </Row>
            <Row title="Software Update" subtitle="macOS Tahoe 26 is up to date">
              <span className="badge">26</span>
            </Row>
            <Row title="Reset all settings" subtitle="Clear saved wallpaper, theme and data.">
              <button className="btn" style={{ flex: 'none' }} onClick={() => { localStorage.clear(); location.reload() }}>Reset</button>
            </Row>
          </>
        )}

        {pane === 'about' && (
          <>
            <h2>About</h2>
            <Row title={profile.system.model} subtitle={`${profile.system.chip} · ${profile.system.memory}`}>
              <button className="btn" style={{ flex: 'none' }} onClick={() => actions.openApp('about')}>About This Mac</button>
            </Row>
            <Row title="Version"><span className="badge">{profile.system.osVersion}</span></Row>
            <Row title="Serial number"><span style={{ color: 'var(--text-3)' }}>{profile.system.serial}</span></Row>
          </>
        )}
      </div>
    </div>
  )
}
