/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente que muestra el contador de nuevos personajes.
*/
export default function CounterNewCharacters({ count }) {

  return (

    <div className="extra-counter" aria-live="polite">
      <strong>{count}</strong>
      <span>personajes nuevos agregados</span>
    </div>

  );

}