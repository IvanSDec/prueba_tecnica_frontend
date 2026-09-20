import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute, { RoleProtectedRoute } from './components/ProtectedRoute';
import Users from './pages/Users';
import Extra from './pages/Extra';
import { USER_ROLES } from './utils/permissions';

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente principal de la aplicación con configuración de rutas y protección de rutas.
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}><Users /></RoleProtectedRoute>} />
          <Route path="/extra" element={<RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}><Extra /></RoleProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;