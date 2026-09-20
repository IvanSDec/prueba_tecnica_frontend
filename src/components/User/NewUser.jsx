import { useState } from 'react';
import api from '../../api/axios';
import Confirmation from '../Confirmation';

const ROLE_OPTIONS = [
	{ value: 1, label: 'Administrador' },
	{ value: 2, label: 'Editor' },
	{ value: 3, label: 'Lectura' },
];

const EMPTY_FORM = {
	username: '',
	first_name: '',
	last_name: '',
	email: '',
	password: '',
	birth_date: '',
	phone_number: '',
	role: '2',
};

export default function NewUser({ onClose, onCreated }) {
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [saving, setSaving] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
		const [showConfirmation, setShowConfirmation] = useState(false);

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleCreate = async () => {
		setSaving(true);
		setErrorMsg('');

		try {
			const payload = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				password: formData.password,
				birth_date: formData.birth_date,
				phone_number: formData.phone_number,
				roles: [Number(formData.role)],
			};

			await api.post('users/', payload);
			await onCreated();
			onClose();
		} catch (error) {
			setErrorMsg(
				error.response?.data?.detail || 'No se pudo crear el usuario. Verifica los datos.'
			);
		} finally {
			setSaving(false);
			setShowConfirmation(false);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setShowConfirmation(true);
	};

	return (
		<div className="user-modal-overlay" onClick={onClose}>
			<div className="user-modal-card new-user-modal" onClick={(event) => event.stopPropagation()}>
				<div className="user-modal-header">
					<div>
						<span className="user-modal-eyebrow">Administración</span>

				{showConfirmation && (
					<Confirmation
						title="Crear usuario"
						message="¿Deseas crear este usuario con los datos proporcionados?"
						confirmText="Crear usuario"
						onConfirm={handleCreate}
						onCancel={() => setShowConfirmation(false)}
						loading={saving}
					/>
				)}
						<h2>Nuevo usuario</h2>
					</div>
					<button type="button" className="user-modal-close" onClick={onClose}>&times;</button>
				</div>

				{errorMsg && <div className="user-modal-error">{errorMsg}</div>}

				<form onSubmit={handleSubmit} className="user-modal-form">
					<div className="new-user-fields">

						<div className="user-input-group">
							<label htmlFor="new-first-name">Nombre</label>
							<input id="new-first-name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
						</div>

						<div className="user-input-group">
							<label htmlFor="new-last-name">Apellidos</label>
							<input id="new-last-name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
						</div>

						<div className="user-input-group user-input-wide">
							<label htmlFor="new-email">Correo electrónico</label>
							<input id="new-email" type="email" name="email" value={formData.email} onChange={handleChange} required />
						</div>

						<div className="user-input-group user-input-wide">
							<label htmlFor="new-password">Contraseña</label>
							<input id="new-password" type="password" name="password" value={formData.password} onChange={handleChange} minLength="8" required />
						</div>

						<div className="user-input-group">
							<label htmlFor="new-birth-date">Fecha de nacimiento</label>
							<input id="new-birth-date" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
						</div>

						<div className="user-input-group">
							<label htmlFor="new-phone">Teléfono</label>
							<input id="new-phone" type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
						</div>

						<div className="user-input-group user-input-wide">
							<label htmlFor="new-role">Rol</label>
							<select id="new-role" name="role" value={formData.role} onChange={handleChange}>
								{ROLE_OPTIONS.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
							</select>
						</div>
					</div>

					<div className="user-modal-actions">
						<button type="button" className="user-btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
						<button type="submit" className="user-btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Crear usuario'}</button>
					</div>
				</form>
			</div>
		</div>
	);
}
