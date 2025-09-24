import { getAuthData, saveAuthData, clearAuthData } from '../storage/authStorage';
import { isRoleAllowed } from '../../constants/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const unauthorizedSubscribers = new Set();
const tokenUpdateSubscribers = new Set();
let refreshPromise = null;

const resolveUrl = (url) => {
  if (!url) {
    throw new Error('URL is required');
  }
  if (/^https?:/i.test(url)) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${baseURL}${url}`;
  }
  return `${baseURL}/${url}`;
};

const notifyUnauthorized = () => {
  unauthorizedSubscribers.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.error('Unauthorized subscriber failed', error);
    }
  });
};

const notifyTokenUpdate = (authData) => {
  tokenUpdateSubscribers.forEach((callback) => {
    try {
      callback(authData);
    } catch (error) {
      console.error('Token update subscriber failed', error);
    }
  });
};

export const subscribeToUnauthorized = (callback) => {
  unauthorizedSubscribers.add(callback);
  return () => unauthorizedSubscribers.delete(callback);
};

export const subscribeToTokenUpdate = (callback) => {
  tokenUpdateSubscribers.add(callback);
  return () => tokenUpdateSubscribers.delete(callback);
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

const mapAuthPayload = (payload) => {
  if (!payload?.data) {
    throw new Error('Invalid auth payload');
  }
  const data = payload.data;
  if (!data?.token || !data?.role) {
    throw new Error('Invalid token payload');
  }
  if (!isRoleAllowed(data.role)) {
    const error = new Error('Role not authorized');
    error.code = 'FORBIDDEN_ROLE';
    throw error;
  }
  return {
    token: data.token,
    refreshToken: data.refreshToken || null,
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

const attemptRefresh = async () => {
  const { refreshToken } = getAuthData();
  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    const url = resolveUrl('/auth/refresh');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    };

    refreshPromise = fetch(url, options)
      .then(async (response) => {
        const payload = await parseResponse(response);
        if (!response.ok) {
          const error = new Error(payload?.message || 'Unable to refresh session');
          error.status = response.status;
          error.payload = payload;
          throw error;
        }
        return mapAuthPayload(payload);
      })
      .then((authData) => {
        saveAuthData(authData);
        notifyTokenUpdate(authData);
        return authData;
      })
      .catch((error) => {
        clearAuthData();
        notifyUnauthorized();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  try {
    return await refreshPromise;
  } catch (error) {
    return null;
  }
};

const request = async (url, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body,
    retry = true,
    ...rest
  } = options;

  const resolvedUrl = resolveUrl(url);
  const authData = getAuthData();
  
  // Check if body is FormData
  const isFormData = body instanceof FormData;
  
  const finalHeaders = {
    // Only set Content-Type if not FormData (browser will set it with boundary)
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  if (authData?.token) {
    finalHeaders.Authorization = `Bearer ${authData.token}`;
  }

  const payload = body === undefined || body === null
    ? undefined
    : isFormData
      ? body  // Send FormData as-is
      : typeof body === 'string'
        ? body
        : JSON.stringify(body);

  const response = await fetch(resolvedUrl, {
    method,
    headers: finalHeaders,
    body: payload,
    ...rest,
  });

  if (response.status === 401 && retry) {
    const refreshed = await attemptRefresh();
    if (refreshed?.token) {
      const updatedHeaders = {
        ...headers,
        Authorization: `Bearer ${refreshed.token}`,
      };
      return request(url, {
        ...options,
        headers: updatedHeaders,
        retry: false,
      });
    }
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(data?.message || response.statusText || 'Request failed');
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return {
    data,
    status: response.status,
    ok: true,
    headers: response.headers,
  };
};

const withMethod = (method) => (url, body, options = {}) =>
  request(url, { ...options, method, body });

const httpClient = {
  request,
  get: (url, options = {}) => request(url, { ...options, method: 'GET' }),
  post: withMethod('POST'),
  put: withMethod('PUT'),
  patch: withMethod('PATCH'),
  delete: (url, options = {}) => request(url, { ...options, method: 'DELETE' }),
};

export default httpClient;
