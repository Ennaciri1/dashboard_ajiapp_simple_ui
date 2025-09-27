import httpClient from './httpClient';

const API_BASE = '/hotels';

export const hotelService = {
  // Create a new hotel
  createHotel: async (hotelData) => {
    try {
      const response = await httpClient.post(API_BASE, hotelData);
      return response.data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  },

  // Get all hotels
  getAllHotels: async (language = 'en') => {
    try {
      const response = await httpClient.get(API_BASE, {
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  // Get hotel by ID
  getHotelById: async (id, language = 'en') => {
    try {
      const response = await httpClient.get(`${API_BASE}/${id}`, {
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel by ID:', error);
      throw error;
    }
  },

  // Update hotel
  updateHotel: async (id, hotelData) => {
    try {
      const response = await httpClient.put(`${API_BASE}/${id}`, hotelData);
      return response.data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      throw error;
    }
  },

  // Delete hotel
  deleteHotel: async (id) => {
    try {
      const response = await httpClient.delete(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  }
};
