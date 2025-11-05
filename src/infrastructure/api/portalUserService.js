import httpClient from './httpClient';

const API_BASE = '/portal-users';
const AUTH_API_BASE = '/auth/users';

export const portalUserService = {
  // Create a new ActivityUser
  createActivityUser: async (userData) => {
    try {
      const response = await httpClient.post(`${AUTH_API_BASE}/activity`, {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      console.error('Error creating activity user:', error);
      throw error;
    }
  },

  // Get all activity users
  getAllActivityUsers: async () => {
    try {
      const response = await httpClient.get(`${AUTH_API_BASE}/activity`);
      
      // Handle API response format: { code, message, data: [...], error }
      if (response.data) {
        // Response format: { code: "200", message: "...", data: [...], error: false }
        if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } 
        // Fallback: if data is directly an array
        else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching activity users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await httpClient.get(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await httpClient.put(`${API_BASE}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Suspend user
  suspendUser: async (id) => {
    try {
      const response = await httpClient.put(`${API_BASE}/${id}/suspend`);
      return response.data;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  }
};

