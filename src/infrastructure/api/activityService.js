import httpClient from './httpClient';

const API_BASE = '/activities';

export const activityService = {
  // Get all activities
  getAllActivities: async (language = 'en') => {
    try {
      const response = await httpClient.get(API_BASE, {
        headers: {
          'Accept-Language': language
        }
      });
      
      // Handle different API response formats
      if (response.data) {
        if (response.data.data && response.data.data.activities) {
          return response.data.data.activities;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (response.data.activities && Array.isArray(response.data.activities)) {
          return response.data.activities;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get activity by ID
  getActivityById: async (id, language = 'en') => {
    try {
      const response = await httpClient.get(`${API_BASE}/${id}`, {
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity by ID:', error);
      throw error;
    }
  }
};


