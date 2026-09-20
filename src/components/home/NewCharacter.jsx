import { useState } from 'react';
import api from '../../api/axios';
import { SPECIES_ES, STATUS_ES, GENDER_ES } from '../../utils/characterOptions';
import Confirmation from '../Confirmation';

const EMPTY_FORM = {
  name: '',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  image: '',
  location: '',
  episodes: [],
};

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Modal con formulario para crear un personaje nuevo.
 */
export default function NewCharacter({ locations, episodes, onClose, onCreated }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [episodeToAdd, setEpisodeToAdd] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const assignedEpisodes = episodes.filter((ep) => formData.episodes.includes(ep.id));
  const availableEpisodes = episodes.filter((ep) => !formData.episodes.includes(ep.id));

  const handleAddEpisode = () => {
    if (!episodeToAdd) return;
    setFormData({ ...formData, episodes: [...formData.episodes, Number(episodeToAdd)] });
    setEpisodeToAdd('');
  };

  const handleRemoveEpisode = (episodeId) => {
    setFormData({
      ...formData,
      episodes: formData.episodes.filter((id) => id !== episodeId),
    });
  };

  const handleCreate = async () => {
    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        location: formData.location ? Number(formData.location) : null,
        is_custom: true,
        is_active: true,
      };
      await api.post('character/create/', payload);
      onCreated();
      onClose();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.detail || 'No se pudo crear el personaje. Verifica los datos.'
      );
    } finally {
      setSaving(false);
      setShowConfirmation(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Personaje</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {errorMsg && <div className="error-badge">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form-grid">
            <div className="modal-form-main">
              <div className="input-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre del personaje"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Estado</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    {Object.entries(STATUS_ES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Especie</label>
                  <select name="species" value={formData.species} onChange={handleChange}>
                    {Object.entries(SPECIES_ES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Género</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    {Object.entries(GENDER_ES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Tipo</label>
                  <input
                    type="text"
                    name="type"
                    placeholder="Ej. Genius"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Ubicación</label>
                <select name="location" value={formData.location} onChange={handleChange}>
                  <option value="">Sin ubicación</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Episodios</label>
                <ul className="episode-tag-list">
                  {assignedEpisodes.length === 0 && (
                    <li className="episode-tag-empty">Sin episodios asignados</li>
                  )}
                  {assignedEpisodes.map((ep) => (
                    <li key={ep.id} className="episode-tag">
                      <span>{ep.episode ? `${ep.episode} - ${ep.name}` : ep.name}</span>
                      <button
                        type="button"
                        className="episode-tag-remove"
                        onClick={() => handleRemoveEpisode(ep.id)}
                        title="Quitar episodio"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="episode-add-row">
                  <select value={episodeToAdd} onChange={(e) => setEpisodeToAdd(e.target.value)}>
                    <option value="">Agregar episodio...</option>
                    {availableEpisodes.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        {ep.episode ? `${ep.episode} - ${ep.name}` : ep.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn-secondary" onClick={handleAddEpisode}>
                    Añadir
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-form-aside">
              <div className="input-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              <div className="image-preview">
                {formData.image ? (
                  <img src={formData.image} alt="Vista previa" />
                ) : (
                  <span className="image-preview-placeholder">Sin imagen</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear Personaje'}
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <Confirmation
          title="Crear personaje"
          message="¿Deseas crear este personaje con los datos proporcionados?"
          confirmText="Crear personaje"
          onConfirm={handleCreate}
          onCancel={() => setShowConfirmation(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
