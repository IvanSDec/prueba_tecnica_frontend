import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GrCatalog } from "react-icons/gr";
import { CiStar } from "react-icons/ci";
import { FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { canManageUsers, getStoredUser } from '../utils/permissions';

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente de la barra lateral con navegación y control de acceso según permisos.
*/
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const canAccessAdministration = canManageUsers(getStoredUser());

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  //* Maneja el cierre de sesión del usuario, eliminando los tokens y la información del usuario del almacenamiento local y redirigiendo al login.
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <>
    
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeSidebar}
      />

      {/* Barra lateral que contiene la navegación y el pie de página. */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>

        <div className="sidebar-brand">
          <img src="/madss.png" alt="Logo" />
          <h2>Prueba Iván S.</h2>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink 
                to="/home" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeSidebar}
              >
                <span className="nav-icon"><GrCatalog /></span>
                <span className="nav-text">Catálogo</span>
              </NavLink>
            </li>
            {canAccessAdministration && (
            <li>
              <NavLink 
                to="/users" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeSidebar}
              >
                <span className="nav-icon"><FaUsers /></span>
                <span className="nav-text">Usuarios</span>
              </NavLink>
            </li>
            )}
            {canAccessAdministration && (
            <li>
              <NavLink 
                to="/extra" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeSidebar}
              >
                <span className="nav-icon"><CiStar /></span>
                <span className="nav-text">Extra</span>
              </NavLink>
            </li>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="nav-link logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><IoLogOutOutline /></span>
            <span className="nav-text">Cerrar Sesión</span>
          </button>
        </div>

      </aside>

    </>

  );

}