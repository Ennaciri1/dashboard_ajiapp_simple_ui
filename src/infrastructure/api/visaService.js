import httpClient from './httpClient';

const API_BASE = '/visas';

export const visaService = {
  // Get all visas
  getAllVisas: async (language = 'en') => {
    try {
      const response = await httpClient.get(`${API_BASE}/get-all-visas/lang`, {
        headers: {
          'Accept-Language': language
        }
      });
      console.log('Visas service - GET /visas/get-all-visas/lang with Accept-Language:', language);
      console.log('Visas service - Full response:', response);
      console.log('Visas service - response.data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching visas:', error);
      throw error;
    }
  },

  // Get visa by ID
  getVisaById: async (id, language = 'en') => {
    try {
      const response = await httpClient.get(`${API_BASE}/admin/visa/${id}`, {
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching visa by ID:', error);
      throw error;
    }
  },

  // Add new visa
  addVisa: async (visaData) => {
    try {
      console.log('Adding visa with data:', visaData);
      const response = await httpClient.post(`${API_BASE}/admin/add-visa`, visaData);
      console.log('Add visa response:', response);
      console.log('Add visa response.data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding visa:', error);
      console.error('Error details:', error.payload);
      throw error;
    }
  },

  // Update visa
  updateVisa: async (id, visaData) => {
    try {
      console.log('Updating visa with ID:', id);
      console.log('Update data:', visaData);
      const response = await httpClient.post(`${API_BASE}/admin/update-visa/${id}`, visaData);
      console.log('Update visa response:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating visa:', error);
      console.error('Error details:', error.payload);
      throw error;
    }
  },

  // Delete visa
  deleteVisa: async (id) => {
    try {
      console.log('Deleting visa with ID:', id);
      const response = await httpClient.delete(`${API_BASE}/admin/update-visa/${id}`);
      console.log('Delete visa response:', response);
      return response.data;
    } catch (error) {
      console.error('Error deleting visa:', error);
      console.error('Error details:', error.payload);
      throw error;
    }
  }
};

