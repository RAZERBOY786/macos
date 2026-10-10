import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

export default function Maps() {
  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="toolbar">
        <Icon name="search" size={15} color="var(--text-3)" />
        <input
          placeholder="Search for a place"
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', flex: 1 }}
        />
        <span className="badge">
          <Icon name="map" size={12} /> {profile.location}
        </span>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          className="map-embed"
          title="map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=88.28%2C22.48%2C88.44%2C22.65&layer=mapnik&marker=22.5726%2C88.3639"
        />
        <div
          style={{
            position: 'absolute', left: 16, bottom: 16, padding: '10px 14px', borderRadius: 10,
            background: 'var(--sheet-bg)', boxShadow: 'var(--shadow-window)', display: 'flex', gap: 10, alignItems: 'center',
          }}
        >
          <span style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--blue)', display: 'grid', placeItems: 'center' }}>
            <Icon name="map" size={18} color="#fff" />
          </span>
          <div>
            <b style={{ fontSize: 13 }}>{profile.location}</b>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>Where I build things</div>
          </div>
        </div>
      </div>
    </div>
  )
}
