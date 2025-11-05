import { TouristSpot } from '../../entities/TouristSpot.js';

/**
 * Cas d'usage : Récupérer la liste des sites touristiques
 */
export class GetTouristSpotsUseCase {
  constructor(touristSpotRepository) {
    this.touristSpotRepository = touristSpotRepository;
  }

  /**
   * Exécute le cas d'usage
   * @param {Object} params - Paramètres de recherche
   * @param {Object} params.filters - Filtres à appliquer
   * @param {string} params.searchTerm - Terme de recherche
   * @param {string} params.sortBy - Champ de tri
   * @param {string} params.sortOrder - Ordre de tri (asc/desc)
   * @param {string} params.language - Code de langue pour le header Accept-Language (ex: 'en', 'fr', 'ar')
   * @returns {Promise<{spots: TouristSpot[], total: number}>}
   */
  async execute({ filters = {}, searchTerm = '', sortBy = 'name', sortOrder = 'asc', language = 'en' } = {}) {
    try {
      this._validateParams({ filters, searchTerm, sortBy, sortOrder });

      let spots;
      if (searchTerm) {
        spots = await this.touristSpotRepository.search(searchTerm, filters, language);
      } else {
        spots = await this.touristSpotRepository.findAll(filters, language);
      }

      console.log('GetTouristSpotsUseCase - Raw spots from repository:', spots);
      console.log('GetTouristSpotsUseCase - Is array?', Array.isArray(spots));
      console.log('GetTouristSpotsUseCase - Length:', Array.isArray(spots) ? spots.length : 'N/A');

      // S'assurer que spots est un tableau
      if (!Array.isArray(spots)) {
        console.warn('Repository did not return an array:', spots);
        return {
          spots: [],
          total: 0
        };
      }

      const spotEntities = spots.map(spotData => {
        // The API returns data directly in the selected language
        // API response format: { code, message, data: { spots: [...], total, language }, error }
        // Each spot has: id, name, description, location, images, cityName, cityId, address, 
        // openingTime, closingTime, paidEntry (boolean), active (boolean), etc.
        console.log('GetTouristSpotsUseCase - Mapping spotData:', spotData);
        
        return TouristSpot.fromJSON({
          id: spotData.id,
          name: spotData.name || '',
          city: spotData.cityName || spotData.city || '',
          description: spotData.description || '',
          interestTypes: spotData.interestTypes || [],
          coordinates: spotData.location ? {
            lat: spotData.location.latitude,
            lng: spotData.location.longitude
          } : {},
          images: spotData.images || [],
          openingHours: spotData.openingTime && spotData.closingTime ? {
            openingTime: spotData.openingTime,
            closingTime: spotData.closingTime
          } : (spotData.openingHours || {}),
          entryFee: spotData.paidEntry !== undefined ? (spotData.paidEntry ? 'paid' : 'free') : (spotData.entryFee || ''),
          rating: spotData.rating || null,
          status: spotData.active !== undefined ? (spotData.active ? 'active' : 'inactive') : 
                  (spotData.isActive !== undefined ? (spotData.isActive ? 'active' : 'inactive') : 
                  (spotData.status || 'active')),
          createdAt: spotData.createdAt,
          updatedAt: spotData.updatedAt,
          // Keep raw data for components that need it
          _rawData: {
            address: spotData.address || '',
            cityName: spotData.cityName || '',
            cityId: spotData.cityId || '',
            paidEntry: spotData.paidEntry !== undefined ? spotData.paidEntry : false,
            active: spotData.active !== undefined ? spotData.active : false,
            openingTime: spotData.openingTime || '',
            closingTime: spotData.closingTime || '',
            likes: spotData.likes || 0
          }
        });
      });

      // Don't filter by active status - show all spots regardless of active status
      // The UI can filter if needed, but for now show all spots
      const sortedSpots = this._sortSpots(spotEntities, sortBy, sortOrder);

      console.log('GetTouristSpotsUseCase - After mapping, spotEntities count:', spotEntities.length);
      console.log('GetTouristSpotsUseCase - After sorting, sortedSpots count:', sortedSpots.length);

      return {
        spots: sortedSpots,
        total: sortedSpots.length
      };
    } catch (error) {
      throw new Error(`Error fetching tourist spots: ${error.message}`);
    }
  }

  _validateParams({ filters, searchTerm, sortBy, sortOrder }) {
    if (typeof filters !== 'object') {
      throw new Error('Les filtres doivent être un objet');
    }

    if (typeof searchTerm !== 'string') {
      throw new Error('Le terme de recherche doit être une chaîne de caractères');
    }

    const validSortFields = ['name', 'city', 'rating', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Le champ de tri doit être l'un de: ${validSortFields.join(', ')}`);
    }

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error(`L'ordre de tri doit être 'asc' ou 'desc'`);
    }
  }

  _sortSpots(spots, sortBy, sortOrder) {
    return spots.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortOrder === 'asc' ? 1 : -1;
      if (valueB == null) return sortOrder === 'asc' ? -1 : 1;

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      let comparison = 0;
      if (valueA > valueB) comparison = 1;
      else if (valueA < valueB) comparison = -1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}
