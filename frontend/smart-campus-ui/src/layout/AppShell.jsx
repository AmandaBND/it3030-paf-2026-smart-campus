import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import NotificationPanel from '../modules/auth-notifications/NotificationPanel'

const navLinkStyle = ({ isActive }) => ({
  padding: '0.75rem 0.95rem',
  borderRadius: 999,
  fontWeight: 600,
  fontSize: '0.92rem',
  color: isActive ? 'var(--color-tertiary)' : 'var(--color-text-light)',
  background: isActive ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
  border: isActive ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
})

export default function AppShell() {
  const { user, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="app-logo">
            Smart Campus <span>Hub</span>
          </Link>

          <nav className="top-nav">
            <NavLink to="/facilities" style={navLinkStyle}>
              Facilities
            </NavLink>
            <NavLink to="/bookings/my" style={navLinkStyle}>
              Bookings
            </NavLink>
            <NavLink to="/tickets" style={navLinkStyle}>
              Tickets
            </NavLink>
            {user?.role === 'ADMIN' && (
              <>
                <NavLink to="/admin/resources" style={navLinkStyle}>
                  Admin - Resources
                </NavLink>
                <NavLink to="/admin/bookings" style={navLinkStyle}>
                  Admin - Approvals
                </NavLink>
                <NavLink to="/admin/users" style={navLinkStyle}>
                  Admin - Users
                </NavLink>
              </>
            )}
          </nav>

          <div className="top-actions" ref={userMenuRef}>
            {user && <NotificationPanel />}
            {user ? (
              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className="user-menu-button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setUserMenuOpen((open) => !open)
                  }}
                >
                  <span>{user.fullName}</span>
                  <span className="user-menu-arrow">▾</span>
                </button>
                {userMenuOpen && (
                  <div className="user-menu-dropdown" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      className="user-menu-dropdown-item"
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="btn btn-primary" to="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="page footer-content">
          <div className="footer-cards">
            <article className="footer-card">
              <div className="footer-card-icon footer-card-icon-building">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 21V8H18V21H6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M13 12H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M9 16H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M13 16H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M6 8L12 3L18 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3>Campus Services</h3>
                <p>Browse facilities, book spaces, and manage campus operations from one polished hub.</p>
              </div>
            </article>
            <article className="footer-card">
              <div className="footer-card-icon footer-card-icon-folder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7H10L12 10H21V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7V5C3 4.44772 3.44772 4 4 4H9L11 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M8 17H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3>Resource Management</h3>
                <p>Admins can approve resources, oversee bookings, and keep campus assets organized.</p>
              </div>
            </article>
            <article className="footer-card">
              <div className="footer-card-icon footer-card-icon-bell">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13V10C18 7.23858 15.7614 5 13 5H11C8.23858 5 6 7.23858 6 10V13L4 15V16H20V15L18 13Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20C12.5523 20 13 19.5523 13 19H11C11 19.5523 11.4477 20 12 20Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h3>Live Notifications</h3>
                <p>Receive real-time updates on approvals, ticket changes, and facility alerts.</p>
              </div>
            </article>
          </div>
          <p className="muted footer-note">
            Smart Campus Operations Hub · React + Spring Boot · OAuth2 + JWT session bridge
          </p>
        </div>
      </footer>

      {/*
        Floating help CTA (right corner) so users can open a ticket quickly.
      */}
      <div className="floating-help-cta" aria-label="Help ticket">
        <div className="floating-help-box">Need any help?</div>
        <Link className="floating-help-btn" to={user ? '/tickets/new' : '/login'}>
          Ticket
        </Link>
      </div>
    </div>
  )
}
