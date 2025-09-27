/**
 * Interface pour le repository des sites touristiques
 */
export class ITouristSpotRepository {
  /**
   * Récupère tous les sites touristiques
   * @param {Object} filters - Filtres à appliquer
   * @returns {Promise<TouristSpot[]>}
   */
  async findAll(filters = {}) {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Récupère un site touristique par son ID
   * @param {string|number} id - ID du site
   * @returns {Promise<TouristSpot|null>}
   */
  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Crée un nouveau site touristique
   * @param {TouristSpot} spot - Entité site touristique à créer
   * @returns {Promise<TouristSpot>}
   */
  async create(spot) {
    throw new Error('Method create must be implemented');
  }

  /**
   * Met à jour un site touristique existant
   * @param {string|number} id - ID du site
   * @param {TouristSpot} spot - Données du site à mettre à jour
   * @returns {Promise<TouristSpot>}
   */
  async update(id, spot) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Supprime un site touristique
   * @param {string|number} id - ID du site à supprimer
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Recherche des sites par ville
   * @param {string} city - Nom de la ville
   * @returns {Promise<TouristSpot[]>}
   */
  async findByCity(city) {
    throw new Error('Method findByCity must be implemented');
  }

  /**
   * Recherche des sites par type d'intérêt
   * @param {string} interestType - Type d'intérêt
   * @returns {Promise<TouristSpot[]>}
   */
  async findByInterestType(interestType) {
    throw new Error('Method findByInterestType must be implemented');
  }
}
