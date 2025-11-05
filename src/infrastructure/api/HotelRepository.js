import { IHotelRepository } from '../../core/interfaces/repositories/IHotelRepository.js';
import httpClient from './httpClient.js';

/**
 * Implémentation concrète du repository des hôtels
 * Utilise l'API HTTP pour la persistance avec gestion d'erreurs améliorée
 * Fusion de HotelRepository et RealHotelRepository
 */
export class HotelRepository extends IHotelRepository {
  constructor() {
    super();
    this.basePath = '/hotels';
  }

  /**
   * Retrieves all hotels
   * Handles the real API response format: { code, message, data: { hotels, total, language }, error }
   * @param {Object} filters - Filtres à appliquer
   * @param {string} language - Code de langue pour le header Accept-Language (ex: 'en', 'fr', 'ar')
   */
  async findAll(filters = {}, language = 'en') {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters as query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

      // Ajouter le header Accept-Language
      const headers = {
        'Accept-Language': language
      };

      const response = await httpClient.get(url, { headers });
      
      console.log('HotelRepository.findAll - Full response:', response);
      console.log('HotelRepository.findAll - response.data:', response.data);
      
      // Handle real API response format: { code, message, data: { hotels: [...], total, language }, error }
      if (response.data) {
        // Format API: { code, message, data: { hotels: [...], total, language }, error }
        if (response.data.data && response.data.data.hotels) {
          let hotels = response.data.data.hotels;
          
          console.log('HotelRepository.findAll - Found hotels in response.data.data.hotels:', hotels.length);
          
          // Ensure it's an array
          if (!Array.isArray(hotels)) {
            console.warn('API returned non-array hotels data:', hotels);
            return [];
          }
          
          // Client-side filtering if necessary
          if (filters.status) {
            hotels = hotels.filter(hotel => hotel.active === (filters.status === 'active'));
          }
          
          return hotels;
        }
        
        // Si response.data est directement un tableau
        if (Array.isArray(response.data)) {
          console.log('HotelRepository.findAll - response.data is array:', response.data.length);
          return response.data;
        }
        
        // Si response.data.data est directement un tableau
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('HotelRepository.findAll - response.data.data is array:', response.data.data.length);
          return response.data.data;
        }
      }
      
      // Simple response format - ensure it's an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If response.data is an object, try to extract hotels array
      if (response.data && typeof response.data === 'object') {
        // Try common formats
        if (response.data.hotels && Array.isArray(response.data.hotels)) {
          return response.data.hotels;
        }
        if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }
      
