import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import NewCharacter from '../components/home/NewCharacter';
import EditCharacter from '../components/home/EditCharacter';
import { SPECIES_ES, STATUS_ES } from '../utils/characterOptions';
import { canManageCharacters, getStoredUser } from '../utils/permissions';

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Vista del catálogo de personajes.
*/
export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const [locations, setLocations] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const canEditCharacters = canManageCharacters(getStoredUser());

  const extractList = (data) => (Array.isArray(data) ? data : data?.results || []);

  //* Efecto para obtener las opciones de ubicaciones y episodios al montar el componente. */
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [locationsRes, episodesRes] = await Promise.all([
          api.get('character/locations/'),
          api.get('character/episodes/'),
        ]);
        setLocations(extractList(locationsRes.data));
        setEpisodes(extractList(episodesRes.data));
      } catch (error) {
        console.error('Error al obtener ubicaciones/episodios:', error);
      }
    };
    fetchOptions();
  }, []);

  //* Función para obtener la lista de personajes desde la API. */
  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const params = {
        page: page,
      };
      if (searchTerm.trim()) params.name = searchTerm.trim();
      if (selectedSpecies) params.species = selectedSpecies;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedGender) params.gender = selectedGender;
      const response = await api.get('character/', { params });
      if (response.data.results) {
        setCharacters(response.data.results);
        setTotalCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / 10) || 1);
      } else if (Array.isArray(response.data)) {
        setCharacters(response.data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al obtener personajes:', error);
      setErrorMsg('No se pudieron cargar los personajes. Inténtalo de nuevo.');
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedSpecies, selectedStatus, selectedGender]);

  //* Efecto para obtener la lista de personajes cuando cambian los filtros o la página. */
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  //* Función para manejar el cambio de filtros. */
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  //* Función para restablecer los filtros a sus valores iniciales. */
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecies('');
    setSelectedStatus('');
    setSelectedGender('');
    setPage(1);
  };

  //* Función para abrir el detalle de un personaje. */
  const handleOpenDetail = (character) => {
    setEditingCharacter(character);
  };

  //* Función para obtener los números de página visibles en la paginación. */
  const getPageNumbers = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (

    <div className="home-container">
      
      {/* Encabezado de la sección del catálogo de personajes. */}
      <header className="home-header">
        <h1>Catálogo de Personajes</h1>
        <p>Bienvenido al catálogo de personajes</p>
        {canEditCharacters && (
          <button type="button" className="btn-add-character" onClick={() => setShowNewModal(true)}>
            + Agregar Personaje
          </button>
        )}
      </header>

      {/* Barra de filtros para buscar y filtrar personajes. */}
      <div className="filter-bar">
        <div className="filter-group search-input">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-group">
          <select value={selectedSpecies} onChange={handleFilterChange(setSelectedSpecies)}>
            <option value="">Todas las especies</option>
            <option value="Human">Humano</option>
            <option value="Alien">Alien</option>
            <option value="Humanoid">Humanoide</option>
            <option value="Robot">Robot</option>
            <option value="Mythological Creature">Criatura Mítica</option>
            <option value="Cronenberg">Cronenberg</option>
            <option value="Disease">Enfermedad</option>
            <option value="Animal">Animal</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>

        <div className="filter-group">
          <select value={selectedStatus} onChange={handleFilterChange(setSelectedStatus)}>
            <option value="">Todos los estados</option>
            <option value="Alive">Vivo (Alive)</option>
            <option value="Dead">Muerto (Dead)</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>

        <div className="filter-group">
          <select value={selectedGender} onChange={handleFilterChange(setSelectedGender)}>
            <option value="">Todos los géneros</option>
            <option value="Female">Femenino</option>
            <option value="Male">Masculino</option>
            <option value="Genderless">Sin género</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>

        {(searchTerm || selectedSpecies || selectedStatus || selectedGender) && (
          <button className="btn-reset" onClick={handleResetFilters}>
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Barra de paginación para navegar entre las páginas de personajes. */}
      <div className="pagination-bar">
            
        <button
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => setPage(1)}
          title="Ir al inicio"
        >
          &laquo;&laquo; Inicio
        </button>

        <button
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          title="Página anterior"
        >
          &laquo; Anterior
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              className={`pagination-number-btn ${p === page ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          title="Página siguiente"
        >
          Siguiente &raquo;
        </button>

        <button
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => setPage(totalPages)}
          title="Ir al final"
        >
          Final &raquo;&raquo;
        </button>
        
      </div>

      {/* Sección principal donde se muestran los personajes según los filtros y la paginación. */} 
      {loading ? (

        <div className="home-loader">
          <Loader text="Cargando personajes..." />
        </div>

      ) : errorMsg ? (

        <div className="error-badge center-badge">{errorMsg}</div>

      ) : characters.length === 0 ? (

        <div className="no-results">
          <p>No se encontraron personajes con los criterios seleccionados.</p>
        </div>

      ) : (

        <>

          <div className="character-grid">

            {characters.map((char) => (

              <div key={char.id} className="character-card">
                <div className="card-image-wrapper">
                  <img
                    src={char.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={char.name}
                    loading="lazy"
                  />
                  <span className={`status-badge ${char.status?.toLowerCase()}`}>
                    {STATUS_ES[char.status] || char.status}
                  </span>
                </div>

                <div className="card-body">
                  <h3 className="character-name" title={char.name}>
                    {char.name}
                  </h3>
                  <p className="character-species">{SPECIES_ES[char.species] || char.species}</p>

                  <button
                    type="button"
                    className="btn-card-action"
                    onClick={() => handleOpenDetail(char)}
                  >
                    Ver Información
                  </button>
                </div>
              </div>

            ))}

          </div>

        </>

      )}

      {/* Modales para crear y editar personajes. */}
      {canEditCharacters && showNewModal && (
        <NewCharacter
          locations={locations}
          episodes={episodes}
          onClose={() => setShowNewModal(false)}
          onCreated={fetchCharacters}
        />
      )}

      {/* Modal para crear un nuevo personaje. */}
      {editingCharacter && (
        <EditCharacter
          key={editingCharacter.id}
          character={editingCharacter}
          readOnly={!canEditCharacters}
          locations={locations}
          episodes={episodes}
          onClose={() => setEditingCharacter(null)}
          onUpdated={fetchCharacters}
          onDeleted={fetchCharacters}
        />
      )}

    </div>

  );

}