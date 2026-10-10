import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

const replies = [
  'Thanks for reaching out! I usually reply within a day.',
  'That sounds interesting — tell me more!',
  'You can also email me at ' + profile.email + '.',
  'I\'d love to chat about a project. What do you have in mind?',
  'Check out my GitHub for more of my work!',
]

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'them', text: `Hi! This is ${profile.name}'s portfolio. Type a message and I'll auto-reply.` },
  ])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const t = text.trim()
    if (!t) return
    setMessages((m) => [...m, { id: Date.now(), from: 'me', text: t }])
    setText('')
    setTyping(true)
    const reply = replies[Math.floor(Math.random() * replies.length)]
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'them', text: reply }])
    }, 1300 + Math.random() * 900)
  }

  return (
    <div className="app">
      <div className="sidebar msg-sidebar">
        <div className="sidebar__section">Messages</div>
        <div className="sidebar__item active" style={{ gap: 10 }}>
          <span className="avatar-mini" style={{ background: 'linear-gradient(135deg,#5ac8fa,#af52de)', display: 'inline-block' }} />
          <div style={{ lineHeight: 1.2 }}>
            <b style={{ fontSize: 13 }}>{profile.name}</b>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>You are here</div>
          </div>
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
        <div className="msg-thread">
          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.from === 'me' ? 'me' : 'them'}`}>
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="typing">
              <i />
              <i />
              <i />
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="composer">
          <input
            placeholder="iMessage"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="send-btn" onClick={send} aria-label="Send">
            <Icon name="arrowUp" size={16} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}
