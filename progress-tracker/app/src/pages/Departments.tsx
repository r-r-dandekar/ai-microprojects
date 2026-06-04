import { useState, useEffect } from 'react'
import { listDepartments, createDepartment, deleteDepartment } from '../modules/departments'
import { updateUserDepartment } from '../modules/users'
import { useAuth } from '../contexts/AuthContext'
import type { Department } from '../types/database'

export default function Departments() {
  const { currentUser, refreshSession } = useAuth()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [selectedDeptId, setSelectedDeptId] = useState(currentUser?.department_id ?? '')
  const [savingDept, setSavingDept] = useState(false)
  const [deptSaveMsg, setDeptSaveMsg] = useState<string | null>(null)

  const fetchDepts = () => {
    setLoading(true)
    listDepartments()
      .then(data => { setDepartments(data) })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDepts() }, [])

  // Keep selector in sync if currentUser changes
  useEffect(() => {
    setSelectedDeptId(currentUser?.department_id ?? '')
  }, [currentUser?.department_id])

  const handleSaveDept = async () => {
    if (!currentUser || !selectedDeptId) return
    setSavingDept(true)
    setDeptSaveMsg(null)
    try {
      await updateUserDepartment(currentUser.id, selectedDeptId)
      refreshSession({ department_id: selectedDeptId })
      setDeptSaveMsg('Department updated.')
    } catch (err: unknown) {
      setDeptSaveMsg(err instanceof Error ? err.message : 'Failed to update department')
    } finally {
      setSavingDept(false)
    }
  }

  const handleDelete = async (dept: Department) => {
    if (!window.confirm(`Delete "${dept.name}"? This cannot be undone.`)) return
    try {
      await deleteDepartment(dept.id)
      setDepartments(prev => prev.filter(d => d.id !== dept.id))
      if (currentUser?.department_id === dept.id) {
        refreshSession({ department_id: null })
        setSelectedDeptId('')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete department')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    setCreating(true)
    try {
      await createDepartment(newName.trim())
      setNewName('')
      setShowCreateModal(false)
      fetchDepts()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setCreateError(
        msg.includes('unique') || msg.includes('duplicate')
          ? 'A department with this name already exists.'
          : msg || 'Failed to create department',
      )
    } finally {
      setCreating(false)
    }
  }

  const closeCreateModal = () => { setShowCreateModal(false); setCreateError(null); setNewName('') }

  const currentDeptName = departments.find(d => d.id === currentUser?.department_id)?.name

  return (
    <div>
      {/* My Department section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">My Department</h5>
          {currentUser?.department_id ? (
            <p className="mb-3">
              Currently: <strong>{currentDeptName ?? currentUser.department_id}</strong>
            </p>
          ) : (
            <p className="text-warning mb-3">You have not set a department yet.</p>
          )}
          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select"
              style={{ maxWidth: '280px' }}
              value={selectedDeptId}
              onChange={e => { setSelectedDeptId(e.target.value); setDeptSaveMsg(null) }}
              disabled={loading}
            >
              <option value="">Select a department…</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleSaveDept}
              disabled={savingDept || !selectedDeptId || selectedDeptId === currentUser?.department_id}
            >
              {savingDept ? 'Saving…' : 'Save'}
            </button>
          </div>
          {deptSaveMsg && (
            <p className={`mt-2 mb-0 small ${deptSaveMsg === 'Department updated.' ? 'text-success' : 'text-danger'}`}>
              {deptSaveMsg}
            </p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Departments</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Create Department
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : departments.length === 0 ? (
        <p className="text-muted">No departments yet.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr><th>Name</th><th>Created</th><th></th></tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{new Date(d.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(d)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreateModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleCreate}>
              <div className="modal-header">
                <h5 className="modal-title">Create Department</h5>
                <button type="button" className="btn-close" onClick={closeCreateModal} />
              </div>
              <div className="modal-body">
                {createError && <div className="alert alert-danger py-2">{createError}</div>}
                <label className="form-label">Department Name</label>
                <input
                  className="form-control"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCreateModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
