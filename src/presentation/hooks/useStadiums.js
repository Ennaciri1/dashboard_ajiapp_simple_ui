import { useState, useEffect, useCallback, useMemo } from 'react';
import { StadiumRepository } from '../../infrastructure/api/StadiumRepository.js';
import { Stadium } from '../../core/entities/Stadium.js';
import { GetStadiumsUseCase } from '../../core/usecases/stadiums/GetStadiumsUseCase.js';
import { CreateStadiumUseCase } from '../../core/usecases/stadiums/CreateStadiumUseCase.js';
import { UpdateStadiumUseCase } from '../../core/usecases/stadiums/UpdateStadiumUseCase.js';
import { DeleteStadiumUseCase } from '../../core/usecases/stadiums/DeleteStadiumUseCase.js';

/**
 * Custom hook for stadiums management
 */
export const useStadiums = () => {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Mémoriser les instances pour éviter les re-créations à chaque render
  const stadiumRepository = useMemo(() => new StadiumRepository(), []);
  const getStadiumsUseCase = useMemo(() => new GetStadiumsUseCase(stadiumRepository), [stadiumRepository]);
  const createStadiumUseCase = useMemo(() => new CreateStadiumUseCase(stadiumRepository), [stadiumRepository]);
  const updateStadiumUseCase = useMemo(() => new UpdateStadiumUseCase(stadiumRepository), [stadiumRepository]);
  const deleteStadiumUseCase = useMemo(() => new DeleteStadiumUseCase(stadiumRepository), [stadiumRepository]);

  const loadStadiums = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      console.log('useStadiums.loadStadiums - Loading with params:', params);
      const result = await getStadiumsUseCase.execute({
        filters: params.filters || {},
        searchTerm: params.searchTerm || '',
        sortBy: params.sortBy || 'name',
        sortOrder: params.sortOrder || 'asc',
        language: params.language || 'en'
      });

      console.log('useStadiums.loadStadiums - Result:', result);
      console.log('useStadiums.loadStadiums - Stadiums count:', result.stadiums?.length || 0);
      
      setStadiums(result.stadiums || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err.message);
      console.error('Error loading stadiums:', err);
    } finally {
      setLoading(false);
    }
  }, [getStadiumsUseCase]);

  const createStadium = useCallback(async (stadiumData) => {
    setLoading(true);
    setError(null);

    try {
      const stadiumEntity = await createStadiumUseCase.execute(stadiumData);
      setStadiums(prev => [...prev, stadiumEntity]);
      setTotal(prev => prev + 1);
      return stadiumEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createStadiumUseCase]);

  const updateStadium = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const stadiumEntity = await updateStadiumUseCase.execute(id, updateData);
      setStadiums(prev => prev.map(stadium => 
        stadium.id === id ? stadiumEntity : stadium
      ));
      return stadiumEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateStadiumUseCase]);

  const deleteStadium = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteStadiumUseCase.execute(id);
      setStadiums(prev => prev.filter(stadium => stadium.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteStadiumUseCase]);

  const getStadiumById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const stadiumData = await stadiumRepository.findById(id);
      
      if (!stadiumData) {
        return null;
      }

      return Stadium.fromJSON({
        id: stadiumData.id,
        name: stadiumData.nameTranslations?.en || stadiumData.name || '',
        description: stadiumData.descriptionTranslations?.en || stadiumData.description || '',
        cityId: stadiumData.cityId || '',
        cityName: stadiumData.cityName || '',
        location: stadiumData.location || {},
        images: stadiumData.images || [],
        capacity: stadiumData.capacity || 0,
        inauguration: stadiumData.inauguration || null,
        homeGround: stadiumData.homeGround || '',
        status: stadiumData.isActive !== undefined ? (stadiumData.isActive ? 'active' : 'inactive') : 
                stadiumData.active !== undefined ? (stadiumData.active ? 'active' : 'inactive') : 
                stadiumData.status || 'active',
        createdAt: stadiumData.createdAt,
        updatedAt: stadiumData.updatedAt,
        createdBy: stadiumData.createdBy,
        updatedBy: stadiumData.updatedBy
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [stadiumRepository]);

  useEffect(() => {
    loadStadiums();
  }, [loadStadiums]);

  return {
    stadiums,
    loading,
    error,
    total,
    loadStadiums,
    createStadium,
    updateStadium,
    deleteStadium,
    getStadiumById,
    refresh: loadStadiums
  };
};
