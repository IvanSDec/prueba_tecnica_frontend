import { Navigate, Outlet } from 'react-router-dom';
import { isValidToken } from '../utils/auth';
import { hasRole } from '../utils/permissions';
import Sidebar from './Slidebar';

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Estructura protegida con Sidebar si el usuario está autenticado, de lo contrario redirige al login.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('access_token');

  //* Verifica si el token es válido; si no lo es, limpia el almacenamiento local y redirige al login.
  if (!isValidToken(token)) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }

  //* Verifica si el usuario tiene los roles permitidos; si no los tiene, redirige a la página de inicio.
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/home" replace />;
  }

  return (

    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>

      <Sidebar />

      <main className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children ? children : <Outlet />}
      </main>

    </div>

  );

}

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente que protege rutas según los roles del usuario.
*/
export function RoleProtectedRoute({ children, allowedRoles }) {

  //* Verifica si el usuario tiene los roles permitidos; si no los tiene, redirige a la página de inicio.
  if (!hasRole(allowedRoles)) {
    return <Navigate to="/home" replace />;
  }

  return children;

}