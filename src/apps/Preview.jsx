import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

export default function Preview() {
  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="toolbar">
        <b style={{ fontSize: 13 }}>{profile.resumeFileName}</b>
        <div className="spacer" />
        <a className="iconbtn" href={profile.resumeUrl} download title="Download">
          <Icon name="download" />
        </a>
        <button className="iconbtn" onClick={() => window.print()}>
          <Icon name="share" />
        </button>
      </div>

      <div className="app-scroll" style={{ background: '#525659', padding: 24 }}>
        <div
          style={{
            maxWidth: 760, margin: '0 auto', background: '#fff', color: '#1d1d1f',
            padding: '48px 54px', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            fontSize: 13, lineHeight: 1.55, userSelect: 'text',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.5px' }}>{profile.name}</h1>
          <div style={{ color: '#007aff', fontWeight: 600, marginTop: 2 }}>{profile.role}</div>
          <div style={{ color: '#6e6e73', marginTop: 6, fontSize: 12 }}>
            {profile.email} · {profile.phone} · {profile.location}
            <br />
            {profile.socials.github} · {profile.socials.linkedin}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e5ea', margin: '20px 0' }} />

          <h3 style={{ margin: '0 0 6px', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.6, color: '#86868b' }}>Summary</h3>
          <p style={{ margin: 0 }}>{profile.about[0]}</p>

          <h3 style={{ margin: '20px 0 6px', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.6, color: '#86868b' }}>Experience</h3>
          {profile.experience.map((e) => (
            <div key={e.company} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>{e.role} — {e.company}</b>
                <span style={{ color: '#86868b' }}>{e.period}</span>
              </div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}

          <h3 style={{ margin: '20px 0 6px', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.6, color: '#86868b' }}>Skills</h3>
          <p style={{ margin: 0 }}>
            {Object.values(profile.skills).flat().join(' · ')}
          </p>

          <h3 style={{ margin: '20px 0 6px', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.6, color: '#86868b' }}>Education</h3>
          {profile.education.map((e) => (
            <div key={e.school} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><b>{e.degree}</b> — {e.school}</span>
              <span style={{ color: '#86868b' }}>{e.period}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
