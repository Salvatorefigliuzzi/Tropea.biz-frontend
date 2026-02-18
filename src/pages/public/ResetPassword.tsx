import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordApi, verifyResetTokenApi } from '../../api/authApi';
import { validatePassword } from '../../utils/passwordValidation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'verifying' | 'valid' | 'invalid'>('verifying');

  const token = searchParams.get('token');

  const [checks, setChecks] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    const verifyToken = async () => {
        if (!token) {
            setTokenStatus('invalid');
            return;
        }
        try {
            await verifyResetTokenApi(token);
            setTokenStatus('valid');
        } catch (err) {
            setTokenStatus('invalid');
        }
    };
    verifyToken();
  }, [token]);

  const handlePasswordChange = (val: string) => {
      setPassword(val);
      const validation = validatePassword(val);
      setChecks(validation.checks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(validation.errors.join('. '));
      setLoading(false);
      return;
    }

    if (!token || tokenStatus !== 'valid') {
      setError('Invalid or expired token');
      setLoading(false);
      return;
    }

    try {
      // Invia la nuova password all'API. 
      // NOTA: il controller si aspetta { token, newPassword } nel body
      await resetPasswordApi({ token, newPassword: password });
      
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || tokenStatus === 'invalid') {
      return (
          <Container className="mt-5">
              <Alert variant="danger">
                  Invalid or expired password reset link. Please request a new one.
              </Alert>
          </Container>
      )
  }

  if (tokenStatus === 'verifying') {
      return (
          <Container className="mt-5 text-center">
              <Spinner animation="border" />
              <p className="mt-2">Verifying link...</p>
          </Container>
      )
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Reset Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  minLength={6}
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <div className="mt-2 text-muted small">
                  <div className={checks.minLength ? "text-success" : ""}>
                    {checks.minLength ? "✓" : "•"} Almeno 10 caratteri
                  </div>
                  <div className={checks.hasUpperCase ? "text-success" : ""}>
                    {checks.hasUpperCase ? "✓" : "•"} Almeno una lettera maiuscola
                  </div>
                  <div className={checks.hasNumber ? "text-success" : ""}>
                    {checks.hasNumber ? "✓" : "•"} Almeno un numero
                  </div>
                  <div className={checks.hasSpecialChar ? "text-success" : ""}>
                    {checks.hasSpecialChar ? "✓" : "•"} Almeno un carattere speciale
                  </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
