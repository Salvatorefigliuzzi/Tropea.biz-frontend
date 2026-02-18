import React from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { logoutUser } from '../features/auth/authSlice';
import { FaUserCircle, FaSignOutAlt, FaHome, FaRocket } from 'react-icons/fa';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    const roles = user.ruoli || [];
    
    // Se l'utente ha SOLO il ruolo USER, ritorna "/"
    if (roles.length === 1 && roles[0].nome === 'USER') {
      return "/";
    }
    
    return "/dashboard";
  };

  const dashboardLink = getDashboardLink();

  return (
    <>
      <Navbar expand="lg" className="navbar-custom sticky-top">
        <Container>
          <Navbar.Brand as={Link as any} to={isAuthenticated ? dashboardLink : "/"}>
            <FaRocket /> Tropea.biz
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link as any} to={isAuthenticated ? dashboardLink : "/"}>
                <FaHome className="me-1" /> {isAuthenticated && dashboardLink !== "/" ? "Dashboard" : "Home"}
              </Nav.Link>
              {/* Add more links here */}
            </Nav>
            <Nav className="align-items-center">
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center gap-2 border-0 bg-transparent">
                    <FaUserCircle size={24} className="text-primary" />
                    <span className="fw-medium">{user?.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-sm border-0 mt-2">
                    <Dropdown.Item disabled className="text-muted small">
                      {user?.email}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button as={Link as any} to="/login" variant="outline-primary" className="px-4">
                    Login
                  </Button>
                  <Button as={Link as any} to="/register" variant="primary" className="px-4">
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
