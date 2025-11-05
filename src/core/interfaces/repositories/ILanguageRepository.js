/**
 * Interface pour le repository des langues
 * Définit les contrats que doit respecter toute implémentation
 */
/* eslint-disable no-unused-vars */
export class ILanguageRepository {
  /**
   * Récupère toutes les langues
   * @returns {Promise<Language[]>}
   */
  async findAll() {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Récupère une langue par son ID
   * @param {string|number} id - ID de la langue
   * @returns {Promise<Language|null>}
   */
  async findById(_id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Récupère une langue par son code
   * @param {string} code - Code de la langue (ex: 'en', 'fr')
   * @returns {Promise<Language|null>}
   */
  async findByCode(_code) {
    throw new Error('Method findByCode must be implemented');
  }

  /**
   * Crée une nouvelle langue
   * @param {Language|Object} language - Entité langue ou données à créer
   * @returns {Promise<Language>}
   */
  async create(_language) {
    throw new Error('Method create must be implemented');
  }

  /**
   * Met à jour une langue existante
   * @param {string|number} id - ID de la langue
   * @param {Language|Object} language - Données de la langue à mettre à jour
   * @returns {Promise<Language>}
   */
  async update(_id, _language) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Supprime une langue
   * @param {string|number} id - ID de la langue à supprimer
   * @returns {Promise<boolean>}
   */
  async delete(_id) {
    throw new Error('Method delete must be implemented');
  }
}

