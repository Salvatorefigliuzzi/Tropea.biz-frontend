import React, { useEffect, useState, useCallback } from 'react';
import { 
  Container, 
  Table, 
  Button, 
  Pagination, 
  Spinner, 
  Alert,
  InputGroup,
  Form
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown, FaKey, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { 
  getRuoliApi, 
  getRuoloByIdApi,
  createRuoloApi, 
  updateRuoloApi, 
  deleteRuoloApi 
} from '../../api/ruoliApi';
import type { Ruolo, CreateRuoloPayload } from '../../types/ruoli';
import RuoliPermessiModal from '../../components/ruoli/RuoliPermessiModal';
import RuoloModal from '../../components/ruoli/RuoloModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const Ruoli: React.FC = () => {
  // State for data
  const [ruoli, setRuoli] = useState<Ruolo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for pagination & sorting
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // State for modal (create/edit)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalData, setModalData] = useState<CreateRuoloPayload>({ nome: '' });

  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // State for permissions modal
  const [showPermessiModal, setShowPermessiModal] = useState(false);
  const [permessiRuoloId, setPermessiRuoloId] = useState<number | null>(null);

  // Fetch data
  const fetchRuoli = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRuoliApi({
        page,
        pageSize,
        sortBy,
        sortOrder,
        search: debouncedSearch
      });
      setRuoli(response.pagination.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nel caricamento dei ruoli');
      toast.error('Errore nel caricamento dei ruoli');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, debouncedSearch]);

  // Initial fetch and on dependencies change
  useEffect(() => {
    fetchRuoli();
  }, [fetchRuoli]);

  // Handlers
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleShowCreate = () => {
    setEditingId(null);
    setModalData({ nome: '', ordine: 0 });
    setShowModal(true);
  };

  const handleShowEdit = async (id: number) => {
    try {
      const { ruolo } = await getRuoloByIdApi(id);
      setEditingId(ruolo.id);
      setModalData({ 
        nome: ruolo.nome,
        ordine: ruolo.ordine
      });
      setShowModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Impossibile recuperare i dati del ruolo');
    }
  };

  const handleShowPermessi = (id: number) => {
    setPermessiRuoloId(id);
    setShowPermessiModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setModalData({ nome: '', ordine: 0 });
  };

  const handleModalSubmit = async (data: CreateRuoloPayload) => {
    try {
      if (editingId) {
        await updateRuoloApi(editingId, data);
        toast.success('Ruolo aggiornato con successo');
      } else {
        await createRuoloApi(data);
        toast.success('Ruolo creato con successo');
      }
      handleCloseModal();
      fetchRuoli();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operazione fallita');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteRuoloApi(deletingId);
      toast.success('Ruolo eliminato con successo');
      setShowDeleteModal(false);
      fetchRuoli();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Eliminazione fallita');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <FaSort className="text-muted ms-1" size={12} />;
    return sortOrder === 'ASC' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestione Ruoli</h2>
        <Button variant="primary" onClick={handleShowCreate}>
          <FaPlus className="me-2" /> Nuovo Ruolo
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="bg-white rounded shadow-sm p-3">
        <div className="mb-4">
          <InputGroup>
            <InputGroup.Text className="bg-light border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Cerca ruolo per nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0 bg-light shadow-none"
            />
          </InputGroup>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Table hover responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th 
                    style={{ cursor: 'pointer', width: '80px' }} 
                    onClick={() => handleSort('id')}
                  >
                    ID {renderSortIcon('id')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSort('nome')}
                  >
                    Nome {renderSortIcon('nome')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSort('ordine')}
                  >
                    Ordine {renderSortIcon('ordine')}
                  </th>
                  <th className="text-end">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {ruoli.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      Nessun ruolo trovato
                    </td>
                  </tr>
                ) : (
                  ruoli.map((ruolo) => (
                    <tr key={ruolo.id}>
                      <td>{ruolo.id}</td>
                      <td>{ruolo.nome}</td>
                      <td>{ruolo.ordine}</td>
                      <td className="text-end">
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleShowPermessi(ruolo.id)}
                          title="Gestisci Permessi"
                        >
                          <FaKey />
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleShowEdit(ruolo.id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(ruolo.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Visualizzati {ruoli.length} di {totalItems} risultati
                </div>
                <Pagination className="mb-0">
                  <Pagination.First 
                    onClick={() => setPage(1)} 
                    disabled={page === 1}
                  />
                  <Pagination.Prev 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item 
                      key={i + 1} 
                      active={i + 1 === page}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={page === totalPages}
                  />
                  <Pagination.Last 
                    onClick={() => setPage(totalPages)} 
                    disabled={page === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <RuoloModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={modalData}
        isEditing={!!editingId}
      />

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Conferma eliminazione"
        message="Sei sicuro di voler eliminare questo ruolo? L'operazione non è reversibile."
        confirmLabel="Elimina"
        variant="danger"
      />

      {/* Permissions Modal */}
      <RuoliPermessiModal 
        show={showPermessiModal} 
        onClose={() => setShowPermessiModal(false)} 
        ruoloId={permessiRuoloId} 
      />
    </Container>
  );
};

export default Ruoli;
