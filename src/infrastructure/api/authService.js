import httpClient from './httpClient';
import { isRoleAllowed } from '../../constants/auth';

const mapLoginResponse = (payload) => {
  if (!payload?.data) {
    throw new Error('Invalid response payload');
  }
  

  const { data } = payload;

  // Vérifier si on a le token (nécessaire pour l'authentification)
  if (!data.token) {
    throw new Error('Missing token in response');
  }

  // Gérer les rôles (peut être un tableau ou une chaîne)
  const roles = data.roles || (data.role ? [data.role] : []);
  const primaryRole = Array.isArray(roles) ? roles[0] : roles;

  // Vérifier qu'on a au moins un rôle
  if (!primaryRole) {
    throw new Error('Missing role in response');
  }

  return {
    token: data.token,
    refreshToken: data.refreshToken || null,
    user: {
      id: data.userId || data.id,
      email: data.email,
      fullName: data.fullName || data.name || '',
      role: primaryRole, // Prendre le premier rôle pour compatibilité
      roles: roles, // Garder tous les rôles
      phoneNumber: data.phoneNumber || null,
      notificationsEnabled: data.notificationsEnabled || false,
      profilePicture: data.profilePicture || null,
      profiles: data.profiles || []
    }
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const response = await httpClient.post('/auth/login', { email, password });
  const payload = response.data;

  const mapped = mapLoginResponse(payload);

  if (!isRoleAllowed(mapped.user.role)) {
    const error = new Error('Role not authorized');
    error.code = 'FORBIDDEN_ROLE';
    error.payload = payload;
    throw error;
  }

  return mapped;
};
