import { useState } from 'react';
import api from '../../api/axios';
import Confirmation from '../Confirmation';

const ROLE_OPTIONS = [
	{ value: 1, label: 'Administrador' },
	{ value: 2, label: 'Editor' },
	{ value: 3, label: 'Lectura' },
];

const getRoleValue = (user) => {
	const role = Array.isArray(user.roles) ? user.roles[0] : user.roles;
	return String(role || (user.is_superuser ? 1 : user.is_staff ? 2 : 3));
};

export default function EditUser({ user, users, onClose, onUpdated }) {
	const initialRole = getRoleValue(user);
	const isAdministrator = initialRole === '1';
	const administratorCount = users.filter((currentUser) => getRoleValue(currentUser) === '1').length;
	const isLastAdministrator = isAdministrator && administratorCount <= 1;
	const [formData, setFormData] = useState({
		first_name: user.first_name || '',
		last_name: user.last_name || '',
		email: user.email || '',
		birth_date: user.birth_date || '',
		phone_number: user.phone_number || '',
		role: initialRole,
	});
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [confirmation, setConfirmation] = useState(null);

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleUpdate = async () => {
		setSaving(true);
		setErrorMsg('');

		try {
			const payload = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				birth_date: formData.birth_date,
				phone_number: formData.phone_number,
				roles: [Number(formData.role)],
			};

			if (isLastAdministrator && formData.role !== '1') {
				setErrorMsg('Debe existir al menos un administrador.');
				return;
			}

			await api.patch(`users/${user.id}/`, payload);
			await onUpdated();
			onClose();
		} catch (error) {
			setErrorMsg(
				error.response?.data?.detail || 'No se pudo actualizar el usuario. Verifica los datos.'
			);
		} finally {
			setSaving(false);
			setConfirmation(null);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setConfirmation({
			title: 'Guardar cambios',
			message: '¿Deseas guardar los cambios realizados en este usuario?',
			confirmText: 'Guardar cambios',
			danger: false,
			action: handleUpdate,
		});
	};

	const handleDelete = async () => {
		if (isLastAdministrator) {
			setErrorMsg('No se puede eliminar al último administrador.');
			return;
		}

		setDeleting(true);
		setErrorMsg('');

		try {
			await api.delete(`users/${user.id}/`);
			await onUpdated();
			onClose();
		} catch (error) {
			setErrorMsg(error.response?.data?.detail || 'No se pudo eliminar el usuario.');
		} finally {
			setDeleting(false);
			setConfirmation(null);
		}
	};

	const requestDelete = () => {
		setConfirmation({
			title: 'Eliminar usuario',
			message: `¿Seguro que deseas eliminar a ${user.first_name || user.username}? Esta acción no se puede deshacer.`,
			confirmText: 'Eliminar usuario',
			danger: true,
			action: handleDelete,
		});
	};

	return (
		<div className="user-modal-overlay" onClick={onClose}>
			<div className="user-modal-card edit-user-modal" onClick={(event) => event.stopPropagation()}>
				<div className="user-modal-header">
					<div>
						<span className="user-modal-eyebrow">Administración</span>
						<h2>Editar usuario</h2>
					</div>
					<button type="button" className="user-modal-close" onClick={onClose}>&times;</button>
				</div>

				{isLastAdministrator && <div className="user-modal-notice">Este es el último administrador. No puedes cambiar su rol ni eliminarlo.</div>}
				{errorMsg && <div className="user-modal-error">{errorMsg}</div>}

				<form onSubmit={handleSubmit} className="user-modal-form">
					<div className="edit-user-fields">
						<div className="user-input-group">
							<label htmlFor="edit-first-name">Nombre</label>
							<input id="edit-first-name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
						</div>

						<div className="user-input-group">
							<label htmlFor="edit-last-name">Apellidos</label>
							<input id="edit-last-name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
						</div>

						<div className="user-input-group user-input-wide">
							<label htmlFor="edit-email">Correo electrónico</label>
							<input id="edit-email" type="email" name="email" value={formData.email} disabled required />
						</div>

						<div className="user-input-group">
							<label htmlFor="edit-birth-date">Fecha de nacimiento</label>
							<input id="edit-birth-date" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
						</div>

						<div className="user-input-group">
							<label htmlFor="edit-phone">Teléfono</label>
							<input id="edit-phone" type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
						</div>

						<div className="user-input-group user-input-wide">
							<label htmlFor="edit-role">Rol</label>
							<select id="edit-role" name="role" value={formData.role} onChange={handleChange} disabled={isLastAdministrator}>
								{ROLE_OPTIONS.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
							</select>
						</div>
					</div>

					<div className="user-modal-actions user-modal-actions-split">
						<button type="button" className="user-btn-danger" onClick={requestDelete} disabled={saving || deleting || isLastAdministrator}>
							{deleting ? 'Eliminando...' : 'Eliminar usuario'}
						</button>

						<div className="user-modal-actions">
						<button type="button" className="user-btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
						<button type="submit" className="user-btn-primary" disabled={saving || deleting}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
						</div>
					</div>
				</form>
			</div>

			{confirmation && (
				<Confirmation
					title={confirmation.title}
					message={confirmation.message}
					confirmText={confirmation.confirmText}
					danger={confirmation.danger}
					onConfirm={confirmation.action}
					onCancel={() => setConfirmation(null)}
					loading={saving || deleting}
				/>
			)}
		</div>
	);
}
