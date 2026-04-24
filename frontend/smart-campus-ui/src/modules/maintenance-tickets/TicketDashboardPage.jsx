import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, parseJson } from '../../api/client'

function badge(status) {
  if (status === 'OPEN') return 'badge badge-pending'
  if (status === 'IN_PROGRESS') return 'badge badge-ok'
  if (status === 'RESOLVED' || status === 'CLOSED') return 'badge badge-ok'
  if (status === 'REJECTED') return 'badge badge-bad'
  return 'badge badge-ok'
}

export default function TicketDashboardPage() {
  const [items, setItems] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch('/api/tickets')
      if (res.ok) setItems(await parseJson(res))
    }
    load()
  }, [])

  const filteredItems = items.filter((t) => {
    const searchLower = searchText.toLowerCase()
    if (searchLower && !t.resourceName.toLowerCase().includes(searchLower) && !t.category.toLowerCase().includes(searchLower)) {
      return false
    }
    if (filterStatus !== 'ALL' && t.status !== filterStatus) {
      return false
    }
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) {
      return false
    }
    return true
  })

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Maintenance & tickets</h1>
          <p className="muted">Technicians see assigned work; users see tickets they opened.</p>
        </div>
        <Link className="btn btn-primary" to="/tickets/new">
          New ticket
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <input
          className="input"
          type="text"
          placeholder="Search by resource or category..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: '1 1 200px' }}
        />
        <select
          className="select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ flex: '1 1 150px' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <select
          className="select"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ flex: '1 1 150px' }}
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>
      <p className="muted" style={{ marginTop: '0.5rem' }}>
        Showing {filteredItems.length} of {items.length} tickets
      </p>

      <div className="table-wrap" style={{ marginTop: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Resource</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p className="muted">No tickets match your filters</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.resourceName}</td>
                  <td>{t.category}</td>
                  <td>{t.priority}</td>
                  <td>
                    <span className={badge(t.status)}>{t.status}</span>
                  </td>
                  <td>{t.assignedToName || '—'}</td>
                  <td>
                    <Link className="btn btn-ghost" to={`/tickets/${t.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
