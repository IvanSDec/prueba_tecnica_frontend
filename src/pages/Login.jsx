import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente de Login y Registro con pantalla de carga e integración con React Router.
*/
export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '',
    phone_number: '',
  });

  //* Maneja el envío del formulario de inicio de sesión.
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  //* Maneja el envío del formulario de registro.
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  //* Maneja el envío del formulario de inicio de sesión.
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const [response] = await Promise.all([
        api.post('users/token/', loginData),
        minDelay,
      ]);
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/home');
    } catch (error) {
      await minDelay;
      setErrorMsg(
        error.response?.data?.detail || 'Credenciales inválidas. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  //* Maneja el envío del formulario de registro.
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const payload = { ...registerData };
      if (!payload.birth_date) delete payload.birth_date;
      const registerAndLoginProcess = (async () => {
        await api.post('users/create/', payload);
        return await api.post('users/token/', {
          email: registerData.email,
          password: registerData.password,
        });
      })();
      const [loginRes] = await Promise.all([
        registerAndLoginProcess,
        minDelay,
      ]);
      const { access, refresh, user } = loginRes.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/home');
    } catch (error) {
      await minDelay;
      setErrorMsg(
        error.response?.data?.email?.[0] ||
          'Error al crear la cuenta. Verifica los datos.'
      );
    } finally {
      setLoading(false);
    }
  };

  //* Alterna entre los modos de inicio de sesión y registro.
  const toggleMode = () => {
    setErrorMsg('');
    setIsRegister(!isRegister);
  };

  return (

    <div className="auth-background">

      <div className={`auth-container ${isRegister ? 'right-panel-active' : ''}`}>
        
        {/* Contenedor de los formularios de inicio de sesión y registro. */}
        {loading && (
          <div className="loading-overlay">
            <Loader />
          </div>
        )}

        {/* Formulario de inicio de sesión. */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <h2>Iniciar Sesión</h2>
            <p className="form-subtitle">Ingresa a tu panel de administración</p>

            {errorMsg && !isRegister && <div className="error-badge">{errorMsg}</div>}

            <div className="input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Cargando...' : 'Entrar'}
            </button>

            <button type="button" className="mobile-toggle" onClick={toggleMode} disabled={loading}>
              ¿No tienes cuenta? Regístrate
            </button>
          </form>
        </div>

        {/* Formulario de registro. */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <h2>Crear Cuenta</h2>
            <p className="form-subtitle">Únete para gestionar personajes y roles</p>

            {errorMsg && isRegister && <div className="error-badge">{errorMsg}</div>}

            <div className="input-row">
              <div className="input-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Nombre"
                  value={registerData.first_name}
                  onChange={handleRegisterChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Apellido"
                  value={registerData.last_name}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="birth_date"
                  value={registerData.birth_date}
                  onChange={handleRegisterChange}
                />
              </div>

              <div className="input-group">
                <label>Teléfono</label>
                <input
                  type="number"
                  name="phone_number"
                  placeholder="5512345678"
                  value={registerData.phone_number}
                  onChange={handleRegisterChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <button type="button" className="mobile-toggle" onClick={toggleMode} disabled={loading}>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </form>
        </div>

        {/* Contenedor de la superposición que contiene los paneles de información y los botones de alternancia. */}
        <div className="overlay-container">

          <div className="overlay">

            <div className="overlay-panel overlay-left">
              <h2>¿Ya tienes una cuenta?</h2>
              <p>Ingresa tus datos para continuar con tu sesión</p>
              <button type="button" className="btn-ghost" onClick={toggleMode} disabled={loading}>
                Iniciar Sesión
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h2>¿Aún no tienes una cuenta?</h2>
              <p>Regístrate en el siguiente apartado</p>
              <button type="button" className="btn-ghost" onClick={toggleMode} disabled={loading}>
                Regístrate
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>

  );

}