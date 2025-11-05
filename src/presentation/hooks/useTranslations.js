import { useState, useEffect, useCallback, useMemo } from 'react';
import { TranslationRepository } from '../../infrastructure/api/TranslationRepository.js';
import { GetTranslationsUseCase } from '../../core/usecases/translations/GetTranslationsUseCase.js';
import { UpdateTranslationUseCase } from '../../core/usecases/translations/UpdateTranslationUseCase.js';

/**
 * Custom hook for translation management
 */
export const useTranslations = () => {
  const [groupedTranslations, setGroupedTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateKey, setUpdateKey] = useState(0); // Force re-render when translations update

  // Memoize repository and use cases to prevent re-creation on every render
  const translationRepository = useMemo(() => new TranslationRepository(), []);
  const getTranslationsUseCase = useMemo(() => new GetTranslationsUseCase(translationRepository), [translationRepository]);
  const updateTranslationUseCase = useMemo(() => new UpdateTranslationUseCase(translationRepository), [translationRepository]);

  /**
   * Load all grouped translations
   * @param {boolean} showLoading - Whether to show loading state (default: true)
   */
  const loadTranslations = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const translations = await getTranslationsUseCase.execute();
      console.log('📥 Loaded translations:', translations);
      setGroupedTranslations(translations);
      console.log('✅ Updated groupedTranslations state');
    } catch (err) {
      setError(err.message);
      console.error('Error loading translations:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [getTranslationsUseCase]);

  /**
   * Get translations for a specific entity
   * @param {string} entityType - Type of entity
   * @param {string} entityId - ID of the entity
   * @returns {Object} Translations for the entity
   */
  const getEntityTranslations = useCallback((entityType, entityId) => {
    return getTranslationsUseCase.getEntityTranslations(groupedTranslations, entityType, entityId);
  }, [groupedTranslations, getTranslationsUseCase]);

  /**
   * Get translations for a specific field
   * @param {string} entityType - Type of entity
   * @param {string} entityId - ID of the entity
   * @param {string} fieldName - Name of the field
   * @param {Array} supportedLanguages - Optional array of supported languages
   * @returns {Object} Translation object with language codes as keys
   */
  const getFieldTranslations = useCallback((entityType, entityId, fieldName, supportedLanguages) => {
    return getTranslationsUseCase.getFieldTranslations(
      groupedTranslations, 
      entityType, 
      entityId, 
      fieldName,
      supportedLanguages
    );
  }, [groupedTranslations, getTranslationsUseCase]);

  /**
   * Update translation for a specific field
   * @param {string} entityType - Type of entity
   * @param {string} entityId - ID of the entity
   * @param {string} fieldName - Name of the field
   * @param {Object} translations - Object with language codes as keys and translation values as values
   */
  const updateTranslation = useCallback(async (entityType, entityId, fieldName, translations) => {
    setError(null);
    // Don't set loading to true - keep table visible during update

    try {
      const updatedTranslation = await updateTranslationUseCase.execute(
        entityType,
        entityId,
        fieldName,
        translations
      );

      // Immediately refresh translations from API to update the table
      // Don't show loading state to keep table visible
      console.log('🔄 Refreshing translations after update...');
      await loadTranslations(false);
      console.log('✅ Translations refreshed');

      return updatedTranslation;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [updateTranslationUseCase, loadTranslations]);

  // Load translations on mount
  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  return {
    groupedTranslations,
    loading,
    error,
    loadTranslations,
    getEntityTranslations,
    getFieldTranslations,
    updateTranslation,
    refresh: loadTranslations
  };
};

