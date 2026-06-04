import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { listTasks, deleteTask } from '../modules/tasks'
import { listDepartments } from '../modules/departments'
import TaskModal from '../components/TaskModal'
import StatusModal from '../components/StatusModal'
import type { Task, TaskStatus, TaskPriority, Department } from '../types/database'

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  completed: 'Completed',
  blocked: 'Blocked',
}

const STATUS_BADGE: Record<TaskStatus, string> = {
  pending: 'bg-secondary',
  in_progress: 'bg-warning text-dark',
  under_review: 'bg-info text-dark',
  completed: 'bg-success',
  blocked: 'bg-danger',
}

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  low: 'bg-secondary',
  medium: 'bg-warning text-dark',
  high: 'bg-danger',
}

export default function Tasks() {
  const { currentUser, isManager } = useAuth()
  const [searchParams] = useSearchParams()

  const [tasks, setTasks] = useState<Task[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') ?? '')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [search, setSearch] = useState('')

  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusTask, setStatusTask] = useState<Task | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const fetchTasks = useCallback(async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const data = await listTasks(currentUser, {
        status: (statusFilter as TaskStatus) || undefined,
        priority: (priorityFilter as TaskPriority) || undefined,
        department_id: deptFilter || undefined,
        search: search || undefined,
      })
      setTasks(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [currentUser, statusFilter, priorityFilter, deptFilter, search])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  useEffect(() => {
    if (isManager) listDepartments().then(setDepartments).catch(() => {})
  }, [isManager])

  const handleDelete = async (task: Task) => {
    if (!currentUser || !window.confirm(`Delete "${task.title}"?`)) return
    try {
      await deleteTask(task.id, currentUser)
      setTasks(prev => prev.filter(t => t.id !== task.id))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete task')
    }
  }

  const openCreate = () => { setEditingTask(null); setShowTaskModal(true) }
  const openEdit = (task: Task) => { setEditingTask(task); setShowTaskModal(true) }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Tasks</h2>
        {isManager && (
          <button className="btn btn-primary" onClick={openCreate} data-testid="new-task-btn">
            + New Task
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}

      <div className="row g-2 mb-3">
        <div className="col-sm-auto">
          <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-auto">
          <select className="form-select form-select-sm" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {isManager && (
          <div className="col-sm-auto">
            <select className="form-select form-select-sm" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        )}
        <div className="col">
          <input
            className="form-control form-control-sm"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-muted py-5" data-testid="empty-state">
          No tasks found.
          {isManager && (
            <> <button className="btn btn-link p-0" onClick={openCreate}>Create the first task</button>.</>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle" data-testid="task-table">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                {isManager && <th>Department</th>}
                <th>Assignee</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const isOverdue = task.due_date && task.due_date < today && task.status !== 'completed'
                const canUpdateStatus = !isManager && task.assignee_id === currentUser?.id
                const canEdit = isManager && task.created_by === currentUser?.id
                return (
                  <tr key={task.id} data-testid={`task-row-${task.id}`}>
                    <td>{task.title}</td>
                    {isManager && (
                      <td>{(task.department as { name: string } | null)?.name ?? '—'}</td>
                    )}
                    <td>
                      {(task.assignee as { username: string } | null)?.username ?? (
                        <span className="text-muted fst-italic">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[task.status]}`}>
                        {STATUS_LABELS[task.status]}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className={isOverdue ? 'text-danger' : ''}>
                      {task.due_date ?? '—'}
                      {isOverdue && <span className="badge bg-danger ms-1">Overdue</span>}
                    </td>
                    <td>
                      {canUpdateStatus && (
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => setStatusTask(task)}
                          data-testid={`update-status-${task.id}`}
                        >
                          Update Status
                        </button>
                      )}
                      {canEdit && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={() => openEdit(task)}
                            data-testid={`edit-${task.id}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(task)}
                            data-testid={`delete-${task.id}`}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => setShowTaskModal(false)}
          onSaved={fetchTasks}
        />
      )}

      {statusTask && (
        <StatusModal
          task={statusTask}
          onClose={() => setStatusTask(null)}
          onSaved={fetchTasks}
        />
      )}
    </div>
  )
}
