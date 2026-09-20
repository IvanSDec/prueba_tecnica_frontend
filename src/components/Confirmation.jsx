/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente de confirmación reutilizable.
*/
export default function Confirmation({
    title = 'Confirmar acción',
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    danger = false,
    loading = false,
}) {

    return (

        <div className="confirmation-overlay" onClick={loading ? undefined : onCancel}>

            {/* Tarjeta de confirmación que detiene la propagación del clic para evitar cerrar el modal al hacer clic dentro de él. */}
            <div className="confirmation-card" onClick={(event) => event.stopPropagation()}>

                <span className="confirmation-eyebrow">Confirmación</span>

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="confirmation-actions">

                    <button type="button" onClick={onCancel} disabled={loading}>Cancelar</button>
                    <button type="button" className={danger ? 'confirmation-danger' : ''} onClick={onConfirm} disabled={loading}>
                        {loading ? 'Procesando...' : confirmText}
                    </button>

                </div>

            </div>
            
        </div>

    );

}