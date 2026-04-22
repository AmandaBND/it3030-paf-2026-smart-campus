import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, parseJson } from '../../api/client'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingUserId, setEditingUserId] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/users')
      if (res.ok) {
        const data = await parseJson(res)
        setUsers(Array.isArray(data) ? data : [])
      } else {
        setError('Failed to load users')
      }
    } catch (err) {
      setError('Error loading users: ' + (err?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const startEdit = (user) => {
    setEditingUserId(user.id)
    setSelectedRole(user.role || 'USER')
    setUpdateError('')
  }

  const cancelEdit = () => {
    setEditingUserId(null)
    setSelectedRole('')
    setUpdateError('')
  }

  const saveRole = async (userId) => {
    setUpdateError('')
    setUpdatingId(userId)
    try {
      const res = await apiFetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: selectedRole }),
      })
      if (res.ok) {
        await load()
        setEditingUserId(null)
        setSelectedRole('')
      } else {
        const data = await parseJson(res)
        setUpdateError(data?.error || 'Failed to update role')
      }
    } catch (err) {
      setUpdateError('Error updating role: ' + (err?.message || 'Unknown error'))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Admin · User Management</h1>
          <p className="muted">View and manage user roles across the campus system.</p>
        </div>
        <Link className="btn btn-ghost" to="/">
          Back to home
        </Link>
      </div>

      {error && <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee', borderRadius: '8px', color: '#C74545' }}>{error}</div>}

      {loading ? (
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>Loading users...</div>
      ) : (
        <div className="table-wrap" style={{ marginTop: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-light)' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.fullName || user.name || '—'}</td>
                    <td>{user.email}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <select
                          className="select"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          style={{ minWidth: '120px', padding: '0.35rem 0.5rem', fontSize: '0.9rem' }}
                        >
                          <option value="USER">USER</option>
                          <option value="TECHNICIAN">TECHNICIAN</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className="badge badge-ok">{user.role}</span>
                      )}
                    </td>
                    <td>
                      <span className={user.status === 'ACTIVE' ? 'badge badge-ok' : 'badge badge-bad'}>
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {editingUserId === user.id ? (
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => saveRole(user.id)}
                            disabled={updatingId === user.id}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={cancelEdit}
                            disabled={updatingId === user.id}
                            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="btn btn-ghost" onClick={() => startEdit(user)}>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {updateError && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee', borderRadius: '8px', color: '#C74545' }}>
          {updateError}
        </div>
      )}
    </div>
  )
}
