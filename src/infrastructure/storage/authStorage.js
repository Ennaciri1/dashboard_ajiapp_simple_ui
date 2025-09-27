const STORAGE_KEY = 'simple-ui-auth';

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read auth storage', error);
    return null;
  }
};

export const loadAuthData = () => readStorage();

export const saveAuthData = (payload) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to persist auth storage', error);
  }
};

export const clearAuthData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth storage', error);
  }
};

export const getAuthData = () => readStorage() || { user: null, token: null, refreshToken: null };
