/* eslint-disable no-unused-vars */
/**
 * Interface for Translation Repository
 */
export class ITranslationRepository {
  /**
   * Get all translations grouped by entityType, entityId, and fieldName
   * @returns {Promise<Object>} Grouped translations object
   */
  async getGroupedTranslations() {
    throw new Error('Method getGroupedTranslations must be implemented');
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
    throw new Error('Method updateTranslation must be implemented');
  }
}

