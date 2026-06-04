import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updateTask } from '../modules/tasks'
import type { Task, TaskStatus } from '../types/database'

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
]

interface Props {
  task: Task
  onClose: () => void
  onSaved: () => void
}

export default function StatusModal({ task, onClose, onSaved }: Props) {
  const { currentUser } = useAuth()
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [note, setNote] = useState(task.status_note ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setError(null)
    setSaving(true)
    try {
      await updateTask(task.id, { status, status_note: note || undefined }, currentUser)
      onSaved()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Update Task Status</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <p className="text-muted mb-3 fw-medium">{task.title}</p>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
              >
                {STATUS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Add a note</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="e.g. reason for block, or outcome if completed"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating…' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
