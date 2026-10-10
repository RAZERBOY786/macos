import { actions, useSystem } from './store.js'
import { useMusic, TrackArt, toggle, next, prev } from './music.jsx'
import Icon from '../icons/UIIcons.jsx'

export default function ControlCenter() {
  const s = useSystem()
  const mu = useMusic()
  const t = mu.queue[mu.qIndex] || null
  return (
    <div className="panel control-center" onMouseDown={(e) => e.stopPropagation()}>
      <div className="cc-grid">
        <ToggleTile
          label="Wi-Fi"
          sub={s.wifi ? s.wifiNetwork : 'Off'}
          icon="wifi"
          on={s.wifi}
          color="blue"
          onClick={actions.toggleWifi}
        />
        <ToggleTile
          label="Bluetooth"
          sub={s.bluetooth ? 'On' : 'Off'}
          icon="bluetooth"
          on={s.bluetooth}
          color="blue"
          onClick={actions.toggleBluetooth}
        />
        <ToggleTile
          label="AirDrop"
          sub={s.airdrop ? 'Everyone' : 'Off'}
          icon="link"
          on={s.airdrop}
          color="blue"
          onClick={actions.toggleAirdrop}
        />
        <ToggleTile
          label="Focus"
          sub={s.focus ? 'On' : 'Off'}
          icon="moon"
          on={s.focus}
          color="blue"
          onClick={actions.toggleFocus}
        />
      </div>

      <div className="cc-grid" style={{ marginTop: 10 }}>
        <div className="cc-tile wide">
          <div className="cc-label">Display</div>
          <div className="slider-row">
            <span className="ic"><Icon name="brightness" size={16} /></span>
            <input
              className="slider"
              type="range"
              min="0.35"
              max="1"
              step="0.01"
              value={s.brightness}
              onChange={(e) => actions.setBrightness(+e.target.value)}
            />
          </div>
        </div>

        <div className="cc-tile wide">
          <div className="cc-label">Sound</div>
          <div className="slider-row">
            <button className="ic" onClick={actions.toggleMute} style={{ border: 'none', background: 'none', padding: 0 }}>
              <Icon name={s.muted ? 'volumeMute' : 'volume'} size={16} />
            </button>
            <input
              className="slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={s.muted ? 0 : s.volume}
              onChange={(e) => actions.setVolume(+e.target.value)}
            />
          </div>
        </div>

        <div className="cc-tile wide">
          <div className="cc-label">Now Playing</div>
          <div className="slider-row">
            {t ? (
              <TrackArt t={t} size={42} className="cc-art" />
            ) : (
              <span
                style={{
                  width: 42, height: 42, borderRadius: 6, flex: 'none',
                  background: 'linear-gradient(135deg,#af52de,#5856d6)',
                  display: 'grid', placeItems: 'center', color: '#fff',
                }}
              >
                <Icon name="music" size={18} color="#fff" />
              </span>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 12.5, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t ? t.title : 'Nothing Playing'}
              </b>
              <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t ? t.artist : 'Open Music to start'}
              </span>
            </div>
            {t ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button className="playbtn" onClick={prev} aria-label="Previous">
                  <Icon name="skipBack" size={15} />
                </button>
                <button className="playbtn" onClick={toggle} aria-label={mu.playing ? 'Pause' : 'Play'}>
                  <Icon name={mu.playing ? 'pause' : 'play'} size={15} />
                </button>
                <button className="playbtn" onClick={next} aria-label="Next">
                  <Icon name="skipForward" size={15} />
                </button>
              </div>
            ) : (
              <button className="playbtn" onClick={() => actions.openApp('music')}>
                <Icon name="play" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleTile({ label, sub, icon, on, color, onClick }) {
  return (
    <div className={`cc-toggle ${on ? 'on' : ''}`} onClick={onClick}>
      <span className={`cc-ic ${color}`}>
        <Icon name={icon} size={16} color="#fff" />
      </span>
      <div className="cc-txt">
        <b>{label}</b>
        <span>{sub}</span>
      </div>
    </div>
  )
}