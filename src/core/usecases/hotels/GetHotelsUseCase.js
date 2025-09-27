import { Hotel } from '../../entities/Hotel.js';

/**
 * Cas d'usage : Récupérer la liste des hôtels
 */
export class GetHotelsUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Exécute le cas d'usage
   * @param {Object} params - Paramètres de recherche
   * @param {Object} params.filters - Filtres à appliquer
   * @param {string} params.searchTerm - Terme de recherche
   * @param {string} params.sortBy - Champ de tri
   * @param {string} params.sortOrder - Ordre de tri (asc/desc)
   * @returns {Promise<{hotels: Hotel[], total: number}>}
   */
  async execute({ filters = {}, searchTerm = '', sortBy = 'name', sortOrder = 'asc' } = {}) {
    try {
      // Validation des paramètres
      this._validateParams({ filters, searchTerm, sortBy, sortOrder });

      // Récupération des hôtels
      let hotels;
      if (searchTerm) {
        hotels = await this.hotelRepository.search(searchTerm, filters);
      } else {
        hotels = await this.hotelRepository.findAll(filters);
      }

      // Conversion en entités Hotel
      const hotelEntities = hotels.map(hotelData => Hotel.fromJSON(hotelData));

      // Filtrage des hôtels actifs seulement
      const activeHotels = hotelEntities.filter(hotel => hotel.isActive());

      // Tri
      const sortedHotels = this._sortHotels(activeHotels, sortBy, sortOrder);

      return {
        hotels: sortedHotels,
        total: sortedHotels.length
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des hôtels: ${error.message}`);
    }
  }

  /**
   * Valide les paramètres d'entrée
   */
  _validateParams({ filters, searchTerm, sortBy, sortOrder }) {
    if (typeof filters !== 'object') {
      throw new Error('Les filtres doivent être un objet');
    }

    if (typeof searchTerm !== 'string') {
      throw new Error('Le terme de recherche doit être une chaîne de caractères');
    }

    const validSortFields = ['name', 'location', 'rating', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Le champ de tri doit être l'un de: ${validSortFields.join(', ')}`);
    }

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error(`L'ordre de tri doit être 'asc' ou 'desc'`);
    }
  }

  /**
   * Trie les hôtels selon les critères
   */
  _sortHotels(hotels, sortBy, sortOrder) {
    return hotels.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Gestion des valeurs nulles/undefined
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortOrder === 'asc' ? 1 : -1;
      if (valueB == null) return sortOrder === 'asc' ? -1 : 1;

      // Gestion des chaînes de caractères
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Comparaison
      let comparison = 0;
      if (valueA > valueB) comparison = 1;
      else if (valueA < valueB) comparison = -1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}
