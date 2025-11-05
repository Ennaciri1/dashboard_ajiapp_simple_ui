import { getAuthData, saveAuthData, clearAuthData } from '../storage/authStorage';
import { isRoleAllowed } from '../../constants/auth';

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://192.168.11.127:8080') + '/api/v1';

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
  if (!data?.token || !data?.roles || !Array.isArray(data.roles) || data.roles.length === 0) {
    throw new Error('Invalid token payload');
  }
  const primaryRole = data.roles[0];
  if (!isRoleAllowed(primaryRole)) {
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
      role: primaryRole, // Keep compatibility with old system
      roles: data.roles, // Add complete roles array
      phoneNumber: data.phoneNumber || null,
      notificationsEnabled: data.notificationsEnabled || false,
      profilePicture: data.profilePicture || null,
      profiles: data.profiles || []
    }
  };
};

const attemptRefresh = async () => {
  const { refreshToken } = getAuthData();
  if (!refreshToken) {
    // No refresh token available, disconnect user
    clearAuthData();
    notifyUnauthorized();
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
        
        // If refresh returns 401, disconnect user
        if (response.status === 401) {
          clearAuthData();
          notifyUnauthorized();
          const error = new Error('Session expired. Please login again.');
          error.status = 401;
          error.payload = payload;
          throw error;
        }
        
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
        // If refresh failed, disconnect user
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
    // If refresh failed, return null to indicate failure
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

  // Log pour debug
  if (url.includes('visa')) {
    console.log('HTTP Request:', {
      method,
      url: resolvedUrl,
      headers: finalHeaders
    });
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

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && retry) {
    const refreshed = await attemptRefresh();
    
    // If refresh succeeded, retry the original request with new token
    if (refreshed?.token) {
      const updatedHeaders = {
        ...headers,
        Authorization: `Bearer ${refreshed.token}`,
      };
      return request(url, {
        ...options,
        headers: updatedHeaders,
        retry: false, // Don't retry again to avoid infinite loop
      });
    }
    
    // If refresh failed (returned null), the user has been disconnected
    // Throw an error to stop the request chain
    const error = new Error('Session expired. Please login again.');
    error.status = 401;
    throw error;
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
