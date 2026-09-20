import { FiInfo } from 'react-icons/fi';

/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {JSX.Element} Componente que muestra información importante sobre los roles de usuario.
*/
export default function ImportantInformation({ onClose }) {

	return (

		<div className="important-information-overlay" onClick={onClose}>

      {/* Contenedor del modal de información importante */}
			<div
				className="important-information-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="important-information-title"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="important-information-icon">
					<FiInfo />
				</div>
				<h2 id="important-information-title">Información importante</h2>
				<p>
					ES IMPORTANTE COMENTAR QUE HICE UN CAMBIO CON RESPECTO A LAS PETICIONES QUE ME PUSIERON 
          EN EL PDF YA QUE NO CREE SOLO 2 ROLES; HICE 3 PARA DARLE SENTIDO A LOS NOMBRES DE LOS MISMOS
          EL ROL ADMIN PUEDE HACER TODO NO TIENE RESTRICCIONES,
          EL ROL EDITOR SOLO PUEDE EDITAR LOS PERSONAJES NADA MAS ALLA, 
          Y EL ROL LECTOR SOLO PUEDE VER LOS PERSONAJES SIN PODER MODIFICAR NADA.
				</p>
				<button type="button" className="important-information-btn" onClick={onClose}>
					Aceptar
				</button>
			</div>

		</div>

	);

}
