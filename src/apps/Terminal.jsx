import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import { fileSystem } from '../data/fs.js'
import { actions } from '../system/store.js'
import sound from '../system/sound.js'

const ASCII = `<pre>  ___  ___  ___  ___  ___
 |  _||   ||  _||   ||  _|
 |.  ||.  ||   ||.  ||.  |
 |___||___||_|_||___||___|
   MAC  OS  PORTFOLIO</pre>`

export default function Terminal() {
  const [lines, setLines] = useState([
    { type: 'out', text: `Last login: today on ttys000` },
    { type: 'out', text: `Type "help" to see available commands.` },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const [cwd, setCwd] = useState('~')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const getDir = (path) => {
    // very small path resolver: '~', '~/', 'folder'
    const me = fileSystem.children.find((c) => c.id === 'users').children[0]
    if (!path || path === '~' || path === '/') return me
    const name = path.replace('~/', '').replace('./', '')
    const found = (me.children || []).find((c) => c.name.toLowerCase() === name.toLowerCase())
    return found || me
  }

  const print = (arr) => setLines((l) => [...l, ...arr])

  const run = (raw) => {
    const cmd = raw.trim()
    print([{ type: 'cmd', text: `${profile.firstName.toLowerCase()}@macbook ${cwd} % ${raw}` }])
    if (!cmd) return
    setHistory((h) => [cmd, ...h].slice(0, 50))
    const [name, ...args] = cmd.split(/\s+/)
    const dir = getDir(cwd)

    switch (name.toLowerCase()) {
      case 'help':
        print([
          { type: 'ok', text: 'Available commands:' },
          { type: 'out', text: '  whoami      – who is behind this portfolio' },
          { type: 'out', text: '  about       – short bio' },
          { type: 'out', text: '  skills      – technical skills' },
          { type: 'out', text: '  projects    – things I have built' },
          { type: 'out', text: '  contact     – how to reach me' },
          { type: 'out', text: '  experience  – work history' },
          { type: 'out', text: '  education   – schooling' },
          { type: 'out', text: '  ls [dir]    – list files' },
          { type: 'out', text: '  cd <dir>    – change directory' },
          { type: 'out', text: '  cat <file>  – print a file' },
          { type: 'out', text: '  open <app>  – launch an app' },
          { type: 'out', text: '  neofetch    – system info' },
          { type: 'out', text: '  date, echo <text>, clear, sudo' },
        ])
        break
      case 'whoami':
        print([{ type: 'ok', text: `${profile.name} — ${profile.role}` }])
        break
      case 'about':
        print(profile.about.map((t) => ({ type: 'out', text: t })))
        break
      case 'skills':
        print(
          Object.entries(profile.skills).map(([k, v]) => ({
            type: 'out',
            text: `${k.padEnd(10)}: ${v.join(', ')}`,
          })),
        )
        break
      case 'projects':
        print(profile.projects.map((p) => ({ type: 'out', text: `${p.year}  ${p.title} — ${p.tech.join(', ')}` })))
        break
      case 'experience':
        print(profile.experience.map((e) => ({ type: 'out', text: `${e.period}  ${e.role} @ ${e.company}` })))
        break
      case 'education':
        print(profile.education.map((e) => ({ type: 'out', text: `${e.period}  ${e.degree} — ${e.school}` })))
        break
      case 'contact':
        print([
          { type: 'ok', text: `Email:    ${profile.email}` },
          { type: 'out', text: `GitHub:   ${profile.socials.github}` },
          { type: 'out', text: `LinkedIn: ${profile.socials.linkedin}` },
          { type: 'out', text: `X:        ${profile.socials.twitter}` },
        ])
        break
      case 'ls': {
        const target = args[0] ? getDir(args[0]) : dir
        print([{ type: 'out', text: (target.children || []).map((c) => c.name + (c.type === 'folder' || c.type === 'drive' ? '/' : '')).join('    ') || '(empty)' }])
        break
      }
      case 'cd': {
        if (!args[0] || args[0] === '~') {
          setCwd('~')
        } else if (args[0] === '..') {
          setCwd('~')
        } else {
          const found = (dir.children || []).find((c) => c.name.toLowerCase() === args[0].toLowerCase())
          if (found && (found.type === 'folder' || found.type === 'drive')) setCwd('~/' + found.name)
          else print([{ type: 'err', text: `cd: no such directory: ${args[0]}` }])
        }
        break
      }
      case 'cat': {
        if (!args[0]) return print([{ type: 'err', text: 'cat: missing file operand' }])
        const f = (dir.children || []).find((c) => c.name.toLowerCase() === args[0].toLowerCase())
        if (!f) print([{ type: 'err', text: `cat: ${args[0]}: No such file or directory` }])
        else if (f.type === 'folder') print([{ type: 'err', text: `cat: ${args[0]}: Is a directory` }])
        else print([{ type: 'out', text: f.detail || f.project?.description || f.name }])
        break
      }
      case 'open': {
        const appId = (args[0] || '').toLowerCase()
        const map = { finder: 'finder', safari: 'safari', notes: 'notes', photos: 'photos', music: 'music', calculator: 'calculator', settings: 'settings', vscode: 'vscode', messages: 'messages', mail: 'mail', calendar: 'calendar', maps: 'maps', preview: 'preview' }
        if (map[appId]) {
          actions.openApp(map[appId])
          print([{ type: 'ok', text: `Opening ${map[appId]}…` }])
        } else print([{ type: 'err', text: `open: unknown app "${args[0] || ''}"` }])
        break
      }
      case 'neofetch': {
        print([
          { type: 'raw', text: ASCII },
          { type: 'out', text: `${'user'.padEnd(10)}${profile.name}` },
          { type: 'out', text: `${'host'.padEnd(10)}${profile.role}` },
          { type: 'out', text: `${'OS'.padEnd(10)}macOS Portfolio 1.0` },
          { type: 'out', text: `${'Shell'.padEnd(10)}portfolio-sh` },
          { type: 'out', text: `${'Location'.padEnd(10)}${profile.location}` },
          { type: 'out', text: `${'Email'.padEnd(10)}${profile.email}` },
        ])
        break
      }
      case 'date':
        print([{ type: 'out', text: new Date().toString() }])
        break
      case 'echo':
        print([{ type: 'out', text: args.join(' ') }])
        break
      case 'clear':
        setLines([])
        break
      case 'sudo':
        print([{ type: 'err', text: `${profile.firstName.toLowerCase()} is not in the sudoers file. This incident will be reported. ;)` }])
        break
      case 'exit':
        actions.closeActive()
        break
      default:
        print([{ type: 'err', text: `zsh: command not found: ${name}` }])
        sound.error()
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
      setHIndex(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const ni = Math.min(hIndex + 1, history.length - 1)
      if (ni >= 0) {
        setHIndex(ni)
        setInput(history[ni])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const ni = hIndex - 1
      setHIndex(ni)
      setInput(ni >= 0 ? history[ni] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const cmds = ['help', 'whoami', 'about', 'skills', 'projects', 'experience', 'education', 'contact', 'ls', 'cd', 'cat', 'open', 'neofetch', 'date', 'echo', 'clear', 'sudo', 'exit']
      const m = cmds.filter((c) => c.startsWith(input.trim()))
      if (m.length === 1) setInput(m[0] + ' ')
      else if (m.length > 1) print([{ type: 'out', text: m.join('    ') }])
    }
  }

  return (
    <div
      className="terminal"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => {
        if (l.type === 'raw') return <div key={i} className="out" dangerouslySetInnerHTML={{ __html: l.text }} />
        if (l.type === 'cmd') return <div key={i} className="out" style={{ color: '#e8e8e8' }}>{l.text}</div>
        return (
          <div key={i} className={l.type === 'err' ? 'err' : l.type === 'ok' ? 'ok' : 'out'}>
            {l.text}
          </div>
        )
      })}
      <div className="terminal__input-row">
        <span className="prompt">{profile.firstName.toLowerCase()}@macbook</span>
        <span className="path"> {cwd} </span>
        <span className="prompt">%&nbsp;</span>
        <input
          ref={inputRef}
          className="terminal__input"
          value={input}
          autoFocus
          spellCheck={false}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  )
}
