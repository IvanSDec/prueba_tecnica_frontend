import { useState } from 'react';
import { FiRefreshCw, FiX } from 'react-icons/fi';
import api from '../api/axios';
import CounterNewCharacters from '../components/extra/counterNewCharacters';

//* Obtiene el número de personajes nuevos agregados a partir de los posibles campos en la respuesta de la API. */
const getAddedCharacters = (data) => {
  const possibleValues = [
    data?.new_characters_added,
    data?.new_characters,
    data?.new_characters_count,
    data?.added,
    data?.created,
    data?.count,
    data?.total_added,
  ];
  const value = possibleValues.find((item) => typeof item === 'number');
  return value ?? 0;
};

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Página de mantenimiento para actualizar personajes.
*/
export default function Extra() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  //* Maneja la sincronización de personajes con la API original.
  const handleSync = async () => {
    setSyncing(true);
    setErrorMsg('');

    try {
      const response = await api.post('character/sync/');
      setSyncResult({
        added: getAddedCharacters(response.data),
        data: response.data,
      });
    } catch (error) {
      setErrorMsg(
        error.response?.data?.detail || 'No se pudieron actualizar los personajes. Inténtalo de nuevo.'
      );
    } finally {
      setSyncing(false);
    }
  };

  return (

    <div className="extra-container">

      {/* Panel principal de mantenimiento para actualizar personajes. */}
      <section className="extra-panel">
        <div className="extra-heading">
          <span className="extra-eyebrow">Mantenimiento</span>
          <h1>Actualizar personajes</h1>
          <p>
            Los personajes se consultarán de nuevo a la API original, pero no se modificarán los
            personajes que ya fueron modificados por los usuarios. En su defecto, se traerán nuevos
            personajes para completar los 200 solicitados a la API original.
          </p>
        </div>

        <div className="extra-explanation">
          <p>
            Esta opción me parecia la mas realista en un caso de uso real en el que se desea mantener los cambios locales y solo agregar nuevos personajes disponibles.
          </p>
        </div>

        <button type="button" className="extra-sync-btn" onClick={handleSync} disabled={syncing}>
          <FiRefreshCw className={syncing ? 'extra-spinning' : ''} />
          {syncing ? 'Actualizando personajes...' : 'Actualizar personajes'}
        </button>

        {errorMsg && <div className="extra-error">{errorMsg}</div>}
      </section>

      {/* Modal que muestra el resultado de la sincronización de personajes. */}
      {syncResult && (
        <div className="extra-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sync-result-title">
          <div className="extra-modal-card">
            <div className="extra-modal-header">
              <div>
                <span className="extra-eyebrow">Sincronización completada</span>
                <h2 id="sync-result-title">Personajes actualizados</h2>
              </div>
              <button type="button" className="extra-modal-close" onClick={() => setSyncResult(null)} title="Cerrar">
                <FiX />
              </button>
            </div>

            <CounterNewCharacters count={syncResult.added} />

            <p className="extra-modal-description">
              Se agregaron personajes nuevos sin sobrescribir los cambios realizados localmente.
            </p>

            <button type="button" className="extra-confirm-btn" onClick={() => setSyncResult(null)}>
              Aceptar
            </button>
          </div>
        </div>
      )}

    </div>

  );

}