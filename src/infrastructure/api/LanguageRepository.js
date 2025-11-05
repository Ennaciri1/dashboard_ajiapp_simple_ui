import { ILanguageRepository } from '../../core/interfaces/repositories/ILanguageRepository.js';
import httpClient from './httpClient.js';

/**
 * Implémentation concrète du repository des langues
 * Utilise l'API HTTP pour la persistance
 */
export class LanguageRepository extends ILanguageRepository {
  constructor() {
    super();
    this.basePath = '/supported-languages';
  }

  /**
   * Récupère toutes les langues
   */
  async findAll() {
    try {
      const response = await httpClient.get(this.basePath);
      
      // Gestion du format de réponse de l'API réelle : { code, message, data: [...], error }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Format de réponse simple
      return response.data || [];
    } catch (error) {
      console.error('Error fetching languages:', error.message);
      throw new Error(`Error fetching languages: ${error.message}`);
    }
  }

  /**
   * Récupère une langue par son ID
   */
  async findById(id) {
    try {
      const response = await httpClient.get(`${this.basePath}/${id}`);
      
      // Gestion du format de réponse de l'API réelle
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data || null;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(`Error fetching language ${id}: ${error.message}`);
    }
  }

  /**
   * Récupère une langue par son code
   */
  async findByCode(code) {
    try {
      const allLanguages = await this.findAll();
      return allLanguages.find(lang => lang.code === code) || null;
    } catch (error) {
      throw new Error(`Error searching language by code: ${error.message}`);
    }
  }

  /**
   * Crée une nouvelle langue
   */
  async create(language) {
    try {
      // Accepter soit une entité Language, soit des données brutes
      const dataToSend = language && typeof language.toJSON === 'function' 
        ? language.toJSON() 
        : language;
      
      const response = await httpClient.post(this.basePath, dataToSend);
      
      // Gestion du format de réponse de l'API réelle
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Error creating language: ${error.message}`);
    }
  }

  /**
   * Met à jour une langue existante
   */
  async update(id, language) {
    try {
      // Accepter soit une entité Language, soit des données brutes
      const dataToSend = language && typeof language.toJSON === 'function' 
        ? language.toJSON() 
        : language;
      
      const response = await httpClient.put(`${this.basePath}/${id}`, dataToSend);
      
      // Gestion du format de réponse de l'API réelle
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Error updating language ${id}: ${error.message}`);
    }
  }

  /**
   * Supprime une langue
   */
  async delete(id) {
    try {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Error deleting language ${id}: ${error.message}`);
    }
  }
}

