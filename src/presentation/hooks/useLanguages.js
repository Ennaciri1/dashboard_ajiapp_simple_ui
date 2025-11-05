import { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageRepository } from '../../infrastructure/api/LanguageRepository.js';
import { Language } from '../../core/entities/Language.js';
import { GetLanguagesUseCase } from '../../core/usecases/languages/GetLanguagesUseCase.js';
import { CreateLanguageUseCase } from '../../core/usecases/languages/CreateLanguageUseCase.js';
import { UpdateLanguageUseCase } from '../../core/usecases/languages/UpdateLanguageUseCase.js';
import { DeleteLanguageUseCase } from '../../core/usecases/languages/DeleteLanguageUseCase.js';

/**
 * Custom hook for language management
 */
export const useLanguages = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Mémoriser les instances pour éviter les re-créations à chaque render
  const languageRepository = useMemo(() => new LanguageRepository(), []);
  const getLanguagesUseCase = useMemo(() => new GetLanguagesUseCase(languageRepository), [languageRepository]);
  const createLanguageUseCase = useMemo(() => new CreateLanguageUseCase(languageRepository), [languageRepository]);
  const updateLanguageUseCase = useMemo(() => new UpdateLanguageUseCase(languageRepository), [languageRepository]);
  const deleteLanguageUseCase = useMemo(() => new DeleteLanguageUseCase(languageRepository), [languageRepository]);

  const loadLanguages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getLanguagesUseCase.execute();

      setLanguages(result.languages);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
      console.error('Error loading languages:', err);
    } finally {
      setLoading(false);
    }
  }, [getLanguagesUseCase]);

  const createLanguage = useCallback(async (languageData) => {
    setLoading(true);
    setError(null);

    try {
      const languageEntity = await createLanguageUseCase.execute(languageData);
      setLanguages(prev => [...prev, languageEntity]);
      setTotal(prev => prev + 1);
      return languageEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createLanguageUseCase]);

  const updateLanguage = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const languageEntity = await updateLanguageUseCase.execute(id, updateData);
      setLanguages(prev => prev.map(lang => 
        lang.id === id ? languageEntity : lang
      ));
      return languageEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateLanguageUseCase]);

  const deleteLanguage = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteLanguageUseCase.execute(id);
      setLanguages(prev => prev.filter(lang => lang.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteLanguageUseCase]);

  const getLanguageById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const languageData = await languageRepository.findById(id);
      
      if (!languageData) {
        return null;
      }

      return Language.fromJSON({
        id: languageData.id,
        code: languageData.code,
        name: languageData.name,
        createdAt: languageData.createdAt,
        updatedAt: languageData.updatedAt,
        createdBy: languageData.createdBy,
        updatedBy: languageData.updatedBy
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [languageRepository]);

  const getLanguageByCode = useCallback(async (code) => {
    setLoading(true);
    setError(null);

    try {
      const languageData = await languageRepository.findByCode(code);
      
      if (!languageData) {
        return null;
      }

      return Language.fromJSON({
        id: languageData.id,
        code: languageData.code,
        name: languageData.name,
        createdAt: languageData.createdAt,
        updatedAt: languageData.updatedAt,
        createdBy: languageData.createdBy,
        updatedBy: languageData.updatedBy
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [languageRepository]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  return {
    languages,
    loading,
    error,
    total,
    loadLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    getLanguageById,
    getLanguageByCode,
    refresh: loadLanguages
  };
};

