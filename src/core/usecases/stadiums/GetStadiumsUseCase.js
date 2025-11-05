import { Stadium } from '../../entities/Stadium.js';

/**
 * Cas d'usage : Récupérer la liste des stades
 */
export class GetStadiumsUseCase {
  constructor(stadiumRepository) {
    this.stadiumRepository = stadiumRepository;
  }

  async execute({ filters = {}, searchTerm = '', sortBy = 'name', sortOrder = 'asc', language = 'en' } = {}) {
    try {
      this._validateParams({ filters, searchTerm, sortBy, sortOrder });

      let stadiums;
      if (searchTerm) {
        stadiums = await this.stadiumRepository.search(searchTerm, filters, language);
      } else {
        stadiums = await this.stadiumRepository.findAll(filters, language);
      }

      // Ensure stadiums is an array
      if (!Array.isArray(stadiums)) {
        console.warn('Repository did not return an array for stadiums:', stadiums);
        return {
          stadiums: [],
          total: 0
        };
      }

      const stadiumEntities = stadiums.map(stadiumData => {
        return Stadium.fromJSON({
          id: stadiumData.id,
          name: stadiumData.nameTranslations?.en || stadiumData.name || '',
          description: stadiumData.descriptionTranslations?.en || stadiumData.description || '',
          cityId: stadiumData.cityId || '',
          cityName: stadiumData.cityName || '',
          location: stadiumData.location || {},
          images: stadiumData.images || [],
          capacity: stadiumData.capacity || 0,
          inauguration: stadiumData.inauguration || null,
          homeGround: stadiumData.homeGround || '',
          status: stadiumData.isActive !== undefined ? (stadiumData.isActive ? 'active' : 'inactive') : 
                  stadiumData.active !== undefined ? (stadiumData.active ? 'active' : 'inactive') : 
                  stadiumData.status || 'active',
          createdAt: stadiumData.createdAt,
          updatedAt: stadiumData.updatedAt,
          createdBy: stadiumData.createdBy,
          updatedBy: stadiumData.updatedBy
        });
      });

      // Don't filter by active status - show all stadiums regardless of active status
      // The UI can filter if needed, but for now show all stadiums
      const sortedStadiums = this._sortStadiums(stadiumEntities, sortBy, sortOrder);
      
      console.log('GetStadiumsUseCase - After mapping, stadiumEntities count:', stadiumEntities.length);
      console.log('GetStadiumsUseCase - After sorting, sortedStadiums count:', sortedStadiums.length);

      return {
        stadiums: sortedStadiums,
        total: sortedStadiums.length
      };
    } catch (error) {
      throw new Error(`Error fetching stadiums: ${error.message}`);
    }
  }

  _validateParams({ filters, searchTerm, sortBy, sortOrder }) {
    if (typeof filters !== 'object') {
      throw new Error('Filters must be an object');
    }

    if (typeof searchTerm !== 'string') {
      throw new Error('Search term must be a string');
    }

    const validSortFields = ['name', 'cityName', 'capacity', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error(`Sort order must be 'asc' or 'desc'`);
    }
  }

  _sortStadiums(stadiums, sortBy, sortOrder) {
    return stadiums.sort((a, b) => {
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
