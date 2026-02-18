import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { loginUser, clearError } from '../../features/auth/authSlice';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(user)
      const roles = user.ruoli || [];
    
      
      // Se ha il ruolo User e NON ha ruoli amministrativi, vai alla home
      if ((roles.length === 1 && roles[0].nome === 'USER') ) {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <Container>
      <div className="auth-wrapper animate-fade-in">
        <Col xs={12} md={6} lg={4}>
          <div className="auth-card">
            <h2 className="auth-title">
              <FaSignInAlt className="me-2" />
              Welcome Back
            </h2>
            <p className="text-center text-muted mb-4">Please login to continue</p>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaEnvelope className="text-muted" />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-start-0 ps-2"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaLock className="text-muted" />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-start-0 ps-2"
                  />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p className="mb-2">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
              <p className="mb-0 text-muted">
                Don't have an account? <Link to="/register" className="fw-bold">Sign up</Link>
              </p>
            </div>
          </div>
        </Col>
      </div>
    </Container>
  );
};

export default Login;
