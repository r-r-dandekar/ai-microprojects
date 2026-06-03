import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand as={Link} to="/">ABC Progress Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <NavDropdown title={profile?.full_name || 'User'} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          <Col md={2} className="bg-light border-end py-3 d-none d-md-block min-vh-100">
            <Nav variant="pills" className="flex-column" activeKey={location.pathname}>
              <Nav.Item>
                <Nav.Link as={Link} to="/" eventKey="/">Tasks</Nav.Link>
              </Nav.Item>
              {profile?.role === 'admin' && (
                <Nav.Item>
                  <Nav.Link as={Link} to="/admin" eventKey="/admin">Admin Panel</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Col>
          <Col md={10} className="py-4 px-4">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
