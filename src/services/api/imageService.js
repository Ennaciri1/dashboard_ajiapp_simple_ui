import httpClient from './httpClient';

const API_BASE = '/images/public';

export const imageService = {
  // Upload a new image
  uploadImage: async (file, subdirectory = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (subdirectory) {
        formData.append('subdirectory', subdirectory);
      }
      
      const response = await httpClient.post(API_BASE, formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Update an existing image
  updateImage: async (file, existingImageUrl, subdirectory = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (subdirectory) {
        formData.append('subdirectory', subdirectory);
      }
      
      const response = await httpClient.put(API_BASE, formData, {
        params: { existingImageUrl }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating image:', error);
      throw error;
    }
  },

  // Delete an image
  deleteImage: async (imageUrl) => {
    try {
      const response = await httpClient.delete(API_BASE, {
        params: { imageUrl }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Helper function to validate image file
  validateImageFile: (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' 
      };
    }

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'File too large. Please upload an image smaller than 10MB.' 
      };
    }

    return { isValid: true };
  },

  // Helper function to get image URL from response
  getImageUrl: (response) => {
    return response?.data?.imageUrl || response?.data?.url || response?.url || response?.imageUrl;
  }
};
