import Icon from '../icons/UIIcons.jsx'
import { LOCATION, useWeather, weatherIcon, weatherLabel } from '../system/useWeather.js'

const round = (v) => Math.round(v)
const dayName = (iso) => new Date(iso).toLocaleDateString('en-US', { weekday: 'long' })
const hourLabel = (iso) => {
  const h = new Date(iso).getHours()
  return `${h % 12 === 0 ? 12 : h % 12}${h >= 12 ? 'PM' : 'AM'}`
}
const clockLabel = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const compass = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round((deg % 360) / 45) % 8]
}
const uvLabel = (v) => {
  if (v == null) return ''
  if (v < 3) return 'Low'
  if (v < 6) return 'Moderate'
  if (v < 8) return 'High'
  if (v < 11) return 'Very High'
  return 'Extreme'
}

export default function Weather() {
  const w = useWeather()
  const cur = w?.current
  const hourly = w?.hourly
  const daily = w?.daily

  const curPrefix = cur?.time?.slice(0, 13)
  let start = hourly && curPrefix ? hourly.time.findIndex((t) => t.slice(0, 13) === curPrefix) : 0
  if (start < 0) start = 0

  const temp = cur != null ? round(cur.temperature_2m) : null
  const feels = cur != null ? round(cur.apparent_temperature) : null
  const hi = daily ? round(daily.temperature_2m_max[0]) : null
  const lo = daily ? round(daily.temperature_2m_min[0]) : null
  const isDay = cur ? cur.is_day === 1 : true

  const nowPop = hourly?.precipitation_probability?.[start]

  /* Next 12 hours from the current hour. */
  const nextHours = Array.from({ length: 12 }, (_, i) => {
    const k = start + i
    if (!hourly || k >= hourly.time.length) return null
    const code = hourly.weather_code?.[k]
    const day = hourly.is_day?.[k] === 1
    return {
      key: hourly.time[k],
      t: i === 0 ? 'Now' : hourLabel(hourly.time[k]),
      icon: weatherIcon(code, day),
      temp: round(hourly.temperature_2m[k]),
      pop: hourly.precipitation_probability?.[k] ?? 0,
    }
  }).filter(Boolean)

  /* Weekly range for the daily temperature bars. */
  let weekMin = Infinity
  let weekMax = -Infinity
  if (daily) {
    for (let i = 0; i < daily.time.length; i++) {
      weekMin = Math.min(weekMin, daily.temperature_2m_min[i])
      weekMax = Math.max(weekMax, daily.temperature_2m_max[i])
    }
  }
  const span = weekMax - weekMin || 1

  const dayCount = daily ? daily.time.length : 0
  const uv = hourly?.uv_index?.[start]
  const visM = hourly?.visibility?.[start]
  const visKm = visM != null ? visM / 1000 : null

  const details = [
    {
      icon: 'sun',
      label: 'UV Index',
      value: uv != null ? String(round(uv)) : '--',
      sub: uv != null ? uvLabel(uv) : '—',
    },
    {
      icon: 'clock',
      label: 'Sunrise',
      value: daily?.sunrise?.[0] ? clockLabel(daily.sunrise[0]) : '--',
      sub: daily?.sunset?.[0] ? `Sunset: ${clockLabel(daily.sunset[0])}` : '—',
    },
    {
      icon: 'wind',
      label: 'Wind',
      value: cur ? `${round(cur.wind_speed_10m)} km/h` : '--',
      sub: cur?.wind_direction_10m != null ? `From ${compass(cur.wind_direction_10m)}` : '—',
    },
    {
      icon: 'rain',
      label: 'Precipitation',
      value: cur ? `${cur.precipitation ?? 0} mm` : '--',
      sub: nowPop != null ? `Chance ${nowPop}%` : 'in last hour',
    },
    {
      icon: 'sun',
      label: 'Feels Like',
      value: feels != null ? `${feels}°` : '--',
      sub:
        feels != null && temp != null
          ? feels > temp
            ? 'Warmer than actual'
            : feels < temp
              ? 'Cooler than actual'
              : 'Similar to actual'
          : '—',
    },
    {
      icon: 'cloud',
      label: 'Humidity',
      value: cur ? `${round(cur.relative_humidity_2m)}%` : '--',
      sub: cur?.dew_point_2m != null ? `Dew point ${round(cur.dew_point_2m)}°` : '—',
    },
    {
      icon: 'globe',
      label: 'Visibility',
      value: visKm != null ? `${Math.round(visKm)} km` : '--',
      sub: visKm != null ? (visKm >= 10 ? 'Clear' : visKm >= 4 ? 'Moderate' : 'Reduced') : '—',
    },
    {
      icon: 'sliders',
      label: 'Pressure',
      value: cur ? `${round(cur.surface_pressure)} hPa` : '--',
      sub: 'Surface pressure',
    },
  ]

  return (
    <div className="weather">
      <aside className="weather__side">
        <div className="weather__search">
          <Icon name="search" size={14} />
          <input placeholder="Search for a city or airport" spellCheck={false} />
        </div>
        <div className="weather__list">
          <button type="button" className="weather__city active">
            <span className="weather__city-main">
              <b>My Location</b>
              <span>{cur ? weatherLabel(cur.weather_code) : 'Loading…'}</span>
            </span>
            <span className="weather__city-temp">{temp != null ? `${temp}°` : '--'}</span>
          </button>
          <button type="button" className="weather__city">
            <span className="weather__city-main">
              <b>{LOCATION.name}</b>
              <span>{cur ? weatherLabel(cur.weather_code) : 'Loading…'}</span>
            </span>
            <span className="weather__city-temp">{temp != null ? `${temp}°` : '--'}</span>
          </button>
        </div>
      </aside>

      <main className={`weather__main ${isDay ? 'is-day' : 'is-night'}`}>
        <div className="weather__scroll">
          <header className="weather__head">
            <div className="weather__head-city">{LOCATION.name}</div>
            <div className="weather__head-temp">{temp != null ? `${temp}°` : '--°'}</div>
            <div className="weather__head-cond">{cur ? weatherLabel(cur.weather_code) : 'Fetching live forecast…'}</div>
            <div className="weather__head-range">
              {hi != null ? `H:${hi}°  L:${lo}°` : ''}
            </div>
          </header>

          <section className="wcard">
            <div className="wcard__title">
              <Icon name="clock" size={13} color="rgba(255,255,255,0.8)" /> Hourly Forecast
            </div>
            <div className="whours">
              {nextHours.length ? (
                nextHours.map((h) => (
                  <div className="whour" key={h.key}>
                    <span>{h.t}</span>
                    <span className="ic">
                      <Icon name={h.icon} size={20} color="#fff" />
                    </span>
                    <span className="pop">{h.pop > 5 ? `${h.pop}%` : ''}</span>
                    <b>{h.temp}°</b>
                  </div>
                ))
              ) : (
                <span className="weather__muted">Loading…</span>
              )}
            </div>
          </section>

          <section className="wcard">
            <div className="wcard__title">
              <Icon name="calendar" size={13} color="rgba(255,255,255,0.8)" /> {dayCount}-Day Forecast
            </div>
            <div className="wdays">
              {daily && daily.time[0] ? (
                daily.time.map((day, i) => {
                  const dleft = ((daily.temperature_2m_min[i] - weekMin) / span) * 100
                  const dwidth = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / span) * 100
                  return (
                    <div className="wday" key={day}>
                      <span className="wday__name">{i === 0 ? 'Today' : dayName(day)}</span>
                      <span className="wday__ic">
                        <Icon name={weatherIcon(daily.weather_code[i], true)} size={18} color="#fff" />
                      </span>
                      <span className="wday__lo">{round(daily.temperature_2m_min[i])}°</span>
                      <span className="wrange">
                        <i style={{ left: `${dleft}%`, width: `${Math.max(dwidth, 8)}%` }} />
                      </span>
                      <span className="wday__hi">{round(daily.temperature_2m_max[i])}°</span>
                    </div>
                  )
                })
              ) : (
                <span className="weather__muted">Loading…</span>
              )}
            </div>
          </section>

          <div className="weather__grid">
            {details.map((d) => (
              <section className="wcard wdetail" key={d.label}>
                <div className="wcard__title">
                  <Icon name={d.icon} size={13} color="rgba(255,255,255,0.8)" /> {d.label}
                </div>
                <div className="wdetail__value">{d.value}</div>
                <div className="wdetail__sub">{d.sub}</div>
                <span className="wdetail__ic">
                  <Icon name={d.icon} size={30} color="rgba(255,255,255,0.5)" />
                </span>
              </section>
            ))}
          </div>

          <div className="weather__foot">
            {cur ? `Updated ${hourLabel(cur.time)} · Live data from Open-Meteo` : 'Live data from Open-Meteo'}
          </div>
        </div>
      </main>
    </div>
  )
}
