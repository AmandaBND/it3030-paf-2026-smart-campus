import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  const facilities = [
    { label: 'Lecture halls', tone: 'ok' },
    { label: 'Labs', tone: 'ok' },
    { label: 'Meeting rooms', tone: 'ok' },
    { label: 'Projectors', tone: 'accent' },
    { label: 'Cameras', tone: 'accent' },
    { label: 'White boards', tone: 'accent' },
    { label: 'General equipment', tone: 'accent' },
  ]

  return (
    <>
      
    <div className="page home-page">
      

      <section className="home-hero">
        <div className="hero-copy">
          
          <h1>
            FIND ALL FACILITIES <span>HERE</span>
          </h1>
          <p>
            Reserve rooms and equipment with conflict-aware scheduling. Select a time
            window, submit your request, and use the QR verification at access points.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link className="btn btn-primary" to="/facilities">
                Browse facilities
              </Link>
            ) : (
              <Link className="btn btn-primary" to="/login">
                Sign in to browse
              </Link>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit">
            <div className="orbit-ring" />

            <div className="hero-pin hero-pin--building">
              <div className="hero-icon">🏢</div>
              <div className="hero-label">Building</div>
            </div>

            <div className="hero-pin hero-pin--projector">
              <div className="hero-icon">🎥</div>
              <div className="hero-label">Projector</div>
            </div>

            <div className="hero-pin hero-pin--technician">
              <div className="hero-icon">🧑‍🔧</div>
              <div className="hero-label">Technician</div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
    <section className="home-features card2">
        <p className="muted home-feature-copy">
          What You Can Manage Here ?
        </p>

        <div className="home-feature-badges">
          {facilities.map((f) => (
            <span
              key={f.label}
              className={f.tone === 'ok' ? 'badge1 badge-ok' : 'badge1 badge-pending'}
            >
              {f.label}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
