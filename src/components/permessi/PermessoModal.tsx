import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { CreatePermessoPayload } from '../../types/permessi';
import type { Gruppo } from '../../types/gruppi';

interface PermessoModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreatePermessoPayload) => Promise<void>;
  initialData: CreatePermessoPayload;
  isEditing: boolean;
  gruppi: Gruppo[];
}

const PermessoModal: React.FC<PermessoModalProps> = ({
  show,
  onHide,
  onSubmit,
  initialData,
  isEditing,
  gruppi
}) => {
  const [formData, setFormData] = useState<CreatePermessoPayload>(initialData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      setFormData(initialData);
      setSubmitting(false);
    }
  }, [show, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifica Permesso' : 'Nuovo Permesso'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. permessi.read"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alias</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. Lettura Permessi"
              value={formData.alias}
              onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gruppo</Form.Label>
            <Form.Select
              value={formData.gruppoId || ''}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ 
                  ...formData, 
                  gruppoId: val ? parseInt(val, 10) : null 
                });
              }}
            >
              <option value="">Nessun gruppo</option>
              {gruppi.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.alias || g.nome}
                </option>
              ))}
            </Form.Select>
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

export default PermessoModal;
