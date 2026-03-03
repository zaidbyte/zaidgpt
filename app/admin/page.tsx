'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type User = { id: string; user_id: string; created_at: string }
type Announcement = { id: string; message: string; active: boolean; created_at: string }

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'users' | 'announcements'>('users')

  // Users state
  const [users, setUsers] = useState<User[]>([])
  const [newUserId, setNewUserId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [userError, setUserError] = useState('')
  const [userSuccess, setUserSuccess] = useState('')
  const [userLoading, setUserLoading] = useState(false)

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [annError, setAnnError] = useState('')
  const [annLoading, setAnnLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
  }, [])

  const fetchAnnouncements = useCallback(async () => {
    const res = await fetch('/api/admin/announcements')
    if (res.ok) setAnnouncements(await res.json())
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchAnnouncements()
  }, [fetchUsers, fetchAnnouncements])

  async function createUser() {
    if (!newUserId.trim() || !newPassword.trim()) {
      setUserError('Both fields are required.')
      return
    }
    setUserLoading(true)
    setUserError('')
    setUserSuccess('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: newUserId.trim(), password: newPassword }),
    })
    const data = await res.json()
    if (!res.ok) {
      setUserError(data.error)
    } else {
      setUserSuccess(`User "${newUserId.trim()}" created successfully.`)
      setNewUserId('')
      setNewPassword('')
      fetchUsers()
    }
    setUserLoading(false)
  }

  async function deleteUser(id: string, userId: string) {
    if (!confirm(`Delete user "${userId}"? This cannot be undone.`)) return
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) fetchUsers()
  }

  async function createAnnouncement() {
    if (!newMessage.trim()) { setAnnError('Message cannot be empty.'); return }
    setAnnLoading(true)
    setAnnError('')
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage.trim() }),
    })
    const data = await res.json()
    if (!res.ok) { setAnnError(data.error) } else { setNewMessage(''); fetchAnnouncements() }
    setAnnLoading(false)
  }

  async function toggleAnnouncement(id: string, active: boolean) {
    await fetch('/api/admin/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    })
    fetchAnnouncements()
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm('Delete this announcement?')) return
    await fetch('/api/admin/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchAnnouncements()
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const s = styles

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.logo}>
            <span style={s.logoBadge}>ADMIN</span>
            <span style={s.logoTitle}>ZaidGPT</span>
          </div>
          <nav style={s.nav}>
            <button
              onClick={() => setTab('users')}
              style={{ ...s.navBtn, ...(tab === 'users' ? s.navBtnActive : {}) }}
            >
              <span style={s.navIcon}>👥</span> Users
            </button>
            <button
              onClick={() => setTab('announcements')}
              style={{ ...s.navBtn, ...(tab === 'announcements' ? s.navBtnActive : {}) }}
            >
              <span style={s.navIcon}>📢</span> Announcements
            </button>
          </nav>
        </div>
        <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {tab === 'users' && (
          <div>
            <h2 style={s.heading}>Users</h2>
            <p style={s.subheading}>Create and manage user accounts.</p>

            {/* Create user form */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>Create New User</h3>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>User ID</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="e.g. john_doe"
                    value={newUserId}
                    onChange={e => setNewUserId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createUser()}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Password</label>
                  <input
                    style={s.input}
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createUser()}
                  />
                </div>
                <button
                  style={{ ...s.btn, ...s.btnPrimary, alignSelf: 'flex-end' }}
                  onClick={createUser}
                  disabled={userLoading}
                >
                  {userLoading ? 'Creating...' : '+ Create User'}
                </button>
              </div>
              {userError && <p style={s.errorMsg}>{userError}</p>}
              {userSuccess && <p style={s.successMsg}>{userSuccess}</p>}
            </div>

            {/* Users list */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>All Users ({users.length})</h3>
              {users.length === 0 ? (
                <p style={s.emptyMsg}>No users yet. Create one above.</p>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>User ID</th>
                      <th style={s.th}>Created</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={s.tr}>
                        <td style={s.td}><span style={s.userIdChip}>{u.user_id}</span></td>
                        <td style={s.td}>{new Date(u.created_at).toLocaleDateString()}</td>
                        <td style={{ ...s.td, textAlign: 'right' }}>
                          <button
                            style={{ ...s.btn, ...s.btnDanger }}
                            onClick={() => deleteUser(u.id, u.user_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'announcements' && (
          <div>
            <h2 style={s.heading}>Announcements</h2>
            <p style={s.subheading}>Post messages that appear across the site.</p>

            <div style={s.card}>
              <h3 style={s.cardTitle}>New Announcement</h3>
              <textarea
                style={s.textarea}
                placeholder="Write your announcement here..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                rows={3}
              />
              {annError && <p style={s.errorMsg}>{annError}</p>}
              <button
                style={{ ...s.btn, ...s.btnPrimary, marginTop: 12 }}
                onClick={createAnnouncement}
                disabled={annLoading}
              >
                {annLoading ? 'Posting...' : '📢 Post Announcement'}
              </button>
            </div>

            <div style={s.card}>
              <h3 style={s.cardTitle}>All Announcements ({announcements.length})</h3>
              {announcements.length === 0 ? (
                <p style={s.emptyMsg}>No announcements yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {announcements.map(a => (
                    <div key={a.id} style={{ ...s.annItem, opacity: a.active ? 1 : 0.5 }}>
                      <div style={{ flex: 1 }}>
                        <p style={s.annMessage}>{a.message}</p>
                        <p style={s.annMeta}>{new Date(a.created_at).toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ ...s.statusBadge, ...(a.active ? s.statusActive : s.statusInactive) }}>
                          {a.active ? 'Live' : 'Hidden'}
                        </span>
                        <button
                          style={{ ...s.btn, ...s.btnSecondary }}
                          onClick={() => toggleAnnouncement(a.id, a.active)}
                        >
                          {a.active ? 'Hide' : 'Show'}
                        </button>
                        <button
                          style={{ ...s.btn, ...s.btnDanger }}
                          onClick={() => deleteAnnouncement(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', background: '#07070a', color: '#e5e5e5', fontFamily: "'system-ui', sans-serif" },
  sidebar: { width: 220, background: '#0d0d10', borderRight: '1px solid #1a1a2e', padding: '32px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 },
  logo: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 40 },
  logoBadge: { fontSize: 9, letterSpacing: '0.15em', color: '#6366f1', fontWeight: 700 },
  logoTitle: { fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'transparent', border: 'none', borderRadius: 6, color: '#555', fontSize: 14, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.1s' },
  navBtnActive: { background: 'rgba(99,102,241,0.12)', color: '#a5b4fc' },
  navIcon: { fontSize: 16 },
  logoutBtn: { background: 'transparent', border: '1px solid #1a1a2e', borderRadius: 6, color: '#555', fontSize: 13, padding: '8px 14px', cursor: 'pointer', textAlign: 'left' },
  main: { flex: 1, padding: '48px 48px', overflowY: 'auto', maxWidth: 900 },
  heading: { fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' },
  subheading: { color: '#555', fontSize: 14, marginTop: 6, marginBottom: 32 },
  card: { background: '#0d0d10', border: '1px solid #1a1a2e', borderRadius: 8, padding: 24, marginBottom: 20 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 20px 0' },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 180px' },
  label: { fontSize: 11, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' },
  input: { padding: '10px 14px', background: '#07070a', border: '1px solid #1a1a2e', borderRadius: 6, color: '#fff', fontSize: 14, outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', background: '#07070a', border: '1px solid #1a1a2e', borderRadius: 6, color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' },
  btn: { padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.1s', whiteSpace: 'nowrap' },
  btnPrimary: { background: '#6366f1', color: '#fff' },
  btnSecondary: { background: '#1a1a2e', color: '#888' },
  btnDanger: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  errorMsg: { color: '#f87171', fontSize: 13, margin: '12px 0 0 0' },
  successMsg: { color: '#4ade80', fontSize: 13, margin: '12px 0 0 0' },
  emptyMsg: { color: '#333', fontSize: 14, margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: 11, color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px 12px 0', borderBottom: '1px solid #1a1a2e' },
  tr: { borderBottom: '1px solid #111' },
  td: { padding: '14px 12px 14px 0', fontSize: 14, color: '#ccc' },
  userIdChip: { background: '#1a1a2e', padding: '3px 10px', borderRadius: 4, fontSize: 13, color: '#a5b4fc', fontFamily: 'monospace' },
  annItem: { display: 'flex', alignItems: 'flex-start', gap: 16, padding: 16, background: '#0a0a0d', borderRadius: 8, border: '1px solid #1a1a2e' },
  annMessage: { color: '#ddd', fontSize: 14, margin: '0 0 6px 0', lineHeight: 1.5 },
  annMeta: { color: '#333', fontSize: 12, margin: 0 },
  statusBadge: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.05em' },
  statusActive: { background: 'rgba(74,222,128,0.1)', color: '#4ade80' },
  statusInactive: { background: '#1a1a1a', color: '#444' },
}
