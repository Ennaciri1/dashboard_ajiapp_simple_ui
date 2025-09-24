import httpClient from './httpClient';

const API_BASE = '/tourist-spots';

export const touristSpotService = {
  // Create a new tourist spot
  createTouristSpot: async (touristSpotData) => {
    try {
      const response = await httpClient.post(API_BASE, touristSpotData);
      return response.data;
    } catch (error) {
      console.error('Error creating tourist spot:', error);
      throw error;
    }
  },

  // Get all tourist spots
  getAllTouristSpots: async (isActive = null, language = 'en') => {
    try {
      const params = {};
      if (isActive !== null) {
        params.isActive = isActive;
      }
      
      const response = await httpClient.get(API_BASE, {
        params,
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tourist spots:', error);
      throw error;
    }
  },

  // Get tourist spot by ID
  getTouristSpotById: async (id, language = 'en') => {
    try {
      const response = await httpClient.get(`${API_BASE}/${id}`, {
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tourist spot by ID:', error);
      throw error;
    }
  },

  // Update tourist spot
  updateTouristSpot: async (id, touristSpotData) => {
    try {
      const response = await httpClient.put(`${API_BASE}/${id}`, touristSpotData);
      return response.data;
    } catch (error) {
      console.error('Error updating tourist spot:', error);
      throw error;
    }
  },

  // Delete tourist spot
  deleteTouristSpot: async (id) => {
    try {
      const response = await httpClient.delete(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tourist spot:', error);
      throw error;
    }
  }
};
