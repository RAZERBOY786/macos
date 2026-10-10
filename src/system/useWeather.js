import { useEffect, useState } from 'react'

/**
 * useWeather — shared Open-Meteo client used by both the Weather app and the
 * menu bar. Results are cached at module level so the two never double-fetch,
 * and they auto-refresh every `refreshMs` while mounted.
 */
const API = 'https://api.open-meteo.com/v1/forecast'
export const LOCATION = { lat: 22.5726, lon: 88.3639, name: 'Kolkata' }
const PARAMS =
  'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,dew_point_2m' +
  '&hourly=temperature_2m,weather_code,precipitation_probability,is_day,uv_index,visibility' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max' +
  '&forecast_days=10&timezone=auto'

let cache = null
let inflight = null

async function load() {
  if (!inflight) {
    inflight = fetch(`${API}?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}&${PARAMS}`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
      .then((json) => {
        cache = json
        return json
      })
      .catch(() => cache)
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function useWeather(refreshMs = 10 * 60 * 1000) {
  const [data, setData] = useState(cache)

  useEffect(() => {
    let cancelled = false
    load().then((json) => {
      if (!cancelled) setData(json)
    })
    const id = setInterval(() => {
      load().then((json) => {
        if (!cancelled) setData(json)
      })
    }, refreshMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [refreshMs])

  return data
}

const BY_CODE = {
  0: ['Clear Sky', 'sun'],
  1: ['Mainly Clear', 'sun'],
  2: ['Partly Cloudy', 'cloud'],
  3: ['Overcast', 'cloud'],
  45: ['Fog', 'cloud'],
  48: ['Fog', 'cloud'],
  51: ['Light Drizzle', 'rain'],
  53: ['Drizzle', 'rain'],
  55: ['Dense Drizzle', 'rain'],
  61: ['Light Rain', 'rain'],
  63: ['Rain', 'rain'],
  65: ['Heavy Rain', 'rain'],
  71: ['Light Snow', 'snow'],
  73: ['Snow', 'snow'],
  75: ['Heavy Snow', 'snow'],
  77: ['Snow Grains', 'snow'],
  80: ['Light Showers', 'rain'],
  81: ['Showers', 'rain'],
  82: ['Heavy Showers', 'rain'],
  85: ['Snow Showers', 'snow'],
  86: ['Snow Showers', 'snow'],
  95: ['Thunderstorm', 'storm'],
  96: ['Thunderstorm', 'storm'],
  99: ['Thunderstorm', 'storm'],
}

export function weatherLabel(code) {
  return BY_CODE[code]?.[0] || 'Clear Sky'
}

export function weatherIcon(code, isDay = true) {
  if (code === 0 || code === 1) return isDay ? 'sun' : 'moon'
  return BY_CODE[code]?.[1] || 'cloud'
}