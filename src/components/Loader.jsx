/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente de indicador de carga global.
*/
export default function Loader() {

  return (

    <div className="loader-container">
      {/* Contenedor del indicador de carga global. */}
      <div className="spinner-glow"></div>
      <p className="loader-text">Prueba Madd Systems</p>
    </div>

  );

}