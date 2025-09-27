export const ALLOWED_ROLES = new Set(['ADMIN', 'SUPERADMIN']);

export const isRoleAllowed = (role) => ALLOWED_ROLES.has(role);
