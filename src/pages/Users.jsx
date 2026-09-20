import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiInfo, FiMail, FiPlus, FiUsers } from 'react-icons/fi';
import api from '../api/axios';
import Loader from '../components/Loader';
import NewUser from '../components/User/NewUser';
import EditUser from '../components/User/EditUser';
import ImportantInformation from '../components/User/ImportantInformation';

//* Funciones auxiliares para obtener información del usuario. */
const getUserName = (user) => {
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return fullName || user.username || user.name || user.email || 'Sin nombre';
};

//* Funciones auxiliares para obtener el rol y las iniciales del usuario. */
const ROLE_NAMES = {
  1: 'Administrador',
  2: 'Editor',
  3: 'Lectura',
};

//* Función auxiliar para obtener el rol del usuario. */
const getUserRole = (user) => {
  const apiRole = Array.isArray(user.roles) ? user.roles[0] : user.roles;
  if (apiRole !== undefined && apiRole !== null) {
    return ROLE_NAMES[apiRole] || ROLE_NAMES[Number(apiRole)] || `Rol ${apiRole}`;
  }
  if (user.is_superuser) return 'Administrador';
  if (user.is_staff) return 'Moderador';
  return user.role || 'Usuario';
};

//* Función auxiliar para obtener las iniciales del usuario. */
const getInitials = (user) => getUserName(user).slice(0, 2).toUpperCase();

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente de administración de usuarios.
*/
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showImportantInformation, setShowImportantInformation] = useState(false);

  //* Función para obtener la lista de usuarios desde la API. */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('users/list/', { params: { page } });
      const data = response.data;
      const result = Array.isArray(data) ? data : data?.results || [];
      setUsers(result);
      setTotalPages(data?.count ? Math.max(1, Math.ceil(data.count / 10)) : 1);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setErrorMsg('No se pudieron cargar los usuarios. Inténtalo de nuevo.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  //* Efecto para cargar la lista de usuarios al montar el componente y cuando cambie la página. */
  useEffect(() => {
    const loadUsers = window.setTimeout(() => fetchUsers(), 0);
    return () => window.clearTimeout(loadUsers);
  }, [fetchUsers]);

  return (

    <div className="users-container">

      {/* Encabezado de la sección de administración de usuarios. */}
      <header className="users-header">

        <div>
          <span className="eyebrow">Administración</span>
          <div className="users-title-row">
            <h1>Usuarios</h1>
            <button
              type="button"
              className="users-info-btn"
              onClick={() => setShowImportantInformation(true)}
              title="Ver información importante"
              aria-label="Ver información importante"
            >
              <FiInfo />
            </button>
          </div>
          <p>Gestiona el acceso y el estado de las cuentas de tu aplicación.</p>
        </div>

        <div className="users-header-actions">
          <button type="button" className="users-add-btn" title="Crear usuario" onClick={() => setShowNewModal(true)}>
            <FiPlus />
            Nuevo usuario
          </button>
        </div>

      </header>

      {/* Panel que contiene la tabla de usuarios y la paginación. */}
      <section className="users-panel">
        <div className="users-panel-heading">
          <div><h2>Directorio de usuarios</h2></div>
          <span className="users-count-badge">Página {page} de {totalPages}</span>
        </div>

        {loading ? <div className="users-loader"><Loader text="Cargando usuarios..." /></div> : errorMsg ? <div className="users-message error-badge">{errorMsg}</div> : users.length === 0 ? <div className="users-message"><FiUsers /><p>No hay usuarios registrados.</p></div> : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Registro</th><th aria-label="Acciones">Acciones</th></tr></thead>
              <tbody>{users.map((user) => (
                <tr key={user.id || user.username || user.email}>
                  <td><div className="user-identity"><span className="user-avatar">{getInitials(user)}</span><div><strong>{getUserName(user)}</strong><span><FiMail />{user.email || 'Correo no disponible'}</span></div></div></td>
                  <td><span className={`role-badge ${getUserRole(user).toLowerCase()}`}>{getUserRole(user)}</span></td>
                  <td className="date-cell">{user.date_joined ? new Date(user.date_joined).toLocaleDateString('es-ES') : 'Sin fecha'}</td>
                  <td><button type="button" className="table-action-btn" title={`Editar ${getUserName(user)}`} onClick={() => setEditingUser(user)}><FiEdit2 /> Editar</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {!loading && !errorMsg && users.length > 0 && <div className="users-pagination"><span>Mostrando {users.length} usuarios</span><div><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Anterior</button><button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Siguiente</button></div></div>}
      </section>

      {/* Modales para crear y editar usuarios, así como información importante. */}
      {showNewModal && (
        <NewUser
          onClose={() => setShowNewModal(false)}
          onCreated={fetchUsers}
        />
      )}

      {/* Modal para crear un nuevo usuario. */}
      {editingUser && (
        <EditUser
          key={editingUser.id}
          user={editingUser}
          users={users}
          onClose={() => setEditingUser(null)}
          onUpdated={fetchUsers}
        />
      )}

      {/* Modal para editar un usuario existente. */}
      {showImportantInformation && (
        <ImportantInformation onClose={() => setShowImportantInformation(false)} />
      )}

    </div>

  );

}