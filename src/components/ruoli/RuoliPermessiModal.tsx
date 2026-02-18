import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getRuoloByIdApi } from '../../api/ruoliApi';
import { getGruppiApi, getGruppoByIdApi } from '../../api/gruppiApi';
import { assegnaPermessoARuoloApi, disassegnaPermessoDaRuoloApi } from '../../api/permessiApi';
import type { Ruolo } from '../../types/ruoli';
import type { Gruppo } from '../../types/gruppi';
import type { Permesso } from '../../types/permessi';

interface RuoliPermessiModalProps {
  show: boolean;
  onClose: () => void;
  ruoloId: number | null;
}

const RuoliPermessiModal: React.FC<RuoliPermessiModalProps> = ({ show, onClose, ruoloId }) => {
  const [ruolo, setRuolo] = useState<Ruolo | null>(null);
  const [gruppi, setGruppi] = useState<Gruppo[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedGroupPermessi, setSelectedGroupPermessi] = useState<Permesso[]>([]);
  
  const [loadingRuolo, setLoadingRuolo] = useState(false);
  const [loadingGruppi, setLoadingGruppi] = useState(false);
  const [loadingPermessi, setLoadingPermessi] = useState(false);
  
  // Fetch Ruolo and Gruppi when modal opens
  useEffect(() => {
    if (show && ruoloId) {
      fetchRuolo(ruoloId);
      fetchGruppi();
      setSelectedGroupId(null);
      setSelectedGroupPermessi([]);
    }
  }, [show, ruoloId]);

  // Fetch Group Permessi when group selected
  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupPermessi(selectedGroupId);
    } else {
      setSelectedGroupPermessi([]);
    }
  }, [selectedGroupId]);

  const fetchRuolo = async (id: number) => {
    setLoadingRuolo(true);
    try {
      const { ruolo } = await getRuoloByIdApi(id);
      setRuolo(ruolo);
    } catch (error) {
      console.error(error);
      toast.error('Errore nel caricamento del ruolo');
    } finally {
      setLoadingRuolo(false);
    }
  };

  const fetchGruppi = async () => {
    setLoadingGruppi(true);
    try {
      // Assuming we want all groups, might need pagination handling if many groups
      // For now fetching page 1 size 100
      const response = await getGruppiApi(); 
      setGruppi(response.pagination.data);
    } catch (error) {
      console.error(error);
      toast.error('Errore nel caricamento dei gruppi');
    } finally {
      setLoadingGruppi(false);
    }
  };

  const fetchGroupPermessi = async (groupId: number) => {
    setLoadingPermessi(true);
    try {
      const { gruppo } = await getGruppoByIdApi(groupId);
      setSelectedGroupPermessi(gruppo.permessi || []);
    } catch (error) {
      console.error(error);
      toast.error('Errore nel caricamento dei permessi del gruppo');
    } finally {
      setLoadingPermessi(false);
    }
  };

  const handleAssignPermesso = async (permesso: Permesso) => {
    if (!ruolo) return;
    try {
       console.log("ruolo id ",ruolo.id);
      console.log("permesso id ", permesso.id);
      await assegnaPermessoARuoloApi(ruolo.id, permesso.id);
     
      toast.success('Permesso assegnato');
      fetchRuolo(ruolo.id); // Refresh role to update left column
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Errore assegnazione');
    }
  };

  const handleUnassignPermesso = async (permesso: Permesso) => {
    if (!ruolo) return;
    try {
      await disassegnaPermessoDaRuoloApi(ruolo.id, permesso.id);
      toast.success('Permesso rimosso');
      fetchRuolo(ruolo.id); // Refresh role
    } catch (error: any) {
         toast.error(error.response?.data?.message || 'Errore rimozione');
    }
  };

  const isPermessoAssigned = (permessoId: number) => {
    return ruolo?.permessi?.some(p => p.id === permessoId);
  };

  const availablePermessi = selectedGroupPermessi.filter(p => !isPermessoAssigned(p.id));

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Gestione Permessi - {ruolo?.nome}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: '500px' }}>
         <Row className="h-100">
            {/* Col 1: Assigned Permessi */}
            <Col md={4} className="border-end">
                <h6 className="text-center mb-3">Permessi Assegnati</h6>
                {loadingRuolo ? <div className="text-center"><Spinner animation="border" size="sm"/></div> : (
                    <ListGroup variant="flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {ruolo?.permessi?.map(p => (
                            <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold">{p.nome}</div>
                                    <small className="text-muted">{p.alias}</small>
                                </div>
                                <Button variant="outline-danger" size="sm" onClick={() => handleUnassignPermesso(p)}>
                                    <FaTrash />
                                </Button>
                            </ListGroup.Item>
                        ))}
                        {(!ruolo?.permessi || ruolo.permessi.length === 0) && (
                            <div className="text-center text-muted mt-3">Nessun permesso assegnato</div>
                        )}
                    </ListGroup>
                )}
            </Col>

            {/* Col 2: Gruppi */}
            <Col md={4} className="border-end">
                <h6 className="text-center mb-3">Gruppi</h6>
                 {loadingGruppi ? <div className="text-center"><Spinner animation="border" size="sm"/></div> : (
                    <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {gruppi.map(g => (
                            <ListGroup.Item 
                                key={g.id} 
                                action 
                                active={selectedGroupId === g.id}
                                onClick={() => setSelectedGroupId(g.id)}
                            >
                                <div className="fw-bold">{g.nome}</div>
                                <small>{g.alias}</small>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>

            {/* Col 3: Available Permessi */}
            <Col md={4}>
                <h6 className="text-center mb-3">Permessi Disponibili {selectedGroupId ? '(Gruppo)' : ''}</h6>
                {!selectedGroupId ? (
                    <div className="text-center text-muted mt-5">Seleziona un gruppo per vedere i permessi</div>
                ) : loadingPermessi ? (
                     <div className="text-center"><Spinner animation="border" size="sm"/></div>
                ) : (
                    <ListGroup variant="flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {availablePermessi.map(p => (
                            <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold">{p.nome}</div>
                                    <small className="text-muted">{p.alias}</small>
                                </div>
                                <Button variant="outline-success" size="sm" onClick={() => handleAssignPermesso(p)}>
                                    <FaPlus />
                                </Button>
                            </ListGroup.Item>
                        ))}
                        {availablePermessi.length === 0 && (
                            <div className="text-center text-muted mt-3">Nessun permesso disponibile in questo gruppo</div>
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

export default RuoliPermessiModal;