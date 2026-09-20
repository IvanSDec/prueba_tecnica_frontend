import { useNavigate } from 'react-router-dom';

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Vista 404.
*/
export default function NotFound() {
  const navigate = useNavigate();

  return (

    <div className="auth-background">

      <div className="notfound-container">

        <div className="notfound-card">

          <span className="notfound-code">404</span>
          
          <div className="notfound-divider"></div>

          <h2>
            Esta sección aun no existe contratenme para continuar con su desarrollo 😊
          </h2>

          <button
            type="button"
            className="btn-primary btn-404"
            onClick={() => navigate('/')}
          >
            Volver al Inicio
          </button>

        </div>

      </div>

    </div>

  );

}