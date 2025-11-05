/**
 * Translation Validation Utility
 * Provides validation logic for entity translations
 */

/**
 * Validates translations for entity creation
 * Only English (en) translation is allowed
 * @param {Object} translationsData - Object containing translation fields (e.g., { nameTranslations: {...}, descriptionTranslations: {...} })
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateCreationTranslations = (translationsData) => {
  const errors = [];
  const allowedLanguage = 'en';

  // List of fields that can have translations
  const translatableFields = ['nameTranslations', 'descriptionTranslations', 'addressTranslations', 'titleTranslations'];

  translatableFields.forEach(fieldName => {
    const fieldTranslations = translationsData[fieldName];
    
    if (fieldTranslations && typeof fieldTranslations === 'object') {
      const languageCodes = Object.keys(fieldTranslations);
      
      // Check if English is provided
      if (!languageCodes.includes(allowedLanguage)) {
        errors.push(`${fieldName.replace('Translations', '')} must have English (en) translation`);
      }
      
      // Check for non-English languages
      const nonEnglishLanguages = languageCodes.filter(code => code !== allowedLanguage);
      if (nonEnglishLanguages.length > 0) {
        errors.push(`${fieldName.replace('Translations', '')} cannot have translations in other languages during creation. Only English (en) is allowed. Found: ${nonEnglishLanguages.join(', ')}`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates translations for entity update
 * All provided language codes must be active and supported
 * @param {Object} translationsData - Object containing translation fields
 * @param {Array} activeLanguages - Array of active language objects with 'code' property
 * @returns {Object} { isValid: boolean, errors: string[], warnings: string[] }
 */
export const validateUpdateTranslations = (translationsData, activeLanguages) => {
  const errors = [];
  const warnings = [];
  
  if (!activeLanguages || !Array.isArray(activeLanguages) || activeLanguages.length === 0) {
    errors.push('No active languages found. Please add at least one active language.');
    return { isValid: false, errors, warnings };
  }

  const activeLanguageCodes = activeLanguages.map(lang => lang.code || lang).filter(Boolean);
  
  if (activeLanguageCodes.length === 0) {
    errors.push('No active language codes found.');
    return { isValid: false, errors, warnings };
  }

  const translatableFields = ['nameTranslations', 'descriptionTranslations', 'addressTranslations', 'titleTranslations'];

  translatableFields.forEach(fieldName => {
    const fieldTranslations = translationsData[fieldName];
    
    if (fieldTranslations && typeof fieldTranslations === 'object') {
      const providedLanguageCodes = Object.keys(fieldTranslations);
      
      providedLanguageCodes.forEach(langCode => {
        if (!activeLanguageCodes.includes(langCode)) {
          errors.push(`${fieldName.replace('Translations', '')} has translation in unsupported or inactive language: ${langCode}. Supported active languages: ${activeLanguageCodes.join(', ')}`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validates that all required translations exist for activation
 * Checks if translations exist for ALL active languages for all translatable fields
 * @param {Object} entityTranslations - Complete translations object from translations service
 * @param {string} entityType - Type of entity (e.g., 'hotel', 'tourist_spot', 'stadium')
 * @param {string} entityId - ID of the entity
 * @param {Array} activeLanguages - Array of active language objects with 'code' property
 * @param {Array} requiredFields - Array of field names that require translations (e.g., ['name', 'description'])
 * @returns {Object} { isValid: boolean, errors: string[], missingTranslations: Array<{field: string, language: string}> }
 */
export const validateActivationTranslations = (
  entityTranslations,
  entityType,
  entityId,
  activeLanguages,
  requiredFields = ['name']
) => {
  const errors = [];
  const missingTranslations = [];

  if (!activeLanguages || !Array.isArray(activeLanguages) || activeLanguages.length === 0) {
    errors.push('No active languages found. Cannot activate entity without active languages.');
    return { isValid: false, errors, missingTranslations };
  }

  const activeLanguageCodes = activeLanguages.map(lang => lang.code || lang).filter(Boolean);
  
  if (activeLanguageCodes.length === 0) {
    errors.push('No active language codes found.');
    return { isValid: false, errors, missingTranslations };
  }

  // Get translations for this entity
  const entityTrans = entityTranslations[entityType]?.[entityId] || {};

  // Check each required field
  requiredFields.forEach(fieldName => {
    const fieldTranslations = entityTrans[fieldName] || {};
    
    // Check each active language
    activeLanguageCodes.forEach(langCode => {
      const translationValue = fieldTranslations[langCode];
      
      // Check if translation exists and is not empty
      if (!translationValue || (typeof translationValue === 'string' && translationValue.trim().length === 0)) {
        missingTranslations.push({
          field: fieldName,
          language: langCode
        });
      }
    });
  });

  // Generate error messages
  if (missingTranslations.length > 0) {
    // Group by field
    const groupedByField = {};
    missingTranslations.forEach(({ field, language }) => {
      if (!groupedByField[field]) {
        groupedByField[field] = [];
      }
      groupedByField[field].push(language);
    });

    // Create readable error messages
    const errorMessages = Object.keys(groupedByField).map(field => {
      const languages = groupedByField[field].join(', ');
      return `${field} (${languages})`;
    });

    errors.push(`Missing translations for: ${errorMessages.join(', ')}`);
  }

  return {
    isValid: missingTranslations.length === 0,
    errors,
    missingTranslations
  };
};

/**
 * Gets active languages
 * @param {Array} languages - Array of all language objects (Language entities or plain objects)
 * @returns {Array} Array of active language objects
 */
export const getActiveLanguages = (languages) => {
  if (!languages || !Array.isArray(languages)) {
    return [];
  }
  
  // For now, assume all languages returned from the API are active
  // In the future, if Language entity has an 'active' or 'isActive' property, filter by it
  return languages.filter(lang => {
    // If language has active/isActive property, check it
    if (lang.active !== undefined) {
      return lang.active === true;
    }
    if (lang.isActive !== undefined) {
      return lang.isActive === true;
    }
    // If no active property, assume it's active (all languages in the system are active)
    return true;
  });
};