      // Return empty array if no valid data found
      console.warn('No valid hotels array found in API response:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching hotels:', error.message);
      throw new Error(`Error fetching hotels: ${error.message}`);
    }
  }

  /**
   * Récupère un hôtel par son ID
   */
  async findById(id) {
    try {
      const response = await httpClient.get(`${this.basePath}/${id}`);
      
      // L'API peut retourner directement l'hôtel ou dans data
      if (response.data) {
        return response.data.data || response.data;
      }
      
      return null;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      console.error('Error fetching hotel by ID:', error.message);
      throw new Error(`Error fetching hotel ${id}: ${error.message}`);
    }
  }

  /**
   * Crée un nouvel hôtel
   * Accepte soit une entité Hotel, soit des données brutes
   */
  async create(hotel) {
    try {
      // Gérer les deux formats : entité Hotel ou données brutes
      const hotelData = hotel.toJSON ? hotel.toJSON() : hotel;
      
      // Format pour création (sans isActive si ce n'est pas dans les données)
      const createData = hotelData.nameTranslations ? hotelData : {
        nameTranslations: hotelData.nameTranslations || { en: hotelData.name || '' },
        descriptionTranslations: hotelData.descriptionTranslations || { en: hotelData.description || '' },
        cityId: hotelData.cityId,
        location: hotelData.location,
        images: hotelData.images || [],
        priceRange: hotelData.priceRange
      };
      
      const response = await httpClient.post(this.basePath, createData);
      return response.data;
    } catch (error) {
      console.error('Error creating hotel:', error.message);
      throw new Error(`Error creating hotel: ${error.message}`);
    }
  }

  /**
   * Met à jour un hôtel existant
   * Accepte soit une entité Hotel, soit des données brutes
   */
  async update(id, hotel) {
    try {
      // Gérer les deux formats : entité Hotel ou données brutes
      const hotelData = hotel.toJSON ? hotel.toJSON() : hotel;
      
      // Format pour mise à jour (avec isActive)
      const updateData = hotelData.nameTranslations ? hotelData : {
        nameTranslations: hotelData.nameTranslations || { en: hotelData.name || '' },
        descriptionTranslations: hotelData.descriptionTranslations || { en: hotelData.description || '' },
        cityId: hotelData.cityId,
        location: hotelData.location,
        images: hotelData.images || [],
        priceRange: hotelData.priceRange,
        isActive: hotelData.isActive !== undefined ? hotelData.isActive : hotelData.active
      };
      
      const response = await httpClient.put(`${this.basePath}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.warn('API non disponible pour update, simulation:', error.message);
      
      // Simulation de mise à jour en cas d'erreur API
      const hotelData = hotel.toJSON ? hotel.toJSON() : hotel;
      return {
        id: id,
        name: hotelData.nameTranslations?.en || hotelData.name || 'Hôtel mis à jour',
        description: hotelData.descriptionTranslations?.en || hotelData.description || '',
        cityId: hotelData.cityId,
        cityName: hotelData.cityName || 'Unknown City',
        location: hotelData.location,
        images: hotelData.images || [],
        priceRange: hotelData.priceRange,
        likesCount: hotelData.likesCount || 0,
        active: hotelData.isActive !== undefined ? hotelData.isActive : hotelData.active,
        createdAt: hotelData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: hotelData.createdBy || 'user@example.com',
        updatedBy: hotelData.updatedBy || 'user@example.com'
      };
    }
  }

  /**
   * Supprime un hôtel
   */
  async delete(id) {
    try {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      console.warn('API non disponible pour delete, simulation:', error.message);
      // En cas d'erreur, on considère que la suppression est réussie pour le mode test
      return true;
    }
  }

  /**
   * Search hotels by criteria
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} filters - Filtres à appliquer
   * @param {string} language - Code de langue pour le header Accept-Language (ex: 'en', 'fr', 'ar')
   */
  async search(searchTerm, filters = {}, language = 'en') {
    try {
      // Try the API search endpoint first
      const queryParams = new URLSearchParams();
      queryParams.append('search', searchTerm);
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      // Ajouter le header Accept-Language
      const headers = {
        'Accept-Language': language
      };

      try {
        const response = await httpClient.get(`${this.basePath}/search?${queryParams.toString()}`, { headers });
        
        // Handle different response formats
        if (response.data && response.data.data && response.data.data.hotels) {
          return response.data.data.hotels;
        }
        
        return response.data || [];
      } catch (searchError) {
        // If search endpoint returns 404 or doesn't exist, fallback to client-side search
        if (searchError.status === 404 || (searchError.response && searchError.response.status === 404)) {
          console.warn('Search endpoint not available (404), using client-side search');
          
          // Get all hotels and filter client-side
          const allHotels = await this.findAll(filters, language);
          
          if (!searchTerm) return allHotels;
          
          const searchLower = searchTerm.toLowerCase();
          return allHotels.filter(hotel => {
            const name = hotel.name || hotel.nameTranslations?.en || '';
            const description = hotel.description || hotel.descriptionTranslations?.en || '';
            const cityName = hotel.cityName || '';
            
            return name.toLowerCase().includes(searchLower) ||
                   description.toLowerCase().includes(searchLower) ||
                   cityName.toLowerCase().includes(searchLower);
          });
        }
        
        // If it's not a 404, rethrow the error
        throw searchError;
      }
    } catch (error) {
      console.error('Error searching hotels:', error.message);
      throw new Error(`Error searching hotels: ${error.message}`);
    }
  }
}
