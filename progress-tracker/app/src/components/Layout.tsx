import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, isManager, logout } = useAuth()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/tasks', label: 'Tasks' },
    ...(isManager ? [{ to: '/departments', label: 'Departments' }] : []),
  ]

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <nav className="navbar navbar-dark bg-primary px-4">
        <span className="navbar-brand fw-bold">ABC Progress Tracker</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white small">Hello, {currentUser?.username}</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        <div className="bg-light border-end" style={{ width: '220px', minHeight: 'calc(100vh - 56px)' }}>
          <nav className="nav flex-column p-3 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link px-3 py-2 rounded ${
                  location.pathname === link.to ? 'bg-primary text-white active' : 'text-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-grow-1 p-4">{children}</main>
      </div>
    </div>
  )
}
