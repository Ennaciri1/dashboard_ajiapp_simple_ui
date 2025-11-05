import { useState, useEffect, useCallback, useMemo } from 'react';
import { HotelRepository } from '../../infrastructure/api/HotelRepository.js';
import { Hotel } from '../../core/entities/Hotel.js';
import { GetHotelsUseCase } from '../../core/usecases/hotels/GetHotelsUseCase.js';
import { CreateHotelUseCase } from '../../core/usecases/hotels/CreateHotelUseCase.js';
import { UpdateHotelUseCase } from '../../core/usecases/hotels/UpdateHotelUseCase.js';
import { DeleteHotelUseCase } from '../../core/usecases/hotels/DeleteHotelUseCase.js';

/**
 * Custom hook for hotels management
 * Encapsule la logique métier et fournit une interface simple aux composants
 */
export const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);

  // Mémoriser les instances pour éviter les re-créations à chaque render
  const hotelRepository = useMemo(() => new HotelRepository(), []);
  const getHotelsUseCase = useMemo(() => new GetHotelsUseCase(hotelRepository), [hotelRepository]);
  const createHotelUseCase = useMemo(() => new CreateHotelUseCase(hotelRepository), [hotelRepository]);
  const updateHotelUseCase = useMemo(() => new UpdateHotelUseCase(hotelRepository), [hotelRepository]);
  const deleteHotelUseCase = useMemo(() => new DeleteHotelUseCase(hotelRepository), [hotelRepository]);

  /**
   * Charge la liste des hôtels via le use case
   */
  const loadHotels = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      console.log('useHotels.loadHotels - Loading with params:', params);
      const result = await getHotelsUseCase.execute({
        filters: params.filters || {},
        searchTerm: params.searchTerm || '',
        sortBy: params.sortBy || 'name',
        sortOrder: params.sortOrder || 'asc',
        language: params.language || 'en'
      });

      console.log('useHotels.loadHotels - Result:', result);
      console.log('useHotels.loadHotels - Hotels count:', result.hotels?.length || 0);
      
      setHotels(result.hotels || []);
      setTotal(result.total || 0);
      setIsTestMode(false);
    } catch (err) {
      // Si l'erreur contient "Failed to fetch", on active le mode test
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setIsTestMode(true);
        setError(null);
        
        // Essayer de récupérer les données malgré l'erreur réseau
        try {
          const result = await getHotelsUseCase.execute({
            filters: params.filters || {},
            searchTerm: params.searchTerm || '',
            sortBy: params.sortBy || 'name',
            sortOrder: params.sortOrder || 'asc'
          });
          
          setHotels(result.hotels);
          setTotal(result.total);
        } catch {
          setError('Impossible de charger les données');
        }
      } else {
        setError(err.message);
        setIsTestMode(false);
      }
      console.error('Error loading hotels:', err);
    } finally {
      setLoading(false);
    }
  }, [getHotelsUseCase]);

  /**
   * Crée un nouvel hôtel via le use case
   */
  const createHotel = useCallback(async (hotelData) => {
    setLoading(true);
    setError(null);

    try {
      const hotelEntity = await createHotelUseCase.execute(hotelData);
      
      // Mise à jour de la liste locale
      setHotels(prev => [...prev, hotelEntity]);
      setTotal(prev => prev + 1);
      
      return hotelEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createHotelUseCase]);

  /**
   * Met à jour un hôtel existant via le use case
   */
  const updateHotel = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const hotelEntity = await updateHotelUseCase.execute(id, updateData);
      
      // Mise à jour de la liste locale
      setHotels(prev => prev.map(hotel => 
        hotel.id === id ? hotelEntity : hotel
      ));
      
      return hotelEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateHotelUseCase]);

  /**
   * Supprime un hôtel via le use case
   */
  const deleteHotel = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteHotelUseCase.execute(id);
      
      // Mise à jour de la liste locale
      setHotels(prev => prev.filter(hotel => hotel.id !== id));
      setTotal(prev => prev - 1);
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteHotelUseCase]);

  /**
   * Recherche des hôtels
   */
  const searchHotels = useCallback(async (searchTerm, filters = {}) => {
    return loadHotels({ searchTerm, filters });
  }, [loadHotels]);

  /**
   * Récupère un hôtel par son ID
   */
  const getHotelById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const hotelData = await hotelRepository.findById(id);
      
      if (!hotelData) {
        return null;
      }

      // Conversion en entité Hotel
      return Hotel.fromJSON({
        id: hotelData.id,
        name: hotelData.nameTranslations?.en || hotelData.name || '',
        location: hotelData.cityName || hotelData.location?.cityName || hotelData.location || '',
        description: hotelData.descriptionTranslations?.en || hotelData.description || '',
        amenities: hotelData.amenities || [],
        rating: hotelData.rating || null,
        priceRange: hotelData.priceRange || {},
        images: hotelData.images || [],
        contactInfo: hotelData.contactInfo || {},
        status: hotelData.isActive !== undefined ? (hotelData.isActive ? 'active' : 'inactive') : 
                hotelData.active !== undefined ? (hotelData.active ? 'active' : 'inactive') : 
                hotelData.status || 'active',
        createdAt: hotelData.createdAt,
        updatedAt: hotelData.updatedAt
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hotelRepository]);

  /**
   * Efface les erreurs
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial loading
  // Note: loadHotels should be called explicitly by components when needed
  // This allows components to control when to load and with which parameters

  return {
    // État
    hotels,
    loading,
    error,
    total,
    isTestMode,
    
    // Actions
    loadHotels,
    createHotel,
    updateHotel,
    deleteHotel,
    searchHotels,
    getHotelById,
    clearError,
    
    // Helpers
    refresh: loadHotels
  };
};
