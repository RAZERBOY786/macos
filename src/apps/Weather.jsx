import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

const hours = [
  ['Now', 'sun', 68],
  ['1PM', 'sun', 70],
  ['2PM', 'cloud', 71],
  ['3PM', 'cloud', 70],
  ['4PM', 'sun', 69],
  ['5PM', 'sun', 66],
  ['6PM', 'moon', 62],
]

export default function Weather() {
  return (
    <div className="weather-app">
      <div className="city">{profile.location.split(',')[0]}</div>
      <div className="temp">68°</div>
      <div className="desc">Mostly Sunny · H:72° L:58°</div>

      <div className="hourly">
        {hours.map(([t, ic, deg]) => (
          <div className="hour" key={t}>
            <span>{t}</span>
            <Icon name={ic} size={20} color="#fff" />
            <b>{deg}°</b>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30, width: '100%', maxWidth: 420, textAlign: 'left' }}>
        {[
          ['Today', 'sun', 72, 58],
          ['Tomorrow', 'cloud', 70, 57],
          ['Wednesday', 'cloud', 66, 55],
          ['Thursday', 'sun', 69, 56],
        ].map(([d, ic, hi, lo]) => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ width: 100 }}>{d}</span>
            <Icon name={ic} size={18} color="#fff" />
            <span style={{ marginLeft: 'auto', opacity: 0.8 }}>{lo}°</span>
            <span style={{ width: 34, textAlign: 'right' }}>{hi}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
