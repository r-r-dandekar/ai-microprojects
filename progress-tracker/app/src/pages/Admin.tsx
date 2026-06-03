import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import type { Department } from '../types/database';

const Admin: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) {
      setError(error.message);
    } else {
      setDepartments(data || []);
    }
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('departments').insert([{ name: newDeptName }]);
    if (error) {
      setError(error.message);
    } else {
      setNewDeptName('');
      fetchDepartments();
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="mb-4">Admin Panel</h2>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Create Department</Card.Header>
            <Card.Body>
              <Form onSubmit={handleCreateDept}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    required 
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Existing Departments</Card.Header>
            <ListGroup variant="flush">
              {departments.length === 0 ? (
                <ListGroup.Item className="text-center text-muted">No departments yet.</ListGroup.Item>
              ) : (
                departments.map(dept => (
                  <ListGroup.Item key={dept.id}>{dept.name}</ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Alert variant="info" className="mt-4">
        <strong>Note:</strong> User management (creating managers and employees) is currently handled via Supabase Auth dashboard or custom triggers in this prototype.
      </Alert>
    </div>
  );
};

export default Admin;
