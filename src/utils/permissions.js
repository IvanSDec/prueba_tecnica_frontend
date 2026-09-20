//* Definición de los roles de usuario. */
export const USER_ROLES = {
  ADMIN: 1,
  EDITOR: 2,
  READ_ONLY: 3,
};

//* Funciones para obtener información del usuario almacenado y sus permisos. */
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

//* Función para obtener el rol del usuario. */
export function getUserRole(user = getStoredUser()) {
  const role = Array.isArray(user.roles) ? user.roles[0] : user.roles;
  const detailRole = Array.isArray(user.roles_detail) ? user.roles_detail[0]?.id : null;
  return Number(role ?? detailRole) || null;
}

//* Función para verificar si el usuario tiene alguno de los roles permitidos. */
export function hasRole(allowedRoles, user = getStoredUser()) {
  return allowedRoles.includes(getUserRole(user));
}

//* Función para verificar si el usuario puede gestionar otros usuarios. */
export function canManageUsers(user = getStoredUser()) {
  return getUserRole(user) === USER_ROLES.ADMIN;
}

//* Función para verificar si el usuario puede gestionar personajes. */
export function canManageCharacters(user = getStoredUser()) {
  return [USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(getUserRole(user));
}