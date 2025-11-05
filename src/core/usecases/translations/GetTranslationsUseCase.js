/**
 * Use case: Get grouped translations
 */
export class GetTranslationsUseCase {
  constructor(translationRepository) {
    this.translationRepository = translationRepository;
  }

  /**
   * Executes the use case
   * @returns {Promise<Object>} Grouped translations object
   */
  async execute() {
    try {
      const groupedTranslations = await this.translationRepository.getGroupedTranslations();
      return groupedTranslations;
    } catch (error) {
      throw new Error(`Error fetching translations: ${error.message}`);
    }
  }

  /**
   * Get translations for a specific entity
   * @param {Object} groupedTranslations - The grouped translations object
   * @param {string} entityType - Type of entity (e.g., 'tourist_spot', 'city')
   * @param {string} entityId - ID of the entity
   * @returns {Object} Translations for the entity
   */
  getEntityTranslations(groupedTranslations, entityType, entityId) {
    if (!groupedTranslations || !groupedTranslations[entityType]) {
      return {};
    }
    
    return groupedTranslations[entityType][entityId] || {};
  }

  /**
   * Get translation for a specific field
   * Returns translations for all supported languages, with empty strings for missing translations
   * @param {Object} groupedTranslations - The grouped translations object
   * @param {string} entityType - Type of entity
   * @param {string} entityId - ID of the entity
   * @param {string} fieldName - Name of the field
   * @param {Array} supportedLanguages - Array of supported language objects with 'code' property
   * @returns {Object} Translation object with language codes as keys
   */
  getFieldTranslations(groupedTranslations, entityType, entityId, fieldName, supportedLanguages = []) {
    const entityTranslations = this.getEntityTranslations(groupedTranslations, entityType, entityId);
    const fieldTranslations = entityTranslations[fieldName] || {};
    
    // Ensure all supported languages are present, even if empty
    const completeTranslations = { ...fieldTranslations };
    
    if (supportedLanguages && supportedLanguages.length > 0) {
      supportedLanguages.forEach(lang => {
        const langCode = lang.code || lang;
        if (!completeTranslations.hasOwnProperty(langCode)) {
          completeTranslations[langCode] = '';
        }
      });
    }
    
    return completeTranslations;
  }
}

