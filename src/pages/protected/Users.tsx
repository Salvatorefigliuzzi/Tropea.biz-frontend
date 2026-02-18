import React, { useEffect, useState, useCallback } from 'react';
import { 
  Container, 
  Table, 
  Button, 
  Pagination, 
  Spinner, 
  Alert,
  Badge,
  InputGroup,
  Form
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown, FaUserShield, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { 
  getUsersApi, 
  getUserByIdApi,
  createUserApi, 
  updateUserApi, 
  deleteUserApi 
} from '../../api/usersApi';
import type { User, CreateUserPayload } from '../../types/users';
import UsersRuoliModal from '../../components/users/UsersRuoliModal';
import UserModal from '../../components/users/UserModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const Utenti: React.FC = () => {
  // State for data
  const [users, setUsers] = useState<User[]>([]);
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
  const [modalData, setModalData] = useState<CreateUserPayload & { password?: string }>({
    email: '',
    password: '',
    name: '',
    surname: '',
    privacyAccepted: true,
    policyAccepted: true,
    active: true
  });

  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // State for roles modal
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [rolesUserId, setRolesUserId] = useState<number | null>(null);

  // Fetch data
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsersApi({
        page,
        pageSize,
        sortBy,
        sortOrder,
        search: debouncedSearch
      });
      setUsers(response.pagination.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nel caricamento degli utenti');
      toast.error('Errore nel caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, debouncedSearch]);

  // Initial fetch and on dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    setModalData({
      email: '',
      password: '',
      name: '',
      surname: '',
      privacyAccepted: true,
      policyAccepted: true,
      active: true
    });
    setShowModal(true);
  };

  const handleShowEdit = async (id: number) => {
    try {
      const { user } = await getUserByIdApi(id);
      setEditingId(user.id);
      setModalData({
        email: user.email,
        password: '', // Password not shown
        name: user.name,
        surname: user.surname || '',
        privacyAccepted: true, // Assuming true for existing users
        policyAccepted: true,
        active: user.active
      });
      setShowModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Impossibile recuperare i dati dell\'utente');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleManageRoles = (id: number) => {
    setRolesUserId(id);
    setShowRolesModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setModalData({
      email: '',
      password: '',
      name: '',
      surname: '',
      privacyAccepted: true,
      policyAccepted: true,
      active: true
    });
  };

  const handleModalSubmit = async (data: CreateUserPayload & { password?: string }) => {
    try {
      if (editingId) {
        // For update, only send password if it's not empty
        const updateData: any = {
            name: data.name,
            surname: data.surname,
            privacyAccepted: data.privacyAccepted,
            policyAccepted: data.policyAccepted
        };
        if (data.password) {
            updateData.password = data.password;
        }
        await updateUserApi(editingId, updateData);
        toast.success('Utente aggiornato con successo');
      } else {
        await createUserApi(data as CreateUserPayload);
        toast.success('Utente creato con successo');
      }
      handleCloseModal();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operazione fallita');
      throw err; // Re-throw to let modal handle loading state if needed
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteUserApi(deletingId);
      toast.success('Utente eliminato con successo');
      setShowDeleteModal(false);
      fetchUsers();
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
        <h2 className="mb-0">Gestione Utenti</h2>
        <Button variant="primary" onClick={handleShowCreate}>
          <FaPlus className="me-2" /> Nuovo Utente
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
              placeholder="Cerca utente per nome, cognome o email..."
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
                    onClick={() => handleSort('name')}
                  >
                    Nome {renderSortIcon('name')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSort('surname')}
                  >
                    Cognome {renderSortIcon('surname')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSort('email')}
                  >
                    Email {renderSortIcon('email')}
                  </th>
                  <th>Stato Email</th>
                  <th>Stato Account</th>
                  <th className="text-end">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      Nessun utente trovato
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.surname}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.isVerified ? (
                          <Badge bg="success">Verificato</Badge>
                        ) : (
                          <Badge bg="warning" text="dark">Non Verificato</Badge>
                        )}
                      </td>
                      <td>
                        {user.active ? (
                          <Badge bg="success">Attivo</Badge>
                        ) : (
                          <Badge bg="danger">Disattivato</Badge>
                        )}
                      </td>
                      <td className="text-end">
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="me-2"
                          title="Gestisci Ruoli"
                          onClick={() => handleManageRoles(user.id)}
                        >
                          <FaUserShield />
                        </Button>

                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleShowEdit(user.id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(user.id)}
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
                  Visualizzati {users.length} di {totalItems} risultati
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

      <UserModal
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
        message="Sei sicuro di voler eliminare questo utente? L'operazione non è reversibile."
        confirmLabel="Elimina"
        variant="danger"
      />

      <UsersRuoliModal 
        show={showRolesModal} 
        onClose={() => setShowRolesModal(false)} 
        userId={rolesUserId} 
      />
    </Container>
  );
};

export default Utenti;
