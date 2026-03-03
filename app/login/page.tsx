'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '48px 40px',
        background: '#111',
        border: '1px solid #222',
        borderRadius: 4,
      }}>
        {/* Logo / Title */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            margin: 0,
          }}>ZaidGPT</h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 8 }}>Sign in to continue</p>
        </div>

        {/* Form */}
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
                width: '100%',
                padding: '10px 14px',
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: 4,
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
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
                width: '100%',
                padding: '10px 14px',
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: 4,
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{
              color: '#ff4444',
              fontSize: 13,
              margin: 0,
              padding: '8px 12px',
              background: 'rgba(255,68,68,0.08)',
              borderRadius: 4,
              border: '1px solid rgba(255,68,68,0.2)',
            }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '12px',
              background: loading ? '#222' : '#fff',
              color: loading ? '#555' : '#000',
              border: 'none',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              letterSpacing: '0.02em',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p style={{ color: '#333', fontSize: 11, textAlign: 'center', marginTop: 32, marginBottom: 0 }}>
          Don't have an account? Contact your administrator.
        </p>
      </div>
    </div>
  )
}
