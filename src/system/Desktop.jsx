import { useRef, useState } from 'react'
import { actions, useSystem } from './store.js'
import { desktopIcons } from '../data/fs.js'
import { Icons } from '../icons/AppIcons.jsx'
import sound from './sound.js'

const GRID = 10
const GRID_W = 98
const GRID_H = 86
const ICON_W = 92
const MENUBAR_H = 26

/* Icons stack down from just under the menu-bar clock, right-aligned,
   wrapping into extra columns to the left when a column fills up. */
const deskPos = (i) => {
  const marginX = 18
  const marginY = 10
  const perCol = Math.max(2, Math.floor((window.innerHeight - MENUBAR_H - marginY * 2) / GRID_H))
  const col = Math.floor(i / perCol)
  const row = i % perCol
  return {
    x: window.innerWidth - marginX - ICON_W - col * GRID_W,
    y: marginY + row * GRID_H,
  }
}

function KindIcon({ kind, size = 54 }) {
  const map = {
    hd: Icons.hd,
    pdf: Icons.pdf,
    folder: Icons.folder,
    trash: Icons.trash,
  }
  const Comp = map[kind] || Icons.folder
  return (
    <span className="desk-icon__img" style={{ width: size, height: size, display: 'block' }}>
      <Comp />
    </span>
  )
}

export default function Desktop() {
  const s = useSystem()
  const deskRef = useRef(null)
  const [icons, setIcons] = useState(() => [
    ...desktopIcons,
    ...s.desktopFolders
      .filter((f) => !desktopIcons.some((d) => d.name === f))
      .map((f) => ({ id: 'f-' + f, name: f, kind: 'folder', target: 'finder' })),
  ])
  const [pos, setPos] = useState({})
  const [dragging, setDragging] = useState(null)
  const [marquee, setMarquee] = useState(null)
  const selRef = useRef(new Set())

  const wallpaper = s.wallpapers.find((w) => w.id === s.wallpaperId) || s.wallpapers[0]

  const open = (icon) => {
    if (icon.kind === 'hd') actions.openApp('finder', { props: { location: 'macintosh-hd' } })
    else if (icon.kind === 'pdf') actions.openApp('preview')
    else if (icon.kind === 'trash') actions.openApp('trash')
    else actions.openApp('finder')
    sound.open()
  }

  const onIconMouseDown = (e, icon) => {
    e.stopPropagation()
    const multi = e.metaKey || e.ctrlKey || e.shiftKey
    if (multi) {
      if (selRef.current.has(icon.id)) selRef.current.delete(icon.id)
      else selRef.current.add(icon.id)
    } else {
      selRef.current = new Set([icon.id])
    }
    actions.selectIcons([...selRef.current])
    const startX = e.clientX
    const startY = e.clientY
    const o = pos[icon.id] || { x: 0, y: 0 }

    const move = (ev) => {
      setDragging(icon.id)
      setPos((p) => ({
        ...p,
        [icon.id]: {
          x: Math.max(0, Math.min(window.innerWidth - 120, o.x + (ev.clientX - startX))),
          y: Math.max(0, Math.min(window.innerHeight - 120, o.y + (ev.clientY - startY))),
        },
      }))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setDragging(null)
      const cur = pos[icon.id]
      if (!cur) return
      setTimeout(() => {
        setPos((p) => {
          const c = p[icon.id]
          if (!c) return p
          return {
            ...p,
            [icon.id]: {
              x: Math.round(c.x / GRID) * GRID,
              y: Math.round(c.y / GRID) * GRID,
            },
          }
        })
      }, 0)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const onDeskMouseDown = (e) => {
    if (e.target !== e.currentTarget) return
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
      selRef.current = new Set()
      actions.selectIcons([])
    }
    const rect = deskRef.current.getBoundingClientRect()
    setMarquee({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: 0, h: 0, startX: e.clientX, startY: e.clientY })
    const move = (ev) => {
      setMarquee((m) => ({
        ...m,
        w: ev.clientX - m.startX,
        h: ev.clientY - m.startY,
      }))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setMarquee(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const onRightClick = (e) => {
    e.preventDefault()
    if (e.target !== e.currentTarget) return
    actions.setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          label: 'New Folder',
          onClick: () => {
            const name = 'Untitled Folder ' + (s.desktopFolders.length + 1)
            actions.addDesktopFolder(name)
            setIcons((ic) => [...ic, { id: 'f-' + name, name, kind: 'folder', target: 'finder' }])
          },
        },
        { type: 'sep' },
        { label: 'Get Info', disabled: true },
        {
          label: 'Change Wallpaper',
          submenu: s.wallpapers.map((w) => ({
            label: w.name,
            check: w.id === s.wallpaperId,
            onClick: () => actions.setWallpaper(w.id),
          })),
        },
        { label: 'Sort By', submenu: ['Name', 'Kind', 'Date Added'].map((n) => ({ label: n, onClick: () => sound.click() })) },
        { type: 'sep' },
        { label: 'Show View Options', onClick: () => actions.notify({ appId: 'finder', title: 'View Options', body: 'Icon size is tuned for your screen.' }) },
      ],
    })
  }

  return (
    <div
      className="desktop"
      ref={deskRef}
      style={{ backgroundImage: wallpaper.css }}
      onMouseDown={onDeskMouseDown}
      onContextMenu={onRightClick}
      onPointerDown={(e) => {
        if (e.target !== e.currentTarget) return
        actions.closeAllPanels()
        actions.setContextMenu(null)
      }}
    >
      <div className="desktop__icons">
        {icons.map((icon, i) => {
          const p = pos[icon.id] || deskPos(i)
          const sel = s.selectedIcons.includes(icon.id)
          return (
            <div
              key={icon.id}
              className={`desk-icon ${sel ? 'selected' : ''} ${dragging === icon.id ? 'drag' : ''}`}
              style={{ transform: `translate(${p.x}px, ${p.y}px)`, position: 'absolute', top: 0, left: 0, '--i': i }}
              onPointerDown={(e) => onIconMouseDown(e, icon)}
              onDoubleClick={() => open(icon)}
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation() }}
            >
              <KindIcon kind={icon.kind} />
              <span className="desk-icon__label">{icon.name}</span>
            </div>
          )
        })}
      </div>

      {marquee && (
        <div
          className="marquee"
          style={{
            left: marquee.w < 0 ? marquee.x + marquee.w : marquee.x,
            top: marquee.h < 0 ? marquee.y + marquee.h : marquee.y,
            width: Math.abs(marquee.w),
            height: Math.abs(marquee.h),
          }}
        />
      )}
    </div>
  )
}