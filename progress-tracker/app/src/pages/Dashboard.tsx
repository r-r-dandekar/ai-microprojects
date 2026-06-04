import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { listTasks } from '../modules/tasks'
import type { Task, TaskStatus } from '../types/database'

const STATUS_CONFIG: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'pending', label: 'Pending', color: 'secondary' },
  { key: 'in_progress', label: 'In Progress', color: 'warning' },
  { key: 'under_review', label: 'Under Review', color: 'info' },
  { key: 'completed', label: 'Completed', color: 'success' },
  { key: 'blocked', label: 'Blocked', color: 'danger' },
]

export default function Dashboard() {
  const { currentUser, isManager } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) return
    listTasks(currentUser)
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [currentUser])

  const today = new Date().toISOString().split('T')[0]

  const counts = STATUS_CONFIG.reduce(
    (acc, s) => ({ ...acc, [s.key]: tasks.filter(t => t.status === s.key).length }),
    {} as Record<TaskStatus, number>,
  )

  const overdue = tasks.filter(
    t => t.due_date && t.due_date < today && t.status !== 'completed',
  )

  const deptMap = new Map<string, { name: string; counts: Record<TaskStatus, number> }>()
  if (isManager) {
    tasks.forEach(t => {
      const deptId = t.department_id
      const deptName = (t.department as { name: string } | null)?.name ?? deptId
      if (!deptMap.has(deptId)) {
        deptMap.set(deptId, {
          name: deptName,
          counts: { pending: 0, in_progress: 0, under_review: 0, completed: 0, blocked: 0 },
        })
      }
      deptMap.get(deptId)!.counts[t.status]++
    })
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-1">Dashboard</h2>
      <p className="text-muted mb-4">
        Welcome back, <strong>{currentUser?.username}</strong>.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4" data-testid="status-cards">
        {STATUS_CONFIG.map(s => (
          <div key={s.key} className="col-sm-6 col-md-4 col-lg">
            <div
              className={`card border-top border-4 border-${s.color} h-100`}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/tasks?status=${s.key}`)}
              data-testid={`status-card-${s.key}`}
            >
              <div className="card-body text-center py-4">
                <div className="fs-1 fw-bold" data-testid={`count-${s.key}`}>{counts[s.key]}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mb-3">Overdue Tasks</h5>
      {overdue.length === 0 ? (
        <p className="text-muted" data-testid="no-overdue">No overdue tasks.</p>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-bordered table-sm" data-testid="overdue-table">
            <thead className="table-light">
              <tr>
                <th>Task</th>
                {isManager && <th>Department</th>}
                <th>Assignee</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map(t => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  {isManager && <td>{(t.department as { name: string } | null)?.name ?? '—'}</td>}
                  <td>{(t.assignee as { username: string } | null)?.username ?? '—'}</td>
                  <td className="text-danger fw-medium">{t.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isManager && deptMap.size > 0 && (
        <>
          <h5 className="mb-3">Department Breakdown</h5>
          <div className="table-responsive" data-testid="dept-breakdown">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Department</th>
                  {STATUS_CONFIG.map(s => <th key={s.key}>{s.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...deptMap.values()].map(d => (
                  <tr key={d.name}>
                    <td className="fw-medium">{d.name}</td>
                    {STATUS_CONFIG.map(s => <td key={s.key}>{d.counts[s.key]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
