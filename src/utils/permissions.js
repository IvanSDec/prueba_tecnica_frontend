export const USER_ROLES = {
  ADMIN: 1,
  EDITOR: 2,
  READ_ONLY: 3,
};

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export function getUserRole(user = getStoredUser()) {
  const role = Array.isArray(user.roles) ? user.roles[0] : user.roles;
  const detailRole = Array.isArray(user.roles_detail) ? user.roles_detail[0]?.id : null;
  return Number(role ?? detailRole) || null;
}

export function hasRole(allowedRoles, user = getStoredUser()) {
  return allowedRoles.includes(getUserRole(user));
}

export function canManageUsers(user = getStoredUser()) {
  return getUserRole(user) === USER_ROLES.ADMIN;
}

export function canManageCharacters(user = getStoredUser()) {
  return [USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(getUserRole(user));
}