export default function CounterNewCharacters({ count }) {
  return (
    <div className="extra-counter" aria-live="polite">
      <strong>{count}</strong>
      <span>personajes nuevos agregados</span>
    </div>
  );
}