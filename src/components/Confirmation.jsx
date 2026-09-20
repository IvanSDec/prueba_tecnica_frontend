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