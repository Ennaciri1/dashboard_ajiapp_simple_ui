/**
 * Use case: Update translation for an entity field
 */
export class UpdateTranslationUseCase {
  constructor(translationRepository) {
    this.translationRepository = translationRepository;
  }

  /**
   * Executes the use case
   * @param {string} entityType - Type of entity (e.g., 'tourist_spot', 'city')
   * @param {string} entityId - ID of the entity
   * @param {string} fieldName - Name of the field (e.g., 'name', 'description')
   * @param {Object} translations - Object with language codes as keys and translation values as values
   * @returns {Promise<Object>} Updated translation data
   */
  async execute(entityType, entityId, fieldName, translations) {
    try {
      // Validate inputs
      if (!entityType || !entityId || !fieldName) {
        throw new Error('Entity type, entity ID, and field name are required');
      }

      if (!translations || typeof translations !== 'object') {
        throw new Error('Translations must be an object');
      }

      // Update translation via repository
      const updatedTranslation = await this.translationRepository.updateTranslation(
        entityType,
        entityId,
        fieldName,
        translations
      );

      return updatedTranslation;
    } catch (error) {
      throw new Error(`Error updating translation: ${error.message}`);
    }
  }
}

