import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createTask, updateTask } from '../modules/tasks'
import { listDepartmentEmployees } from '../modules/users'
import type { Task, TaskPriority } from '../types/database'
import type { UserSummary } from '../modules/users'

interface Props {
  task: Task | null
  onClose: () => void
  onSaved: () => void
}

export default function TaskModal({ task, onClose, onSaved }: Props) {
  const { currentUser } = useAuth()
  const [employees, setEmployees] = useState<UserSummary[]>([])
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    assignee_id: task?.assignee_id ?? '',
    priority: (task?.priority ?? 'medium') as TaskPriority,
    due_date: task?.due_date ?? '',
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (currentUser?.department_id) {
      listDepartmentEmployees(currentUser.department_id).then(setEmployees).catch(() => {})
    }
  }, [currentUser])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setError(null)
    setSaving(true)
    try {
      const data = {
        title: form.title,
        description: form.description || undefined,
        assignee_id: form.assignee_id || undefined,
        priority: form.priority,
        due_date: form.due_date || undefined,
      }
      if (task) {
        await updateTask(task.id, data, currentUser)
      } else {
        await createTask(data, currentUser)
      }
      onSaved()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">{task ? 'Edit Task' : 'Create Task'}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Title <span className="text-danger">*</span></label>
              <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={3}
                value={form.description}
                onChange={handleChange}
                maxLength={500}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Assignee</label>
              <select name="assignee_id" className="form-select" value={form.assignee_id} onChange={handleChange}>
                <option value="">Unassigned</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.username}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input name="due_date" type="date" className="form-control" value={form.due_date} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
