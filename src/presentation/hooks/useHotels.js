import { useState, useEffect, useCallback } from 'react';
import { RealHotelRepository } from '../../infrastructure/api/RealHotelRepository.js';
import { Hotel } from '../../core/entities/Hotel.js';

/**
 * Hook personnalisé pour la gestion des hôtels
 * Encapsule la logique métier et fournit une interface simple aux composants
 */
export const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);

  // Initialisation du repository réel
  const hotelRepository = new RealHotelRepository();

  /**
   * Charge la liste des hôtels depuis l'API réelle
   */
  const loadHotels = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const hotelsData = await hotelRepository.findAll(params);
      
      // Conversion en entités Hotel si nécessaire
      const hotelEntities = hotelsData.map(hotelData => {
        // Les données de l'API sont déjà dans le bon format
        return Hotel.fromJSON({
          id: hotelData.id,
          name: hotelData.name,
          location: hotelData.cityName || hotelData.location,
          description: hotelData.description,
          amenities: [], // Pas dans l'API actuelle
          rating: null, // Pas dans l'API actuelle
          priceRange: hotelData.priceRange,
          images: hotelData.images || [],
          contactInfo: {}, // Pas dans l'API actuelle
          status: hotelData.active ? 'active' : 'inactive',
          createdAt: hotelData.createdAt,
          updatedAt: hotelData.updatedAt
        });
      });

      setHotels(hotelEntities);
      setTotal(hotelEntities.length);
      setIsTestMode(false); // API disponible
    } catch (err) {
      // Si l'erreur contient "Failed to fetch", on active le mode test
      if (err.message.includes('Failed to fetch')) {
        setIsTestMode(true);
        setError(null); // Pas d'erreur en mode test
        
        // Les données de test sont déjà gérées par le repository
        try {
          const testData = await hotelRepository.findAll(params);
          const hotelEntities = testData.map(hotelData => {
            return Hotel.fromJSON({
              id: hotelData.id,
              name: hotelData.name,
              location: hotelData.cityName || hotelData.location,
              description: hotelData.description,
              amenities: [],
              rating: null,
              priceRange: hotelData.priceRange,
              images: hotelData.images || [],
              contactInfo: {},
              status: hotelData.active ? 'active' : 'inactive',
              createdAt: hotelData.createdAt,
              updatedAt: hotelData.updatedAt
            });
          });
          
          setHotels(hotelEntities);
          setTotal(hotelEntities.length);
        } catch (testErr) {
          setError('Impossible de charger les données de test');
        }
      } else {
        setError(err.message);
        setIsTestMode(false);
      }
      console.error('Erreur lors du chargement des hôtels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crée un nouvel hôtel
   */
  const createHotel = useCallback(async (hotelData) => {
    setLoading(true);
    setError(null);

    try {
      const newHotel = await hotelRepository.create(hotelData);
      
      // Conversion en entité
      const hotelEntity = Hotel.fromJSON({
        id: newHotel.id,
        name: newHotel.name,
        location: newHotel.cityName || newHotel.location,
        description: newHotel.description,
        amenities: [],
        rating: null,
        priceRange: newHotel.priceRange,
        images: newHotel.images || [],
        contactInfo: {},
        status: newHotel.active ? 'active' : 'inactive',
        createdAt: newHotel.createdAt,
        updatedAt: newHotel.updatedAt
      });
      
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
  }, []);

  /**
   * Met à jour un hôtel existant
   */
  const updateHotel = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedHotel = await hotelRepository.update(id, updateData);
      
      // Conversion en entité
      const hotelEntity = Hotel.fromJSON({
        id: updatedHotel.id,
        name: updatedHotel.name,
        location: updatedHotel.cityName || updatedHotel.location,
        description: updatedHotel.description,
        amenities: [],
        rating: null,
        priceRange: updatedHotel.priceRange,
        images: updatedHotel.images || [],
        contactInfo: {},
        status: updatedHotel.active ? 'active' : 'inactive',
        createdAt: updatedHotel.createdAt,
        updatedAt: updatedHotel.updatedAt
      });
      
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
  }, []);

  /**
   * Supprime un hôtel
   */
  const deleteHotel = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await hotelRepository.delete(id);
      
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
  }, []);

  /**
   * Recherche des hôtels
   */
  const searchHotels = useCallback(async (searchTerm, filters = {}) => {
    return loadHotels({ searchTerm, filters });
  }, [loadHotels]);

  /**
   * Efface les erreurs
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Chargement initial
  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

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
    clearError,
    
    // Helpers
    refresh: loadHotels
  };
};
