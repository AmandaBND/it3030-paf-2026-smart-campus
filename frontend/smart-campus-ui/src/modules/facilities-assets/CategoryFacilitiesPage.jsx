import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiFetch, parseJson } from '../../api/client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || ''

const CATEGORY_META = {
  LECTURE_HALL: { label: 'Lecture halls', emoji: '🏫' },
  LAB: { label: 'Labs', emoji: '🧪' },
  MEETING_ROOM: { label: 'Meeting rooms', emoji: '🤝' },
  PROJECTOR: { label: 'Projectors', emoji: '🎥' },
  CAMERA: { label: 'Cameras', emoji: '📷' },
  WHITE_BOARD: { label: 'White boards', emoji: '📝' },
  EQUIPMENT: { label: 'General equipment', emoji: '🛠️' },
}

function getImageUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path}`
}

export default function CategoryFacilitiesPage() {
  const { categoryType } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const normalizedType = String(categoryType || '').toUpperCase()
  const category = CATEGORY_META[normalizedType]

  useEffect(() => {
    const load = async () => {
      if (!category) {
        setError('Unknown facility category.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError('')
      const res = await apiFetch(`/api/resources/categories/${encodeURIComponent(normalizedType)}/active`)
      const data = await parseJson(res)
      if (!res.ok) {
        setError(data?.error || 'Failed to load facilities for this category.')
        setLoading(false)
        return
      }
      setItems(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    load()
  }, [normalizedType, category])

  const heading = useMemo(() => {
    if (!category) return 'Facilities'
    return `${category.emoji} ${category.label}`
  }, [category])

  return (
    <div className="page">
      <div className="category-facilities-header">
        <div>
          <h1>{heading}</h1>
          <p className="muted">Active resources in this category. Select an image card to open its calendar.</p>
        </div>
        <Link className="btn btn-ghost" to="/">
          Back to home
        </Link>
      </div>

      {loading && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p>Loading facilities...</p>
        </div>
      )}

      {!loading && error && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p className="error">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p className="muted">No active facilities found for this category.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="category-facilities-grid" style={{ marginTop: '1rem' }}>
          {items.map((resource) => (
            <article
              key={resource.id}
              className="category-facility-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/facilities/${resource.id}/calendar`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/facilities/${resource.id}/calendar`)
                }
              }}
            >
              <div className="category-facility-image-wrap">
                {resource.imageUrl ? (
                  <img src={getImageUrl(resource.imageUrl)} alt={resource.name} className="category-facility-image" />
                ) : (
                  <div className="category-facility-placeholder">No image</div>
                )}
              </div>
              <div className="category-facility-body">
                <h3>{resource.name}</h3>
                <p>Capacity: {resource.capacity ?? 'N/A'}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
