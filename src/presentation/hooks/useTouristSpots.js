import { useState, useEffect, useCallback, useMemo } from 'react';
import { TouristSpotRepository } from '../../infrastructure/api/TouristSpotRepository.js';
import { TouristSpot } from '../../core/entities/TouristSpot.js';
import { GetTouristSpotsUseCase } from '../../core/usecases/touristSpots/GetTouristSpotsUseCase.js';
import { CreateTouristSpotUseCase } from '../../core/usecases/touristSpots/CreateTouristSpotUseCase.js';
import { UpdateTouristSpotUseCase } from '../../core/usecases/touristSpots/UpdateTouristSpotUseCase.js';
import { DeleteTouristSpotUseCase } from '../../core/usecases/touristSpots/DeleteTouristSpotUseCase.js';

/**
 * Custom hook for tourist spots management
 */
export const useTouristSpots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Mémoriser les instances pour éviter les re-créations à chaque render
  const spotRepository = useMemo(() => new TouristSpotRepository(), []);
  const getSpotsUseCase = useMemo(() => new GetTouristSpotsUseCase(spotRepository), [spotRepository]);
  const createSpotUseCase = useMemo(() => new CreateTouristSpotUseCase(spotRepository), [spotRepository]);
  const updateSpotUseCase = useMemo(() => new UpdateTouristSpotUseCase(spotRepository), [spotRepository]);
  const deleteSpotUseCase = useMemo(() => new DeleteTouristSpotUseCase(spotRepository), [spotRepository]);

  const loadSpots = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      console.log('useTouristSpots.loadSpots - Loading with params:', params);
      const result = await getSpotsUseCase.execute({
        filters: params.filters || {},
        searchTerm: params.searchTerm || '',
        sortBy: params.sortBy || 'name',
        sortOrder: params.sortOrder || 'asc',
        language: params.language || 'en'
      });

      console.log('useTouristSpots.loadSpots - Result:', result);
      console.log('useTouristSpots.loadSpots - Spots count:', result.spots?.length || 0);
      
      setSpots(result.spots || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err.message);
      console.error('Error loading tourist spots:', err);
    } finally {
      setLoading(false);
    }
  }, [getSpotsUseCase]);

  const createSpot = useCallback(async (spotData) => {
    setLoading(true);
    setError(null);

    try {
      const spotEntity = await createSpotUseCase.execute(spotData);
      setSpots(prev => [...prev, spotEntity]);
      setTotal(prev => prev + 1);
      return spotEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createSpotUseCase]);

  const updateSpot = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const spotEntity = await updateSpotUseCase.execute(id, updateData);
      setSpots(prev => prev.map(spot => 
        spot.id === id ? spotEntity : spot
      ));
      return spotEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateSpotUseCase]);

  const deleteSpot = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteSpotUseCase.execute(id);
      setSpots(prev => prev.filter(spot => spot.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteSpotUseCase]);

  const getSpotById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const spotData = await spotRepository.findById(id);
      
      if (!spotData) {
        return null;
      }

      return TouristSpot.fromJSON({
        id: spotData.id,
        name: spotData.nameTranslations?.en || spotData.name || '',
        city: spotData.cityName || spotData.city || '',
        description: spotData.descriptionTranslations?.en || spotData.description || '',
        interestTypes: spotData.interestTypes || [],
        coordinates: spotData.location ? {
          lat: spotData.location.latitude,
          lng: spotData.location.longitude
        } : {},
        images: spotData.images || [],
        openingHours: spotData.openingHours || {},
        entryFee: spotData.entryFee || '',
        rating: spotData.rating || null,
        status: spotData.isActive !== undefined ? (spotData.isActive ? 'active' : 'inactive') : 
                spotData.active !== undefined ? (spotData.active ? 'active' : 'inactive') : 
                spotData.status || 'active',
        createdAt: spotData.createdAt,
        updatedAt: spotData.updatedAt
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [spotRepository]);

  // Note: loadSpots is called explicitly by components when needed
  // This allows components to control when to load and with which language

  return {
    spots,
    loading,
    error,
    total,
    loadSpots,
    createSpot,
    updateSpot,
    deleteSpot,
    getSpotById,
    refresh: loadSpots
  };
};
