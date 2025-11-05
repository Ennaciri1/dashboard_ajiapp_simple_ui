import httpClient from './httpClient';

const API_BASE = '/contacts';

export const contactService = {
  // Create a new contact
  createContact: async (contactData) => {
    try {
      const response = await httpClient.post(API_BASE, contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  // Get all contacts
  getAllContacts: async (isActive = null, language = 'en') => {
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
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Get contact by ID
  getContactById: async (id, language = 'en') => {
    try {
      const response = await httpClient.get(`${API_BASE}/${id}`, {
        headers: {
          'Accept-Language': language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contact by ID:', error);
      throw error;
    }
  },

  // Update contact
  updateContact: async (id, contactData) => {
    try {
      const response = await httpClient.put(`${API_BASE}/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Delete contact
  deleteContact: async (id) => {
    try {
      const response = await httpClient.delete(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
};

