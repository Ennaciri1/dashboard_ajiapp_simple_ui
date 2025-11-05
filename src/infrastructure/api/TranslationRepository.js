import { ITranslationRepository } from '../../core/interfaces/repositories/ITranslationRepository.js';
import httpClient from './httpClient.js';
import { mapEntityTypeToAPI } from '../../utils/entityTypeMapper.js';

/**
 * Translation Repository - Handles translation API calls
 */
export class TranslationRepository extends ITranslationRepository {
  constructor() {
    super();
    this.basePath = '/translations';
  }

  /**
   * Get all translations grouped by entityType, entityId, and fieldName
   * @returns {Promise<Object>} Grouped translations object
   */
  async getGroupedTranslations() {
    try {
      const response = await httpClient.get(`${this.basePath}/grouped`);
      
      // Handle API response format: { code, message, data, error }
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || {};
    } catch (error) {
      console.error('Error fetching grouped translations:', error.message);
      throw new Error(`Error fetching translations: ${error.message}`);
    }
  }

  /**
   * Update translation for a specific entity field
   * @param {string} entityType - Type of entity (e.g., 'tourist_spot', 'city')
   * @param {string} entityId - ID of the entity
   * @param {string} fieldName - Name of the field (e.g., 'name', 'description')
   * @param {Object} translations - Object with language codes as keys and translation values as values
   * @returns {Promise<Object>} Updated translation data
   */
  async updateTranslation(entityType, entityId, fieldName, translations) {
    try {
      // Map entity type to API format
      const apiEntityType = mapEntityTypeToAPI(entityType);
      
      // Filter out empty strings - API might not accept empty translations
      const cleanedTranslations = Object.keys(translations).reduce((acc, key) => {
        const value = translations[key];
        // Only include non-empty strings
        if (value && typeof value === 'string' && value.trim().length > 0) {
          acc[key] = value.trim();
        }
        return acc;
      }, {});
      
      // Ensure at least one translation is provided
      if (Object.keys(cleanedTranslations).length === 0) {
        throw new Error('At least one translation value is required');
      }
      
      // Wrap translations in the expected API format
      const requestBody = {
        translations: cleanedTranslations
      };
      
      const response = await httpClient.put(
        `${this.basePath}/entity/${apiEntityType}/${entityId}/field/${fieldName}`,
        requestBody
      );
      
      // Handle API response format
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || cleanedTranslations;
    } catch (error) {
      // Extract more detailed error message from API response
      let errorMessage = error.message;
      if (error.payload) {
        if (error.payload.message) {
          errorMessage = error.payload.message;
        } else if (error.payload.error) {
          errorMessage = error.payload.error;
        } else if (typeof error.payload === 'string') {
          errorMessage = error.payload;
        }
      }
      
      console.error('Error updating translation:', {
        message: errorMessage,
        status: error.status,
        payload: error.payload,
        entityType,
        entityId,
        fieldName,
        translations
      });
      
      throw new Error(`Error updating translation: ${errorMessage}`);
    }
  }
}

