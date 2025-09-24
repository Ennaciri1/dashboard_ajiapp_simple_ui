import httpClient from './httpClient';
import { isRoleAllowed } from '../../constants/auth';

const mapLoginResponse = (payload) => {
  if (!payload?.data) {
    throw new Error('Invalid response payload');
  }

  const { data } = payload;

  if (!data.token || !data.role) {
    throw new Error('Missing token or role in response');
  }

  return {
    token: data.token,
    refreshToken: data.refreshToken,
    user: {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      notificationsEnabled: data.notificationsEnabled,
      profilePicture: data.profilePicture,
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
