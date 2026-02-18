import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { CreateGruppoPayload } from '../../types/gruppi';

interface GruppoModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreateGruppoPayload) => Promise<void>;
  initialData: CreateGruppoPayload;
  isEditing: boolean;
}

const GruppoModal: React.FC<GruppoModalProps> = ({
  show,
  onHide,
  onSubmit,
  initialData,
  isEditing
}) => {
  const [formData, setFormData] = useState<CreateGruppoPayload>(initialData);
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
          <Modal.Title>{isEditing ? 'Modifica Gruppo' : 'Nuovo Gruppo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. system"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alias</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. Sistema"
              value={formData.alias}
              onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
              required
            />
          </Form.Group>
           <Form.Group className="mb-3">
            <Form.Label>Ordine</Form.Label>
            <Form.Control
              type="number"
              placeholder="0"
              value={formData.ordine || 0}
              onChange={(e) => setFormData({ ...formData, ordine: parseInt(e.target.value, 10) || 0 })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Icona</Form.Label>
            <Form.Control
              type="text"
              placeholder="Es. fa-user"
              value={formData.icona || ''}
              onChange={(e) => setFormData({ ...formData, icona: e.target.value })}
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

export default GruppoModal;
