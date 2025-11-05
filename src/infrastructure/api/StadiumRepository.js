import { IStadiumRepository } from '../../core/interfaces/repositories/IStadiumRepository.js';
import httpClient from './httpClient.js';

/**
 * Implémentation concrète du repository des stades
 * Utilise l'API HTTP pour la persistance
 */
export class StadiumRepository extends IStadiumRepository {
  constructor() {
    super();
    this.basePath = '/stadiums';
  }

  /**
   * Récupère tous les stades
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
      
      // Handle different API response formats
      let stadiums = [];
      if (response.data) {
        if (response.data.data && response.data.data.stadiums) {
          stadiums = response.data.data.stadiums;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          stadiums = response.data.data;
        } else if (response.data.stadiums && Array.isArray(response.data.stadiums)) {
          stadiums = response.data.stadiums;
        } else if (Array.isArray(response.data)) {
          stadiums = response.data;
        }
      }
      
      // Ensure we return an array
      return Array.isArray(stadiums) ? stadiums : [];
    } catch (error) {
      throw new Error(`Error fetching stadiums: ${error.message}`);
    }
  }

  /**
   * Récupère un stade par son ID
   */
  async findById(id) {
    try {
      const response = await httpClient.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(`Error fetching stadium ${id}: ${error.message}`);
    }
  }

  /**
   * Crée un nouveau stade
   * Accepte soit une entité Stadium, soit des données brutes
   */
  async create(stadium) {
    try {
      // Gérer les deux formats : entité Stadium ou données brutes
      const stadiumData = stadium.toJSON ? stadium.toJSON() : stadium;
      
      const response = await httpClient.post(this.basePath, stadiumData);
      return response.data;
    } catch (error) {
      throw new Error(`Error creating stadium: ${error.message}`);
    }
  }

  /**
   * Met à jour un stade existant
   * Accepte soit une entité Stadium, soit des données brutes
   */
  async update(id, stadium) {
    try {
      // Gérer les deux formats : entité Stadium ou données brutes
      const stadiumData = stadium.toJSON ? stadium.toJSON() : stadium;
      
      const response = await httpClient.put(`${this.basePath}/${id}`, stadiumData);
      return response.data;
    } catch (error) {
      throw new Error(`Error updating stadium ${id}: ${error.message}`);
    }
  }

  /**
   * Supprime un stade
   */
  async delete(id) {
    try {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Error deleting stadium ${id}: ${error.message}`);
    }
  }

  /**
   * Recherche des stades par ville
   */
  async findByCity(cityId) {
    try {
      const response = await httpClient.get(`${this.basePath}/by-city/${encodeURIComponent(cityId)}`);
      return response.data?.stadiums || response.data || [];
    } catch (error) {
      throw new Error(`Error searching by city: ${error.message}`);
    }
  }

  /**
   * Recherche des stades par capacité minimale
   */
  async findByMinCapacity(minCapacity) {
    try {
      const response = await httpClient.get(`${this.basePath}/by-capacity/${minCapacity}`);
      return response.data?.stadiums || response.data || [];
    } catch (error) {
      throw new Error(`Error searching by capacity: ${error.message}`);
    }
  }

  /**
   * Recherche des stades par critères
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
        
        // Handle different API response formats
        let stadiums = [];
        if (response.data) {
          if (response.data.data && response.data.data.stadiums) {
            stadiums = response.data.data.stadiums;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            stadiums = response.data.data;
          } else if (response.data.stadiums && Array.isArray(response.data.stadiums)) {
            stadiums = response.data.stadiums;
          } else if (Array.isArray(response.data)) {
            stadiums = response.data;
          }
        }
        
        return Array.isArray(stadiums) ? stadiums : [];
      } catch {
        const allStadiums = await this.findAll(filters, language);
        
        if (!searchTerm) return allStadiums;
        
        const searchLower = searchTerm.toLowerCase();
        return allStadiums.filter(stadium => {
          const name = stadium.name || stadium.nameTranslations?.en || '';
          const description = stadium.description || stadium.descriptionTranslations?.en || '';
          const cityName = stadium.cityName || '';
          
          return name.toLowerCase().includes(searchLower) ||
                 description.toLowerCase().includes(searchLower) ||
                 cityName.toLowerCase().includes(searchLower);
        });
      }
    } catch (error) {
      throw new Error(`Error searching stadiums: ${error.message}`);
    }
  }
}

