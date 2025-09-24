import httpClient from './httpClient';

const API_BASE = '/cities';

export const cityService = {
  // Créer une nouvelle ville
  createCity: async (cityData) => {
    try {
      const response = await httpClient.post(API_BASE, cityData);
      return response.data;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  },

  // Récupérer toutes les villes
  getAllCities: async (isActive = null, language = 'en') => {
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
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Récupérer une ville par ID
  getCityById: async (id, language = 'en') => {
    try {
      const response = await httpClient.get(`${API_BASE}/${id}`, {
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching city by ID:', error);
      throw error;
    }
  },

  // Mettre à jour une ville
  updateCity: async (id, cityData) => {
    try {
      const response = await httpClient.put(`${API_BASE}/${id}`, cityData);
      return response.data;
    } catch (error) {
      console.error('Error updating city:', error);
      throw error;
    }
  },

  // Supprimer une ville
  deleteCity: async (id) => {
    try {
      const response = await httpClient.delete(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
  }
};
