/**
 * Interface pour le repository des stades
 * Définit les contrats pour la persistance des données des stades
 */
/* eslint-disable no-unused-vars */
export class IStadiumRepository {
  /**
   * Récupère tous les stades
   * @param {Object} filters - Filtres optionnels
   * @returns {Promise<Array>} Liste des stades
   */
  async findAll(_filters = {}) {
    throw new Error('findAll method must be implemented');
  }

  /**
   * Récupère un stade par son ID
   * @param {string} id - ID du stade
   * @returns {Promise<Object|null>} Stade trouvé ou null
   */
  async findById(_id) {
    throw new Error('findById method must be implemented');
  }

  /**
   * Crée un nouveau stade
   * @param {Stadium} stadium - Instance du stade à créer
   * @returns {Promise<Object>} Stade créé
   */
  async create(_stadium) {
    throw new Error('create method must be implemented');
  }

  /**
   * Met à jour un stade existant
   * @param {string} id - ID du stade
   * @param {Stadium} stadium - Instance du stade à mettre à jour
   * @returns {Promise<Object>} Stade mis à jour
   */
  async update(_id, _stadium) {
    throw new Error('update method must be implemented');
  }

  /**
   * Supprime un stade
   * @param {string} id - ID du stade
   * @returns {Promise<boolean>} True si supprimé avec succès
   */
  async delete(_id) {
    throw new Error('delete method must be implemented');
  }

  /**
   * Recherche des stades par ville
   * @param {string} cityId - ID de la ville
   * @returns {Promise<Array>} Liste des stades de la ville
   */
  async findByCity(_cityId) {
    throw new Error('findByCity method must be implemented');
  }

  /**
   * Recherche des stades par capacité minimale
   * @param {number} minCapacity - Capacité minimale
   * @returns {Promise<Array>} Liste des stades
   */
  async findByMinCapacity(_minCapacity) {
    throw new Error('findByMinCapacity method must be implemented');
  }
}

