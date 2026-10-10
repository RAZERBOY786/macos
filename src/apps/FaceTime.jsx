import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

export default function FaceTime() {
  return (
    <div className="facetime">
      <span
        className="facetime__avatar"
        style={{ backgroundImage: `url("${profile.avatar}")`, backgroundSize: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}
      />
      <h2 style={{ margin: 0 }}>Let's talk</h2>
      <p style={{ margin: 0, opacity: 0.9, maxWidth: 340 }}>
        I'm {profile.name}, a {profile.role}. I'd love to hear about your project, role or idea.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        <a className="btn primary" href={`mailto:${profile.email}`} style={{ flex: 'none', padding: '9px 22px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="mail" size={16} color="#fff" /> Email me
        </a>
        <a className="btn" href={profile.socials.linkedin} target="_blank" rel="noreferrer" style={{ flex: 'none', padding: '9px 22px', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="linkedin" size={16} /> Connect
        </a>
      </div>
      <a className="btn" href={profile.resumeUrl} download style={{ flex: 'none', marginTop: 4, padding: '9px 22px', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.18)', boxShadow: 'none' }}>
        <Icon name="download" size={16} /> Download résumé
      </a>
    </div>
  )
}
