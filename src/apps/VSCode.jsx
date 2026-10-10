import { useState } from 'react'
import { profile } from '../data/profile.js'
import Icon from '../icons/UIIcons.jsx'

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Tiny syntax highlighter for display purposes only. */
function highlight(code) {
  let s = esc(code)
  s = s.replace(/(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>')
  s = s.replace(/(`[^`]*`|'[^']*'|"[^"]*")/g, '<span class="tok-str">$1</span>')
  s = s.replace(
    /\b(const|let|var|function|return|import|export|from|default|class|extends|if|else|for|while|new|await|async|=>|of|in|null|true|false)\b/g,
    '<span class="tok-key">$1</span>',
  )
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>')
  s = s.replace(/(\w+)(\()/g, '<span class="tok-fn">$1</span>$2')
  s = s.replace(/(&lt;\/?[a-zA-Z][\w-]*)/g, '<span class="tok-tag">$1</span>')
  return s
}

const files = {
  'portfolio.js': `// portfolio.js — the data behind this site
export const me = {
  name: '${profile.name}',
  role: '${profile.role}',
  location: '${profile.location}',
  email: '${profile.email}',
}

export const skills = ${JSON.stringify(profile.skills, null, 2)}

export function greet() {
  return \`Hi, I'm \${me.name} — \${me.role}\`
}
`,
  'projects.json': JSON.stringify(profile.projects, null, 2),
  'App.jsx': `import { useState } from 'react'
import Desktop from './Desktop'

export default function App() {
  const [booted, setBooted] = useState(false)
  return booted ? <Desktop /> : <BootScreen onDone={setBooted} />
}
`,
  'utils.js': `// small helpers
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

export const debounce = (fn, ms = 200) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}
`,
  'README.md': `# ${profile.name} — Portfolio

${profile.tagline}

## Tech
${Object.values(profile.skills).flat().join(', ')}

Built with ❤️ and a lot of coffee.
`,
}

const tree = [
  { folder: 'src', children: Object.keys(files) },
]

export default function VSCode() {
  const [active, setActive] = useState('portfolio.js')

  return (
    <div className="vsc">
      <div className="vsc__side">
        <div style={{ display: 'flex', gap: 14, padding: '10px 12px', fontSize: 11, color: '#9aa0a6', borderBottom: '1px solid #1a1a1a' }}>
          <Icon name="file" size={15} />
          <Icon name="search" size={15} />
          <Icon name="share" size={15} />
        </div>
        <div className="vsc__tree">
          {tree.map((g) => (
            <div key={g.folder}>
              <div className="vsc__folder">
                <Icon name="chevronDown" size={12} />
                <span style={{ color: '#e8e8e8', fontWeight: 600 }}>{g.folder}</span>
              </div>
              {g.children.map((f) => (
                <div
                  key={f}
                  className={`vsc__file ${active === f ? 'active' : ''}`}
                  style={{ paddingLeft: 26 }}
                  onClick={() => setActive(f)}
                >
                  <Icon name="file" size={13} />
                  {f}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="app-main" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="vsc__tabs">
          <div className="vsc__tab active">{active}</div>
        </div>
        <div className="vsc__editor">
          {files[active].split('\n').map((line, i) => (
            <div className="vsc__line" key={i}>
              <span className="vsc__ln">{i + 1}</span>
              <span className="vsc__code" dangerouslySetInnerHTML={{ __html: highlight(line) || '&nbsp;' }} />
            </div>
          ))}
        </div>
        <div style={{ height: 22, background: '#007acc', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', padding: '0 12px', justifyContent: 'space-between' }}>
          <span>main*</span>
          <span>Ln {files[active].split('\n').length}, UTF-8 · JavaScript · Prettier</span>
        </div>
      </div>
    </div>
  )
}
