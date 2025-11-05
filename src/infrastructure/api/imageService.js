import httpClient from './httpClient';

const API_BASE = '/images/public/batch';

export const imageService = {
  // Upload a new image
  uploadImage: async (file, subdirectory = '') => {
    try {
      const formData = new FormData();
      formData.append('files', file); // API batch attend 'files' au pluriel
      if (subdirectory) {
        formData.append('subdirectory', subdirectory);
      }
      
      console.log('Uploading image:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        subdirectory
      });
      
      const response = await httpClient.post(API_BASE, formData);
      console.log('Upload response:', response);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        payload: error.payload
      });
      throw error;
    }
  },

  // Upload multiple images at once (batch)
  uploadImagesBatch: async (files, subdirectory = '') => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les fichiers
      files.forEach(file => {
        formData.append('files', file);
      });
      
      if (subdirectory) {
        formData.append('subdirectory', subdirectory);
      }
      
      console.log('Uploading batch images:', {
        count: files.length,
        subdirectory,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });
      
      const response = await httpClient.post(API_BASE, formData);
      console.log('Batch upload response:', response);
      return response.data;
    } catch (error) {
      console.error('Error uploading batch images:', error);
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
    // Format batch avec imageUrls (tableau)
    if (response?.data?.imageUrls && Array.isArray(response.data.imageUrls)) {
      return response.data.imageUrls[0];
    }
    // Pour une réponse batch, prendre la première image
    if (response?.data?.images && Array.isArray(response.data.images)) {
      return response.data.images[0]?.imageUrl || response.data.images[0]?.url;
    }
    // Format classique
    return response?.data?.imageUrl || response?.data?.url || response?.url || response?.imageUrl;
  },

  // Helper pour obtenir toutes les URLs d'une réponse batch
  getImageUrls: (response) => {
    // Format batch avec imageUrls (tableau)
    if (response?.data?.imageUrls && Array.isArray(response.data.imageUrls)) {
      return response.data.imageUrls;
    }
    // Format alternatif avec images
    if (response?.data?.images && Array.isArray(response.data.images)) {
      return response.data.images.map(img => img.imageUrl || img.url).filter(Boolean);
    }
    // Si c'est une seule image, retourner dans un tableau
    const singleUrl = response?.data?.imageUrl || response?.data?.url || response?.url || response?.imageUrl;
    return singleUrl ? [singleUrl] : [];
  }
};
