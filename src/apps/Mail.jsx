import { useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'
import { actions } from '../system/store.js'

export default function Mail() {
  const [to, setTo] = useState(profile.email)
  const [subject, setSubject] = useState('Hello from your portfolio!')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const send = () => {
    const url = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
    setSent(true)
    actions.notify({ appId: 'mail', title: 'Mail', body: 'Opening your email client…' })
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar__section">Mailboxes</div>
        {[
          ['Inbox', 'mail', 0],
          ['VIP', 'star', 0],
          ['Drafts', 'file', 0],
          ['Sent', 'forward', 0],
          ['Junk', 'x', 0],
          ['Trash', 'trash', 0],
        ].map(([n, ic]) => (
          <div key={n} className={`sidebar__item ${n === 'Drafts' ? 'active' : ''}`}>
            <span className="ic">
              <Icon name={ic} size={15} />
            </span>
            {n}
          </div>
        ))}
      </div>

      <div className="app-main">
        <div className="toolbar">
          <b style={{ fontSize: 13.5 }}>New Message</b>
          <div className="spacer" />
          <button className="iconbtn" onClick={send} title="Send">
            <Icon name="arrowUp" />
          </button>
          <button className="iconbtn" onClick={() => actions.closeActive()} title="Discard">
            <Icon name="trash" />
          </button>
        </div>

        {sent ? (
          <div className="empty-state">
            <Icon name="check" size={40} color="var(--green)" />
            <div>Your email client should now be open.</div>
            <button className="btn" style={{ flex: 'none' }} onClick={() => setSent(false)}>
              Write another
            </button>
          </div>
        ) : (
          <div className="mail-compose">
            <div className="field">
              <label>To:</label>
              <input value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="field">
              <label>Subject:</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <textarea
              placeholder={`Hi ${profile.firstName},\n\nI came across your portfolio and would love to chat…`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ flex: 1 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn primary" style={{ flex: 'none', padding: '7px 20px' }} onClick={send}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
