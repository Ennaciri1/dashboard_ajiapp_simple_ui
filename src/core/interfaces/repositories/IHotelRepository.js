/**
 * Interface pour le repository des hôtels
 * Définit les contrats que doit respecter toute implémentation
 */
/* eslint-disable no-unused-vars */
export class IHotelRepository {
  /**
   * Récupère tous les hôtels
   * @param {Object} filters - Filtres à appliquer
   * @returns {Promise<Hotel[]>}
   */
  async findAll(_filters = {}) {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Récupère un hôtel par son ID
   * @param {string|number} id - ID de l'hôtel
   * @returns {Promise<Hotel|null>}
   */
  async findById(_id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Crée un nouvel hôtel
   * @param {Hotel} hotel - Entité hôtel à créer
   * @returns {Promise<Hotel>}
   */
  async create(_hotel) {
    throw new Error('Method create must be implemented');
  }

  /**
   * Met à jour un hôtel existant
   * @param {string|number} id - ID de l'hôtel
   * @param {Hotel} hotel - Données de l'hôtel à mettre à jour
   * @returns {Promise<Hotel>}
   */
  async update(_id, _hotel) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Supprime un hôtel
   * @param {string|number} id - ID de l'hôtel à supprimer
   * @returns {Promise<boolean>}
   */
  async delete(_id) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Recherche des hôtels par critères
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} filters - Filtres additionnels
   * @returns {Promise<Hotel[]>}
   */
  async search(_searchTerm, _filters = {}) {
    throw new Error('Method search must be implemented');
  }
}
