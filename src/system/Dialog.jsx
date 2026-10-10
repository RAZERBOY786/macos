import { actions, useSystem } from './store.js'
import { AppIcon } from '../icons/AppIcons.jsx'
import { appsMeta } from '../data/appsMeta.js'
import sound from './sound.js'

export default function Dialog() {
  const s = useSystem()
  const d = s.dialog
  if (!d) return null

  /* Force Quit modal is a special case that reads live data */
  const forceQuitApps = [...new Set(s.windows.map((w) => w.appId))]

  return (
    <div className="dialog-layer">
      <div className="dialog">
        {d.forceQuit ? (
          <>
            <h3>{d.title}</h3>
            <p>{d.message}</p>
            <div style={{ maxHeight: 200, overflow: 'auto', textAlign: 'left', marginBottom: 16 }}>
              {forceQuitApps.length === 0 && <div style={{ color: 'var(--text-3)', textAlign: 'center' }}>No running applications.</div>}
              {forceQuitApps.map((a) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 4px', borderBottom: '0.5px solid var(--hairline-2)' }}>
                  <span style={{ width: 26, height: 26 }}><AppIcon app={a} size={26} /></span>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 13 }}>{appsMeta[a]?.name}</span>
                  <button
                    className="btn danger"
                    style={{ flex: 'none', padding: '3px 12px' }}
                    onClick={() => { sound.close(); actions.quitAppImmediate(a) }}
                  >
                    Force Quit
                  </button>
                </div>
              ))}
            </div>
            <div className="dialog__actions">
              <button className="btn primary" onClick={() => actions.closeDialog()}>Done</button>
            </div>
          </>
        ) : (
          <>
            <div className="dialog__icon">
              <AppIcon app={d.icon || 'settings'} size={56} />
            </div>
            <h3>{d.title}</h3>
            <p>{d.message}</p>
            <div className="dialog__actions">
              {d.actions.map((a) => (
                <button
                  key={a.label}
                  className={`btn ${a.variant === 'primary' ? 'primary' : ''}`}
                  onClick={() => {
                    sound.click()
                    actions.closeDialog()
                    a.onClick?.()
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}