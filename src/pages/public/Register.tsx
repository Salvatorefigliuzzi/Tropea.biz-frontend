import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { registerUser, clearError } from '../../features/auth/authSlice';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import { validatePassword } from '../../utils/passwordValidation';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    privacyAccepted: false,
    policyAccepted: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setPasswordError(validation.errors.join('. '));
      return;
    }

    if (!formData.privacyAccepted || !formData.policyAccepted) {
      setPasswordError('You must accept Privacy Policy and Terms of Service');
      return;
    }

    const resultAction = await dispatch(registerUser({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        privacyAccepted: formData.privacyAccepted,
        policyAccepted: formData.policyAccepted
    }));

    if (registerUser.fulfilled.match(resultAction)) {
        setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    }
  };

  return (
    <Container>
      <div className="auth-wrapper animate-fade-in">
        <Col xs={12} md={8} lg={6}>
          <div className="auth-card">
            <h2 className="auth-title">
              <FaUserPlus className="me-2" />
              Create Account
            </h2>
            <p className="text-center text-muted mb-4">Join us today! It takes only few steps.</p>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaUser className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-start-0 ps-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formSurname">
                    <Form.Label>Surname</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaUser className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className="border-start-0 ps-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaEnvelope className="text-muted" />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-start-0 ps-2"
                  />
                </div>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaLock className="text-muted" />
                      </span>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="border-start-0 border-end-0 ps-2"
                      />
                      <Button 
                        variant="outline-secondary" 
                        className="border-start-0"
                        style={{ borderColor: '#ced4da' }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaCheck className="text-muted" />
                      </span>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="border-start-0 border-end-0 ps-2"
                      />
                      <Button 
                        variant="outline-secondary" 
                        className="border-start-0"
                        style={{ borderColor: '#ced4da' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-4 bg-light p-3 rounded">
                <Form.Group className="mb-2" controlId="formPrivacy">
                  <Form.Check 
                    type="checkbox" 
                    label="I accept the Privacy Policy" 
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-0" controlId="formPolicy">
                  <Form.Check 
                    type="checkbox" 
                    label="I accept the Terms of Service" 
                    name="policyAccepted"
                    checked={formData.policyAccepted}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Create Account'}
              </Button>
            </Form>

            <div className="text-center">
              <p className="mb-0 text-muted">
                Already have an account? <Link to="/login" className="fw-bold">Login</Link>
              </p>
            </div>
          </div>
        </Col>
      </div>
    </Container>
  );
};

export default Register;
