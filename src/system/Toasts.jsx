import { actions, useSystem } from './store.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import Icon from '../icons/UIIcons.jsx'

export default function Toasts() {
  const s = useSystem()
  if (!s.toasts.length) return null
  return (
    <div className="toast-layer">
      {s.toasts.map((t) => (
        <div key={t.id} className={`toast notification`}>
          <span className="notification__ic">
            <AppIcon app={t.appId} size={34} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{t.title}</b>
            <p>{t.body}</p>
          </div>
          <button className="iconbtn" style={{ alignSelf: 'flex-start', flex: 'none', margin: '-4px -6px 0 0' }} onClick={() => actions.dismissToast(t.id)}>
            <Icon name="x" size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}