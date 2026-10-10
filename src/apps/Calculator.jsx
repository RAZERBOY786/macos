import { useState } from 'react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [waiting, setWaiting] = useState(false)

  const inputDigit = (d) => {
    if (waiting) {
      setDisplay(d)
      setWaiting(false)
    } else {
      setDisplay(display === '0' ? d : display + d)
    }
  }
  const inputDot = () => {
    if (waiting) {
      setDisplay('0.')
      setWaiting(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const compute = (a, b, operator) => {
    switch (operator) {
      case '÷': return b === 0 ? 'Error' : a / b
      case '×': return a * b
      case '−': return a - b
      case '+': return a + b
      default: return b
    }
  }

  const chooseOp = (nextOp) => {
    const current = parseFloat(display)
    if (prev == null) {
      setPrev(current)
    } else if (op && !waiting) {
      const result = compute(prev, current, op)
      setPrev(result)
      setDisplay(String(result))
    }
    setOp(nextOp)
    setWaiting(true)
  }

  const equals = () => {
    if (op == null || prev == null) return
    const result = compute(prev, parseFloat(display), op)
    setDisplay(String(result))
    setPrev(null)
    setOp(null)
    setWaiting(true)
  }

  const clear = () => {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setWaiting(false)
  }

  const negate = () => setDisplay((d) => (d === '0' ? d : String(parseFloat(d) * -1)))
  const percent = () => setDisplay((d) => String(parseFloat(d) / 100))

  const Key = ({ label, cls = '', onClick, wide }) => (
    <button className={`calc__key ${cls} ${wide ? 'wide' : ''} ${op === label && waiting ? 'active-op' : ''}`} onClick={onClick}>
      {label}
    </button>
  )

  return (
    <div className="calc">
      <div className="calc__display">{display}</div>
      <div className="calc__keys">
        <Key label={prev == null && op == null ? 'AC' : 'C'} cls="fn" onClick={clear} />
        <Key label="+/−" cls="fn" onClick={negate} />
        <Key label="%" cls="fn" onClick={percent} />
        <Key label="÷" cls="op" onClick={() => chooseOp('÷')} />

        <Key label="7" onClick={() => inputDigit('7')} />
        <Key label="8" onClick={() => inputDigit('8')} />
        <Key label="9" onClick={() => inputDigit('9')} />
        <Key label="×" cls="op" onClick={() => chooseOp('×')} />

        <Key label="4" onClick={() => inputDigit('4')} />
        <Key label="5" onClick={() => inputDigit('5')} />
        <Key label="6" onClick={() => inputDigit('6')} />
        <Key label="−" cls="op" onClick={() => chooseOp('−')} />

        <Key label="1" onClick={() => inputDigit('1')} />
        <Key label="2" onClick={() => inputDigit('2')} />
        <Key label="3" onClick={() => inputDigit('3')} />
        <Key label="+" cls="op" onClick={() => chooseOp('+')} />

        <Key label="0" wide onClick={() => inputDigit('0')} />
        <Key label="." onClick={inputDot} />
        <Key label="=" cls="op" onClick={equals} />
      </div>
    </div>
  )
}
