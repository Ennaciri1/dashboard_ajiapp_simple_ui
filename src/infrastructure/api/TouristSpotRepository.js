import { ITouristSpotRepository } from '../../core/interfaces/repositories/ITouristSpotRepository.js';
import httpClient from './httpClient.js';

/**
 * Implémentation concrète du repository des sites touristiques
 * Utilise l'API HTTP pour la persistance
 */
export class TouristSpotRepository extends ITouristSpotRepository {
  constructor() {
    super();
    this.basePath = '/tourist-spots';
  }

  /**
   * Récupère tous les sites touristiques
   * @param {Object} filters - Filtres à appliquer
   * @param {string} language - Code de langue pour le header Accept-Language (ex: 'en', 'fr', 'ar')
   */
  async findAll(filters = {}, language = 'en') {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajout des filtres comme paramètres de requête
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
      
      console.log('TouristSpotRepository.findAll - Full response:', response);
      console.log('TouristSpotRepository.findAll - response.data:', response.data);
      
      // Gestion du format de réponse de l'API réelle : { code, message, data: { spots, total, language }, error }
      if (response.data) {
        // Format API: { code, message, data: { spots: [...], total, language }, error }
        if (response.data.data && response.data.data.spots) {
          console.log('TouristSpotRepository.findAll - Found spots in response.data.data.spots:', response.data.data.spots.length);
          return response.data.data.spots;
        }
        
        // Si response.data est directement un tableau
        if (Array.isArray(response.data)) {
          console.log('TouristSpotRepository.findAll - response.data is array:', response.data.length);
          return response.data;
        }
        
        // Si response.data.data est directement un tableau
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('TouristSpotRepository.findAll - response.data.data is array:', response.data.data.length);
          return response.data.data;
        }
      }
      
      console.warn('TouristSpotRepository.findAll - No valid spots array found, returning empty array');
      return [];
    } catch (error) {
      console.error('Error fetching tourist spots:', error.message);
      throw new Error(`Error fetching tourist spots: ${error.message}`);
    }
  }

  /**
   * Récupère un site touristique par son ID
   */
  async findById(id) {
    try {
      const response = await httpClient.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(`Error fetching tourist spot ${id}: ${error.message}`);
    }
  }

  /**
   * Crée un nouveau site touristique
   */
  async create(spot) {
    try {
      // Accepter soit une entité TouristSpot, soit des données brutes
      const dataToSend = spot && typeof spot.toJSON === 'function' 
        ? spot.toJSON() 
        : spot;
      
      const response = await httpClient.post(this.basePath, dataToSend);
      return response.data;
    } catch (error) {
      throw new Error(`Error creating tourist spot: ${error.message}`);
    }
  }

  /**
   * Met à jour un site touristique existant
   */
  async update(id, spot) {
    try {
      // Accepter soit une entité TouristSpot, soit des données brutes
      const dataToSend = spot && typeof spot.toJSON === 'function' 
        ? spot.toJSON() 
        : spot;
      
      const response = await httpClient.put(`${this.basePath}/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      throw new Error(`Error updating tourist spot ${id}: ${error.message}`);
    }
  }

  /**
   * Supprime un site touristique
   */
  async delete(id) {
    try {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Error deleting tourist spot ${id}: ${error.message}`);
    }
  }

  /**
   * Recherche des sites par ville
   */
  async findByCity(city) {
    try {
      const response = await httpClient.get(`${this.basePath}/by-city/${encodeURIComponent(city)}`);
      return response.data || [];
    } catch (error) {
      throw new Error(`Error searching by city: ${error.message}`);
    }
  }

  /**
   * Recherche des sites par type d'intérêt
   */
  async findByInterestType(interestType) {
    try {
      const response = await httpClient.get(`${this.basePath}/by-interest/${encodeURIComponent(interestType)}`);
      return response.data || [];
    } catch (error) {
      throw new Error(`Error searching by interest type: ${error.message}`);
    }
  }

  /**
   * Recherche des sites touristiques par critères
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} filters - Filtres à appliquer
   * @param {string} language - Code de langue pour le header Accept-Language (ex: 'en', 'fr', 'ar')
   */
  async search(searchTerm, filters = {}, language = 'en') {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('search', searchTerm);
      
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
        
        // Gestion du format de réponse de l'API réelle
        if (response.data && response.data.data && response.data.data.spots) {
          return response.data.data.spots;
        }
        
        return response.data || [];
      } catch {
        // Si l'endpoint de recherche n'existe pas, faire la recherche côté client
        const allSpots = await this.findAll(filters, language);
        
        if (!searchTerm) return allSpots;
        
        // S'assurer que allSpots est un tableau
        if (!Array.isArray(allSpots)) {
          console.warn('findAll did not return an array:', allSpots);
          return [];
        }
        
        const searchLower = searchTerm.toLowerCase();
        return allSpots.filter(spot => {
          const name = spot.name || spot.nameTranslations?.en || '';
          const description = spot.description || spot.descriptionTranslations?.en || '';
          const city = spot.cityName || spot.city || '';
          
          return name.toLowerCase().includes(searchLower) ||
                 description.toLowerCase().includes(searchLower) ||
                 city.toLowerCase().includes(searchLower);
        });
      }
    } catch (error) {
      throw new Error(`Error searching tourist spots: ${error.message}`);
    }
  }
}
