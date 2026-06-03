import React, { useEffect, useState } from 'react';
import { Button, Table, Badge, Spinner, Alert, Form, Stack, Card } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import type { Task, Profile } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import TaskModal from '../components/TaskModal';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (profile?.department_id) {
      fetchTasks();
      fetchTeamMembers();
    }
  }, [profile]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('department_id', profile?.department_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('department_id', profile?.department_id);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err: any) {
      console.error('Error fetching team members:', err);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    if (profile?.role === 'manager' || profile?.role === 'admin') {
      setEditingTask(task);
      setShowModal(true);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    // Only owner or manager/admin can change status
    if (task.owner_id !== profile?.id && profile?.role === 'employee') return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;
      fetchTasks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredTasks = tasks.filter(task => 
    filterStatus === 'all' ? true : task.status === filterStatus
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge bg="danger">High</Badge>;
      case 'medium': return <Badge bg="warning" text="dark">Medium</Badge>;
      case 'low': return <Badge bg="info">Low</Badge>;
      default: return <Badge bg="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge bg="success">Completed</Badge>;
      case 'in_progress': return <Badge bg="primary">In Progress</Badge>;
      case 'pending': return <Badge bg="secondary">Pending</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <Stack direction="horizontal" gap={3} className="mb-4">
        <h2>Department Tasks</h2>
        <div className="ms-auto">
          {(profile?.role === 'manager' || profile?.role === 'admin') && (
            <Button variant="primary" onClick={handleCreateTask}>
              + Create Task
            </Button>
          )}
        </div>
      </Stack>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Form.Group controlId="filterStatus" style={{ maxWidth: '200px' }}>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-muted">
                No tasks found.
              </td>
            </tr>
          ) : (
            filteredTasks.map((task) => (
              <tr key={task.id} style={{ cursor: (profile?.role !== 'employee' || task.owner_id === profile.id) ? 'pointer' : 'default' }}>
                <td onClick={() => handleEditTask(task)}>{task.title}</td>
                <td onClick={() => handleEditTask(task)}>
                  {teamMembers.find(m => m.id === task.owner_id)?.full_name || 'Unassigned'}
                </td>
                <td>
                  <Form.Select 
                    size="sm" 
                    value={task.status}
                    disabled={task.owner_id !== profile?.id && profile?.role === 'employee'}
                    onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                    style={{ width: 'auto', display: 'inline-block' }}
                    className="me-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                  {getStatusBadge(task.status)}
                </td>
                <td onClick={() => handleEditTask(task)}>{getPriorityBadge(task.priority)}</td>
                <td onClick={() => handleEditTask(task)}>
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                </td>
                <td>
                  {(profile?.role === 'manager' || profile?.role === 'admin') && (
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditTask(task)}>
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <TaskModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        task={editingTask}
        teamMembers={teamMembers}
        departmentId={profile?.department_id || ''}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default Dashboard;
