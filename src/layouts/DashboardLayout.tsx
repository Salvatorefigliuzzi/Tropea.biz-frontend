import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { logoutUser } from '../features/auth/authSlice';
import { FaRocket, FaSignOutAlt, FaUserCircle, FaBars } from 'react-icons/fa';
import * as AllFaIcons from 'react-icons/fa';

const DashboardLayout: React.FC = () => {
  const { user, groups, permissionsList } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const perms = permissionsList || [];
  const canAccessAccount = perms.includes('users.me.read') || perms.includes('users.me.update');
  const canAccessUsers = perms.some((p) => p.startsWith('users.') && !p.startsWith('users.me.'));
  const canAccessRuoli = perms.some((p) => p.startsWith('ruoli.'));
  const canAccessPermessi = perms.some((p) => p.startsWith('permessi.'));
  const canAccessGruppi = perms.some((p) => p.startsWith('gruppi.'));

  const sortedGroups = [...groups].sort((a, b) => (a.ordine || 0) - (b.ordine || 0));
  const filteredGroups = sortedGroups.filter((group) => {
    if (group.nome === 'Users') {
      return canAccessUsers;
    }
    if (group.nome === 'Ruoli') {
      return canAccessRuoli;
    }
    if (group.nome === 'Permessi') {
      return canAccessPermessi;
    }
    if (group.nome === 'Gruppi') {
      return canAccessGruppi;
    }
    return true;
  });

  const hasAdminModules = filteredGroups.length > 0;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      {/* Sidebar */}
      <div 
        className={`bg-white border-end d-flex flex-column transition-all ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}
        style={{ 
          width: sidebarOpen ? '280px' : '80px', 
          minWidth: sidebarOpen ? '280px' : '80px',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div className={`p-4 border-bottom d-flex align-items-center ${sidebarOpen ? 'justify-content-between' : 'justify-content-center'}`}>
          <Link to="/dashboard" className="text-decoration-none d-flex align-items-center gap-2 text-primary fw-bold fs-5">
            <FaRocket size={sidebarOpen ? undefined : 28} /> {sidebarOpen && 'MyApp'}
          </Link>
        </div>
        
        <div className="flex-grow-1 overflow-auto p-3">
          {sidebarOpen && (
            <small className="text-muted text-uppercase fw-bold px-3 mb-2 d-block" style={{ fontSize: '0.75rem' }}>
              Menu
            </small>
          )}
          <Nav className="flex-column gap-1">
            <Nav.Link 
              as={Link}
              to="/dashboard"
              active={location.pathname === '/dashboard'}
              className={`rounded px-3 py-2 d-flex align-items-center ${sidebarOpen ? 'gap-2' : 'justify-content-center'} ${location.pathname === '/dashboard' ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
              title={!sidebarOpen ? "Dashboard" : undefined}
            >
              <FaRocket size={sidebarOpen ? undefined : 24} /> {sidebarOpen && 'Dashboard'}
            </Nav.Link>

            {canAccessAccount && (
              <>
                {sidebarOpen && <div className="my-2 border-top"></div>}
                {sidebarOpen && (
                  <small className="text-muted text-uppercase fw-bold px-3 mb-2 d-block" style={{ fontSize: '0.75rem' }}>
                    Account
                  </small>
                )}
                <Nav.Link
                  as={Link}
                  to="/dashboard/account"
                  active={location.pathname === '/dashboard/account'}
                  className={`rounded px-3 py-2 d-flex align-items-center ${sidebarOpen ? 'gap-2' : 'justify-content-center'} ${location.pathname === '/dashboard/account' ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                  title={!sidebarOpen ? "Il mio account" : undefined}
                >
                  <FaUserCircle size={sidebarOpen ? undefined : 24} /> {sidebarOpen && 'Il mio account'}
                </Nav.Link>
              </>
            )}

            {hasAdminModules && (
              <>
                {sidebarOpen && <div className="my-2 border-top"></div>}
                {sidebarOpen && (
                  <small className="text-muted text-uppercase fw-bold px-3 mb-2 d-block" style={{ fontSize: '0.75rem' }}>
                    Amministrazione
                  </small>
                )}
                {filteredGroups.map((group) => {
                  const path = `/dashboard/${group.nome}`;
                  const isActive = location.pathname === path;

                  // @ts-ignore
                  const DynamicIcon = group.icona && AllFaIcons[group.icona] ? AllFaIcons[group.icona] : FaRocket;

                  return (
                    <Nav.Link
                      key={group.id}
                      as={Link}
                      to={path}
                      active={isActive}
                      className={`rounded px-3 py-2 d-flex align-items-center ${sidebarOpen ? 'gap-2' : 'justify-content-center'} ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                      title={!sidebarOpen ? (group.alias || group.nome) : undefined}
                    >
                      <DynamicIcon size={sidebarOpen ? undefined : 24} />
                      {sidebarOpen && <span>{group.alias || group.nome}</span>}
                    </Nav.Link>
                  );
                })}
              </>
            )}
          </Nav>
        </div>

        <div className="p-3 border-top">
          <div className={`d-flex align-items-center ${sidebarOpen ? 'gap-3' : 'justify-content-center'} p-2 rounded bg-light`}>
            <FaUserCircle size={32} className="text-secondary" />
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="fw-bold text-truncate">{user?.name}</div>
                <div className="small text-muted text-truncate">{user?.email}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column h-100 overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
          <Button variant="link" className="text-dark p-0" onClick={toggleSidebar}>
            {sidebarOpen ? <FaBars size={20} /> : <FaBars size={20} />}
          </Button>
          
          <div className="d-flex align-items-center gap-3">
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleLogout} 
              className="d-flex align-items-center justify-content-center p-2 rounded-circle"
              title="Logout"
              style={{ width: '32px', height: '32px' }}
            >
              <FaSignOutAlt />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
