import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  const facilities = [
    { label: 'Lecture halls', tone: 'ok', type: 'LECTURE_HALL' },
    { label: 'Labs', tone: 'ok', type: 'LAB' },
    { label: 'Meeting rooms', tone: 'ok', type: 'MEETING_ROOM' },
    { label: 'Projectors', tone: 'accent', type: 'PROJECTOR' },
    { label: 'Cameras', tone: 'accent', type: 'CAMERA' },
    { label: 'White boards', tone: 'accent', type: 'WHITE_BOARD' },
    { label: 'General equipment', tone: 'accent', type: 'EQUIPMENT' },
  ]

  return (
    <>
    <section className="hero-gallery">
      
        <div className="hero-gallery-slide slide-1" />
        <div className="hero-gallery-slide slide-2" />
        <div className="hero-gallery-slide slide-3" />
        <div className="hero-gallery-overlay" />
        <span className="hero-eyebrow">Easy Bookings</span>
      </section>
      
    
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
            <Link
              key={f.label}
              to={`/facilities/categories/${f.type}`}
              className={f.tone === 'ok' ? 'badge1 badge-ok' : 'badge1 badge-pending'}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="home-middle-image page" aria-label="Campus services preview">
        <img src="/images/middle_image.jpg" alt="Smart campus services" className="home-middle-image-content" />
      </section>
      <section className="home-services page">
        <p className="home-services-description">
          A unified digital platform designed to streamline campus operations by integrating facility bookings, asset management, and maintenance workflows into one seamless system.
        </p>
        <p className="home-services-description">
          Our solution empowers students, staff, and administrators with real-time access, transparent processes, and efficient resource utilization - ensuring a smarter, more connected campus experience.
        </p>
        <p className="home-services-description">
          From reserving study spaces to reporting issues and tracking resolutions, everything is managed in one place with clarity, control, and accountability.
        </p>

        <div className="home-services-grid">
          <article className="card home-service-card">
            <h3>QR Verification</h3>
            <p>Secure check-ins and validations at access points using instant QR code verification.</p>
          </article>
          <article className="card home-service-card">
            <h3>Easy Time Selection by Calendar</h3>
            <p>Book facilities quickly with a calendar-based interface that helps avoid schedule conflicts.</p>
          </article>
          <article className="card home-service-card">
            <h3>Notifications</h3>
            <p>Stay updated with real-time alerts for bookings, approvals, assignments, and ticket updates.</p>
          </article>
        </div>
      </section>
    </>
  )
}
