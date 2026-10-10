import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/desktop.css'
import './styles/window.css'
import './styles/apps.css'
import './styles/tahoe.css'
import './styles/responsive.css'
import App from './App.jsx'

class CrashBoundary extends Component {
  state = { crashed: false }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  render() {
    if (!this.state.crashed) return this.props.children
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#000',
          color: '#f5f5f7',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: '#ff453a',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>The system crashed</h1>
          <p style={{ fontSize: 14, color: '#a1a1a6', margin: '0 0 20px' }}>
            Something went wrong while running this app. Your files are safe.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#0a84ff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Restart
          </button>
        </div>
      </div>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <CrashBoundary>
    <App />
  </CrashBoundary>,
)