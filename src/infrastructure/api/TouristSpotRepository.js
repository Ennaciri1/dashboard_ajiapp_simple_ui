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
   */
  async findAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
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
      throw new Error(`Erreur lors de la récupération des sites touristiques: ${error.message}`);
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
      throw new Error(`Erreur lors de la récupération du site ${id}: ${error.message}`);
    }
  }

  /**
   * Crée un nouveau site touristique
   */
  async create(spot) {
    try {
      const response = await httpClient.post(this.basePath, spot.toJSON());
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création du site touristique: ${error.message}`);
    }
  }

  /**
   * Met à jour un site touristique existant
   */
  async update(id, spot) {
    try {
      const response = await httpClient.put(`${this.basePath}/${id}`, spot.toJSON());
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du site ${id}: ${error.message}`);
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
      throw new Error(`Erreur lors de la suppression du site ${id}: ${error.message}`);
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
      throw new Error(`Erreur lors de la recherche par ville: ${error.message}`);
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
      throw new Error(`Erreur lors de la recherche par type d'intérêt: ${error.message}`);
    }
  }
}
