import { useEffect, useRef, useState } from 'react'
import { useSystem } from '../system/store.js'
import { Icons } from '../icons/AppIcons.jsx'

const SIGNIFICANT = 12
const MAX_DIGITS = 12

const MODES = [
  { id: 'basic', label: 'Basic' },
  { id: 'scientific', label: 'Scientific' },
  { id: 'programmer', label: 'Programmer' },
  { id: 'convert', label: 'Convert' },
]

function Key({ label, cls = '', onClick, active }) {
  return (
    <button
      type="button"
      className={`calc__key ${cls} ${active ? 'active-op' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function compute(a, b, operator) {
  switch (operator) {
    case '÷':
      return a / b
    case '×':
      return a * b
    case '−':
      return a - b
    case '+':
      return a + b
    default:
      return b
  }
}

/* Trim binary floating-point noise and keep the display readable. */
function format(n) {
  if (!Number.isFinite(n)) return 'Error'
  const rounded = Number(n.toPrecision(SIGNIFICANT))
  if (rounded !== 0 && (Math.abs(rounded) >= 1e12 || Math.abs(rounded) < 1e-9)) {
    return rounded.toExponential(5)
  }
  return String(rounded)
}

/* Group thousands like macOS: 1234567 -> 1,234,567 (keeps decimals/exponent). */
function group(n) {
  if (n === 'Error') return n
  const [int, dec] = n.split('.')
  if (!/^-?\d+$/.test(int)) return n
  const sign = int.startsWith('-') ? '-' : ''
  const digits = sign ? int.slice(1) : int
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec != null ? '.' + dec : '')
}

export default function Calculator({ win }) {
  const s = useSystem()
  const focused = !!win && s.activeWindowId === win.id

  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [repeat, setRepeat] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  /* close the mode menu when clicking elsewhere */
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (e.target.closest('.calc__mode, .calc__menu')) return
      setMenuOpen(false)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [menuOpen])

  const inputDigit = (d) => {
    if (display === 'Error') {
      setDisplay(d)
      setWaiting(false)
      return
    }
    if (waiting) {
      setDisplay(d)
      setWaiting(false)
      return
    }
    setDisplay((cur) => {
      if (cur === '0') return d
      if (cur.replace(/[^0-9]/g, '').length >= MAX_DIGITS) return cur
      return cur + d
    })
  }

  const inputDot = () => {
    if (display === 'Error' || waiting) {
      setDisplay('0.')
      setWaiting(false)
      return
    }
    if (!display.includes('.')) setDisplay(display + '.')
  }

  const chooseOp = (nextOp) => {
    if (display === 'Error') return
    const current = parseFloat(display)
    if (prev == null) {
      setPrev(current)
    } else if (op && !waiting) {
      const result = compute(prev, current, op)
      setPrev(result)
      setDisplay(format(result))
    }
    setOp(nextOp)
    setWaiting(true)
    setRepeat(null)
  }

  const apply = (a, b, operator) => {
    const result = compute(a, b, operator)
    setDisplay(format(result))
    setPrev(null)
    setOp(null)
    setWaiting(true)
  }

  const equals = () => {
    if (display === 'Error') return
    if (op != null && prev != null) {
      const b = parseFloat(display)
      apply(prev, b, op)
      setRepeat({ op, operand: b })
    } else if (repeat) {
      apply(parseFloat(display), repeat.operand, repeat.op)
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setWaiting(false)
    setRepeat(null)
  }
  const clear = () => {
    if (prev == null && op == null) clearAll()
    else {
      setDisplay('0')
      setWaiting(false)
    }
  }

  const backspace = () => {
    if (display === 'Error' || waiting) {
      setDisplay('0')
      setWaiting(false)
      return
    }
    setDisplay((cur) => (cur.length <= 1 ? '0' : cur.slice(0, -1)))
  }

  const negate = () => {
    if (display === 'Error') return
    setDisplay((d) => (d === '0' ? d : format(parseFloat(d) * -1)))
  }

  const percent = () => {
    if (display === 'Error') return
    const current = parseFloat(display)
    if (op && prev != null && (op === '+' || op === '−')) {
      setDisplay(format((prev * current) / 100))
    } else {
      setDisplay(format(current / 100))
    }
    setWaiting(false)
  }

  const opActive = (label) => op === label && waiting

  /* Keyboard input — only while this window is the focused one. */
  const api = useRef({})
  useEffect(() => {
    api.current = { inputDigit, inputDot, chooseOp, equals, clear, negate, percent, backspace }
  })
  useEffect(() => {
    if (!focused) return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      const a = api.current
      if (/^[0-9]$/.test(k)) a.inputDigit(k)
      else if (k === '.') a.inputDot()
      else if (k === '+') a.chooseOp('+')
      else if (k === '-') a.chooseOp('−')
      else if (k === '*' || k === 'x' || k === 'X') a.chooseOp('×')
      else if (k === '/') a.chooseOp('÷')
      else if (k === 'Enter' || k === '=') a.equals()
      else if (k === '%') a.percent()
      else if (k === 'Backspace') a.backspace()
      else if (k === 'Escape' || k === 'c' || k === 'C') a.clear()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused])

  const shown = group(display)
  const fs = shown.length > 12 ? 22 : shown.length > 9 ? 30 : 44

  return (
    <div className="calc">
      <div className="calc__inner">
        <div className="calc__display" style={{ fontSize: fs }}>{shown}</div>
        <div className="calc__keys">
          <Key label={prev == null && op == null ? 'AC' : 'C'} cls="fn" onClick={clear} />
          <Key label="+/−" cls="fn" onClick={negate} />
          <Key label="%" cls="fn" onClick={percent} />
          <Key label="÷" cls="op" active={opActive('÷')} onClick={() => chooseOp('÷')} />

          <Key label="7" onClick={() => inputDigit('7')} />
          <Key label="8" onClick={() => inputDigit('8')} />
          <Key label="9" onClick={() => inputDigit('9')} />
          <Key label="×" cls="op" active={opActive('×')} onClick={() => chooseOp('×')} />

          <Key label="4" onClick={() => inputDigit('4')} />
          <Key label="5" onClick={() => inputDigit('5')} />
          <Key label="6" onClick={() => inputDigit('6')} />
          <Key label="−" cls="op" active={opActive('−')} onClick={() => chooseOp('−')} />

          <Key label="1" onClick={() => inputDigit('1')} />
          <Key label="2" onClick={() => inputDigit('2')} />
          <Key label="3" onClick={() => inputDigit('3')} />
          <Key label="+" cls="op" active={opActive('+')} onClick={() => chooseOp('+')} />

          <button
            type="button"
            className="calc__key calc__mode"
            title="Calculator mode"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icons.calculator />
          </button>
          <Key label="0" onClick={() => inputDigit('0')} />
          <Key label="." onClick={inputDot} />
          <Key label="=" cls="op" onClick={equals} />
        </div>

        {menuOpen && (
          <div className="calc__menu">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`calc__menuitem ${m.id === 'basic' ? 'active' : ''}`}
                disabled={m.id !== 'basic'}
                onClick={() => setMenuOpen(false)}
              >
                <span className="check">{m.id === 'basic' ? '✓' : ''}</span>
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
