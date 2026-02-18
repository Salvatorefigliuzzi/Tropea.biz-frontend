import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { validatePassword } from '../../utils/passwordValidation';
import type { CreateUserPayload } from '../../types/users';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface UserModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreateUserPayload & { password?: string }) => Promise<void>;
  initialData: CreateUserPayload & { password?: string };
  isEditing: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  show,
  onHide,
  onSubmit,
  initialData,
  isEditing
}) => {
  const [formData, setFormData] = useState<CreateUserPayload & { password?: string }>({
    ...initialData,
    active: initialData.active ?? true // Default to true if undefined
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (show) {
      setFormData({
        ...initialData,
        active: initialData.active ?? true
      });
      setConfirmPassword('');
      setPasswordErrors([]);
      setSubmitting(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [show, initialData]);

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    if (value) {
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password validation
    if (formData.password) {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        toast.error("La password non soddisfa i requisiti di sicurezza");
        return;
      }
      
      if (formData.password !== confirmPassword) {
        toast.error("Le password non coincidono");
        return;
      }
    } else if (!isEditing) {
        // Required for creation
        toast.error("La password è obbligatoria");
        return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is usually done in parent, but we catch here to stop loading
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifica Utente' : 'Nuovo Utente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. Mario"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. Rossi"
              value={formData.surname || ''}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Es. mario.rossi@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isEditing}
            />
            {isEditing && <Form.Text className="text-muted">L'email non può essere modificata.</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder={isEditing ? "Lascia vuoto per mantenere la password attuale" : "Inserisci una password"}
                value={formData.password || ''}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required={!isEditing}
                isInvalid={passwordErrors.length > 0}
              />
              <Button 
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                <ul className="mb-0 ps-3">
                  {passwordErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {(!isEditing || formData.password) && (
            <Form.Group className="mb-3">
              <Form.Label>Conferma Password</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ripeti la password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isEditing || !!formData.password}
                  isInvalid={formData.password !== confirmPassword && confirmPassword !== ''}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  Le password non coincidono
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          )}
          
          <Form.Group className="mb-3" controlId="formPrivacy">
              <Form.Check 
                  type="checkbox" 
                  label="Privacy Accepted" 
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPolicy">
              <Form.Check 
                  type="checkbox" 
                  label="Policy Accepted" 
                  checked={formData.policyAccepted}
                  onChange={(e) => setFormData({ ...formData, policyAccepted: e.target.checked })}
                  required
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formActive">
              <Form.Check 
                  type="switch"
                  label={formData.active ? "Attivo" : "Disattivato"}
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Annulla
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Salvataggio...' : 'Salva'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserModal;
