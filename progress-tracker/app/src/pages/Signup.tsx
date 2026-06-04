import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { listDepartments } from '../modules/departments'
import type { Department } from '../types/database'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    role: 'employee' as 'manager' | 'employee',
    department_id: '',
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listDepartments().then(setDepartments).catch(() => {})
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (form.role === 'employee' && !form.department_id) {
      setError('Employees must select a department')
      return
    }
    setLoading(true)
    try {
      await signup(form.email, form.username, form.password, form.role, form.department_id || null)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '420px' }}>
        <div className="card-body p-4">
          <h4 className="card-title text-center mb-1">Create Account</h4>
          <p className="text-center text-muted mb-4 small">Join ABC Progress Tracker</p>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input name="username" className="form-control" value={form.username} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">
                Department
                {form.role === 'manager' && <span className="text-muted small ms-1">(optional — you can set this later)</span>}
              </label>
              <select
                name="department_id"
                className="form-select"
                value={form.department_id}
                onChange={handleChange}
                required={form.role === 'employee'}
              >
                <option value="">{form.role === 'manager' ? 'None for now…' : 'Select a department…'}</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0 small">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
