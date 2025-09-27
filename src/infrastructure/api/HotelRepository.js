import { IHotelRepository } from '../../core/interfaces/repositories/IHotelRepository.js';
import httpClient from './httpClient.js';

/**
 * Implémentation concrète du repository des hôtels
 * Utilise l'API HTTP pour la persistance
 */
export class HotelRepository extends IHotelRepository {
  constructor() {
    super();
    this.basePath = '/hotels';
  }

  /**
   * Récupère tous les hôtels
   */
  async findAll(filters = {}) {
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

      const response = await httpClient.get(url);
      return response.data || [];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des hôtels: ${error.message}`);
    }
  }

  /**
   * Récupère un hôtel par son ID
   */
  async findById(id) {
    try {
      const response = await httpClient.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(`Erreur lors de la récupération de l'hôtel ${id}: ${error.message}`);
    }
  }

  /**
   * Crée un nouvel hôtel
   */
  async create(hotel) {
    try {
      const response = await httpClient.post(this.basePath, hotel.toJSON());
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'hôtel: ${error.message}`);
    }
  }

  /**
   * Met à jour un hôtel existant
   */
  async update(id, hotel) {
    try {
      const response = await httpClient.put(`${this.basePath}/${id}`, hotel.toJSON());
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'hôtel ${id}: ${error.message}`);
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
      throw new Error(`Erreur lors de la suppression de l'hôtel ${id}: ${error.message}`);
    }
  }

  /**
   * Recherche des hôtels par critères
   */
  async search(searchTerm, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('search', searchTerm);
      
      // Ajout des filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await httpClient.get(`${this.basePath}/search?${queryParams.toString()}`);
      return response.data || [];
    } catch (error) {
      throw new Error(`Erreur lors de la recherche d'hôtels: ${error.message}`);
    }
  }
}
