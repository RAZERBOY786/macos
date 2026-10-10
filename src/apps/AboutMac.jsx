import { profile } from '../data/profile.js'
import { BrandLogo } from '../icons/AppIcons.jsx'
import Icon from '../icons/UIIcons.jsx'
import { actions } from '../system/store.js'

export default function AboutMac() {
  return (
    <div className="about-mac">
      <div className="about-mac__logo">
        <BrandLogo size={72} color="var(--text)" />
      </div>
      <h1>{profile.system.model}</h1>
      <div className="sub">{profile.system.osVersion}</div>

      <div className="about-mac__specs">
        <p><span>Chip</span><span>{profile.system.chip}</span></p>
        <p><span>Memory</span><span>{profile.system.memory}</span></p>
        <p><span>Startup disk</span><span>Macintosh HD</span></p>
        <p><span>Serial number</span><span>{profile.system.serial}</span></p>
        <p><span>Owner</span><span>{profile.name}</span></p>
      </div>

      <button className="btn primary" style={{ flex: 'none', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => actions.openApp('facetime')}>
        <Icon name="heart" size={16} />
        Hire me
      </button>
    </div>
  )
}
