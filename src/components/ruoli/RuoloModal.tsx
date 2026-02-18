import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { CreateRuoloPayload } from '../../types/ruoli';

interface RuoloModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreateRuoloPayload) => Promise<void>;
  initialData: CreateRuoloPayload;
  isEditing: boolean;
}

const RuoloModal: React.FC<RuoloModalProps> = ({
  show,
  onHide,
  onSubmit,
  initialData,
  isEditing
}) => {
  const [formData, setFormData] = useState<CreateRuoloPayload>(initialData);
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
        // error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifica Ruolo' : 'Nuovo Ruolo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. admin"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ordine</Form.Label>
            <Form.Control
              type="number"
              placeholder="Es. 10"
              value={formData.ordine || ''}
              onChange={(e) => setFormData({ ...formData, ordine: parseInt(e.target.value) || 0 })}
            />
            <Form.Text className="text-muted">
              Valore numerico per definire la gerarchia (minore = più importante)
            </Form.Text>
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

export default RuoloModal;
