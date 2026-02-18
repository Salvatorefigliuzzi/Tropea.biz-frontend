import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getUserByIdApi } from '../../api/usersApi';
import { getRuoliApi, assegnaRuoloAUtenteApi, disassegnaRuoloDaUtenteApi } from '../../api/ruoliApi';
import type { User } from '../../types/users';
import type { Ruolo } from '../../types/ruoli';

interface UsersRuoliModalProps {
  show: boolean;
  onClose: () => void;
  userId: number | null;
}

const UsersRuoliModal: React.FC<UsersRuoliModalProps> = ({ show, onClose, userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allRuoli, setAllRuoli] = useState<Ruolo[]>([]);
  
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingRuoli, setLoadingRuoli] = useState(false);
  
  // Fetch User and Ruoli when modal opens
  useEffect(() => {
    if (show && userId) {
      fetchUser(userId);
      fetchRuoli();
    }
  }, [show, userId]);

  const fetchUser = async (id: number) => {
    setLoadingUser(true);
    try {
      const { user } = await getUserByIdApi(id);
      setUser(user);
    } catch (error) {
      console.error(error);
      toast.error('Errore nel caricamento dell\'utente');
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchRuoli = async () => {
    setLoadingRuoli(true);
    try {
      // Fetching all roles, assuming pageSize 100 covers most cases
      const response = await getRuoliApi(); 
      setAllRuoli(response.pagination.data);
    } catch (error) {
      console.error(error);
      toast.error('Errore nel caricamento dei ruoli');
    } finally {
      setLoadingRuoli(false);
    }
  };

  const handleAssignRuolo = async (ruolo: Ruolo) => {
    if (!user) return;
    try {
      await assegnaRuoloAUtenteApi(user.id, ruolo.id);
      toast.success('Ruolo assegnato');
      fetchUser(user.id); // Refresh user to update assigned list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Errore assegnazione');
    }
  };

  const handleUnassignRuolo = async (ruolo: Ruolo) => {
    if (!user) return;
    try {
      await disassegnaRuoloDaUtenteApi(user.id, ruolo.id);
      toast.success('Ruolo rimosso');
      fetchUser(user.id); // Refresh user
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Errore rimozione');
    }
  };

  const isRuoloAssigned = (ruoloId: number) => {
    return user?.ruoli?.some(r => r.id === ruoloId);
  };

  const availableRuoli = allRuoli.filter(r => !isRuoloAssigned(r.id));

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Gestione Ruoli - {user?.name} {user?.surname}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: '400px' }}>
         <Row className="h-100">
            {/* Col 1: Assigned Ruoli */}
            <Col md={6} className="border-end">
                <h6 className="text-center mb-3">Ruoli Assegnati</h6>
                {loadingUser ? <div className="text-center"><Spinner animation="border" size="sm"/></div> : (
                    <ListGroup variant="flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {user?.ruoli?.map(r => (
                            <ListGroup.Item key={r.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold">{r.nome}</div>
                                </div>
                                <Button variant="outline-danger" size="sm" onClick={() => handleUnassignRuolo(r)}>
                                    <FaTrash />
                                </Button>
                            </ListGroup.Item>
                        ))}
                        {(!user?.ruoli || user.ruoli.length === 0) && (
                            <div className="text-center text-muted mt-3">Nessun ruolo assegnato</div>
                        )}
                    </ListGroup>
                )}
            </Col>

            {/* Col 2: Available Ruoli */}
            <Col md={6}>
                <h6 className="text-center mb-3">Ruoli Disponibili</h6>
                {loadingRuoli ? (
                     <div className="text-center"><Spinner animation="border" size="sm"/></div>
                ) : (
                    <ListGroup variant="flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {availableRuoli.map(r => (
                            <ListGroup.Item key={r.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold">{r.nome}</div>
                                </div>
                                <Button variant="outline-success" size="sm" onClick={() => handleAssignRuolo(r)}>
                                    <FaPlus />
                                </Button>
                            </ListGroup.Item>
                        ))}
                        {availableRuoli.length === 0 && (
                            <div className="text-center text-muted mt-3">Nessun ruolo disponibile</div>
                        )}
                    </ListGroup>
                )}
            </Col>
         </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Chiudi</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsersRuoliModal;
