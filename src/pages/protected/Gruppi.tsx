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
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { 
  getGruppiApi, 
  getGruppoByIdApi,
  createGruppoApi, 
  updateGruppoApi, 
  deleteGruppoApi 
} from '../../api/gruppiApi';
import type { Gruppo, CreateGruppoPayload } from '../../types/gruppi';
import GruppoModal from '../../components/gruppi/GruppoModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const Gruppi: React.FC = () => {
  // State for data
  const [gruppi, setGruppi] = useState<Gruppo[]>([]);
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
  const [modalData, setModalData] = useState<CreateGruppoPayload>({ 
    nome: '', 
    alias: '', 
    ordine: 0, 
    icona: '' 
  });

  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch data
  const fetchGruppi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGruppiApi({
        page,
        pageSize,
        sortBy,
        sortOrder,
        search: debouncedSearch
      });
      setGruppi(response.pagination.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nel caricamento dei gruppi');
      toast.error('Errore nel caricamento dei gruppi');
    } finally {
      setLoading(false);
    }
 }, [page, pageSize, sortBy, sortOrder, debouncedSearch]);

  // Initial fetch and on dependencies change
  useEffect(() => {
    fetchGruppi();
  }, [fetchGruppi]);

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
    setModalData({ nome: '', alias: '', ordine: 0, icona: '' });
    setShowModal(true);
  };

  const handleShowEdit = async (id: number) => {
    try {
      const { gruppo } = await getGruppoByIdApi(id);
      setEditingId(gruppo.id);
      setModalData({ 
        nome: gruppo.nome, 
        alias: gruppo.alias,
        ordine: gruppo.ordine || 0,
        icona: gruppo.icona || ''
      });
      setShowModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Impossibile recuperare i dati del gruppo');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setModalData({ nome: '', alias: '', ordine: 0, icona: '' });
  };

  const handleModalSubmit = async (data: CreateGruppoPayload) => {
    try {
      if (editingId) {
        await updateGruppoApi(editingId, data);
        toast.success('Gruppo aggiornato con successo');
      } else {
        await createGruppoApi(data);
        toast.success('Gruppo creato con successo');
      }
      handleCloseModal();
      fetchGruppi();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operazione fallita');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteGruppoApi(deletingId);
      toast.success('Gruppo eliminato con successo');
      setShowDeleteModal(false);
      fetchGruppi();
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
        <h2 className="mb-0">Gestione Gruppi</h2>
        <Button variant="primary" onClick={handleShowCreate}>
          <FaPlus className="me-2" /> Nuovo Gruppo
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
              placeholder="Cerca gruppo per nome o alias..."
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
                    onClick={() => handleSort('alias')}
                  >
                    Alias {renderSortIcon('alias')}
                  </th>
                  <th className="text-end">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {gruppi.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      Nessun gruppo trovato
                    </td>
                  </tr>
                ) : (
                  gruppi.map((gruppo) => (
                    <tr key={gruppo.id}>
                      <td>{gruppo.id}</td>
                      <td>{gruppo.nome}</td>
                      <td>{gruppo.alias}</td>
                      <td className="text-end">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleShowEdit(gruppo.id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(gruppo.id)}
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
                  Visualizzati {gruppi.length} di {totalItems} risultati
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

      <GruppoModal
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
        message="Sei sicuro di voler eliminare questo gruppo? L'operazione non è reversibile."
        confirmLabel="Elimina"
        variant="danger"
      />
    </Container>
  );
};

export default Gruppi;
