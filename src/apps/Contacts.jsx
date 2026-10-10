import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

export default function Contacts() {
  const links = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: 'mail', color: '#007aff' },
    { label: 'GitHub', value: profile.socials.github.replace('https://', ''), href: profile.socials.github, icon: 'github', color: '#24292e' },
    { label: 'LinkedIn', value: profile.socials.linkedin.replace('https://', ''), href: profile.socials.linkedin, icon: 'linkedin', color: '#0a66c2' },
    { label: 'X (Twitter)', value: profile.socials.twitter.replace('https://', ''), href: profile.socials.twitter, icon: 'twitter', color: '#000000' },
  ]

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar__section">Contacts</div>
        <div className="sidebar__item active">
          <span className="ic">
            <Icon name="user" size={15} />
          </span>
          {profile.name}
        </div>
      </div>

      <div className="app-main">
        <div className="toolbar">
          <b style={{ fontSize: 13.5 }}>{profile.name}</b>
          <div className="spacer" />
          <button className="iconbtn" onClick={() => window.open(`mailto:${profile.email}`)}>
            <Icon name="mail" />
          </button>
        </div>
        <div className="app-scroll" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
            <span style={{ width: 78, height: 78, borderRadius: '50%', backgroundImage: `url("${profile.avatar}")`, backgroundSize: 'cover', boxShadow: '0 6px 18px rgba(0,0,0,0.2)' }} />
            <div>
              <h2 style={{ margin: 0 }}>{profile.name}</h2>
              <div style={{ color: 'var(--text-3)' }}>{profile.role} · {profile.location}</div>
            </div>
          </div>
          {links.map((l) => (
            <a key={l.label} className="social-row" href={l.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: l.color, display: 'grid', placeItems: 'center' }}>
                <Icon name={l.icon} size={18} color="#fff" />
              </span>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 13.5 }}>{l.label}</b>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{l.value}</div>
              </div>
              <Icon name="chevronRight" size={16} color="var(--text-3)" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
