'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function handleLogin() {
    if (!userId.trim() || !password.trim()) {
      setError('Please enter your User ID and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', serif",
    }}>

      {/* Privacy Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 24,
        }}>
          <div style={{
            background: '#111', border: '1px solid #222',
            borderRadius: 8, padding: 32, maxWidth: 480, width: '100%',
          }}>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>
              🔒 Your Privacy & Data
            </h2>
            <p style={{ color: '#555', fontSize: 13, margin: '0 0 24px 0' }}>
              Here is exactly what Z-GPT stores and how it is protected.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                {
                  icon: '🪪',
                  title: 'User ID',
                  desc: 'Your username is stored in plain text so you can log in. It is never shared with anyone.',
                },
                {
                  icon: '🔑',
                  title: 'Password',
                  desc: 'Your password is never stored directly. It is hashed using bcrypt (one-way encryption) — nobody, not even the admin, can read it.',
                },
                {
                  icon: '🎟️',
                  title: 'Session Token',
                  desc: 'When you log in, a random session token is stored in a secure httpOnly cookie to keep you logged in for 7 days.',
                },
                {
                  icon: '💬',
                  title: 'Chat Messages',
                  desc: 'Your conversations are NOT stored. Messages only exist in your browser during the session and are never saved to any database.',
                },
              ].map(item => (
                <div key={item.title} style={{
                  padding: '14px 16px', background: '#0a0a0a',
                  border: '1px solid #222', borderRadius: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{item.title}</span>
                  </div>
                  <p style={{ color: '#666', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: 24, width: '100%', padding: '10px',
                background: '#222', border: '1px solid #333',
                borderRadius: 6, color: '#888', fontSize: 14,
                cursor: 'pointer', fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div style={{
        width: '100%', maxWidth: 400,
        padding: '48px 40px',
        background: '#111',
        border: '1px solid #222',
        borderRadius: 4,
      }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>
            Z-GPT
          </h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 8 }}>Sign in to continue</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#888', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="your-user-id"
              style={{
                width: '100%', padding: '10px 14px',
                background: '#0a0a0a', border: '1px solid #2a2a2a',
                borderRadius: 4, color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#888', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px',
                background: '#0a0a0a', border: '1px solid #2a2a2a',
                borderRadius: 4, color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{
              color: '#ff4444', fontSize: 13, margin: 0,
              padding: '8px 12px',
              background: 'rgba(255,68,68,0.08)',
              borderRadius: 4, border: '1px solid rgba(255,68,68,0.2)',
            }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              marginTop: 8, padding: '12px',
              background: loading ? '#222' : '#fff',
              color: loading ? '#555' : '#000',
              border: 'none', borderRadius: 4,
              fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px',
              background: 'transparent',
              border: '1px solid #222',
              borderRadius: 4, color: '#555',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            🔒 What data do we collect?
          </button>
        </div>

        <p style={{ color: '#333', fontSize: 11, textAlign: 'center', marginTop: 32, marginBottom: 0 }}>
          Don't have an account? Contact your administrator.
        </p>
      </div>
    </div>
  )
}
