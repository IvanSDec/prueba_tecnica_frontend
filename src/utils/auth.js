/**
 * @author Iván Sánchez
 * @updated 2026-09-19
 * @returns {boolean} valida si el token es válido y no ha expirado.
*/
//* Función para validar si un token JWT es válido y no ha expirado. */
export function isValidToken(token) {
  if (!token) return false;

  const parts = token.split('.');
  
  if (parts.length !== 3) return false; 

  try {

    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return false; 
      }
    }
    return true;

  } catch (error) {

    return false;

  }

}