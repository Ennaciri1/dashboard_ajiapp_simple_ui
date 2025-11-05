import { Hotel } from '../../entities/Hotel.js';

/**
 * Use case: Get hotels list
 */
export class GetHotelsUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Executes the use case
   * @param {Object} params - Search parameters
   * @param {Object} params.filters - Filters to apply
   * @param {string} params.searchTerm - Search term
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @returns {Promise<{hotels: Hotel[], total: number}>}
   */
  async execute({ filters = {}, searchTerm = '', sortBy = 'name', sortOrder = 'asc', language = 'en' } = {}) {
    try {
      // Validate parameters
      this._validateParams({ filters, searchTerm, sortBy, sortOrder });

      // Retrieval of hotels
      let hotels;
      if (searchTerm) {
        hotels = await this.hotelRepository.search(searchTerm, filters, language);
      } else {
        hotels = await this.hotelRepository.findAll(filters, language);
      }

      // Ensure hotels is an array
      if (!Array.isArray(hotels)) {
        console.warn('Repository did not return an array for hotels:', hotels);
        return { hotels: [], total: 0 };
      }

      // Convert to Hotel entities
      console.log('GetHotelsUseCase - Raw hotels from repository:', hotels);
      console.log('GetHotelsUseCase - Is array?', Array.isArray(hotels));
      console.log('GetHotelsUseCase - Length:', Array.isArray(hotels) ? hotels.length : 'N/A');

      const hotelEntities = hotels.map(hotelData => {
        // Ensure we have valid data
        if (!hotelData) {
          console.warn('Invalid hotel data:', hotelData);
          return null;
        }
        
        // API response format: { id, name, description, cityId, cityName, location, images, priceRange, likesCount, active, ... }
        // API returns data directly in the selected language
        console.log('GetHotelsUseCase - Mapping hotelData:', hotelData);
        
        // Preserve raw data from API first
        const rawData = {
          cityName: hotelData.cityName || '',
          cityId: hotelData.cityId || '',
          location: hotelData.location || {},
          priceRange: hotelData.priceRange || {},
          likesCount: hotelData.likesCount || 0,
          active: hotelData.active !== undefined ? hotelData.active : false
        };
        
        const hotelEntity = Hotel.fromJSON({
          id: hotelData.id,
          name: hotelData.name || '', // API returns name directly
          location: hotelData.location || {}, // API returns location object with latitude, longitude
          description: hotelData.description || '', // API returns description directly
          amenities: hotelData.amenities || [],
          rating: hotelData.rating || null,
          priceRange: hotelData.priceRange || {}, // API returns priceRange object with minPrice, maxPrice
          images: hotelData.images || [],
          contactInfo: hotelData.contactInfo || {},
          status: hotelData.active !== undefined ? (hotelData.active ? 'active' : 'inactive') : 
                  (hotelData.isActive !== undefined ? (hotelData.isActive ? 'active' : 'inactive') : 
                  (hotelData.status || 'active')),
          createdAt: hotelData.createdAt,
          updatedAt: hotelData.updatedAt,
          _rawData: rawData // Pass raw data to constructor
        });
        
        // Ensure _rawData is set (in case fromJSON doesn't preserve it)
        if (!hotelEntity._rawData) {
          hotelEntity._rawData = rawData;
        }
        
        console.log('GetHotelsUseCase - Created hotelEntity:', hotelEntity);
        console.log('GetHotelsUseCase - hotelEntity.name:', hotelEntity.name);
        console.log('GetHotelsUseCase - hotelEntity._rawData:', hotelEntity._rawData);
        
        return hotelEntity;
      }).filter(hotel => hotel !== null); // Remove any null entries
      
      console.log('GetHotelsUseCase - After mapping, hotelEntities count:', hotelEntities.length);

      // Don't filter by active status - show all hotels regardless of active status
      // The UI can filter if needed, but for now show all hotels
      // Sort
      const sortedHotels = this._sortHotels(hotelEntities, sortBy, sortOrder);
      
      console.log('GetHotelsUseCase - After mapping, hotelEntities count:', hotelEntities.length);
      console.log('GetHotelsUseCase - After sorting, sortedHotels count:', sortedHotels.length);

      return {
        hotels: sortedHotels,
        total: sortedHotels.length
      };
    } catch (error) {
      throw new Error(`Error fetching hotels: ${error.message}`);
    }
  }

  /**
   * Validates input parameters
   */
  _validateParams({ filters, searchTerm, sortBy, sortOrder }) {
    if (typeof filters !== 'object') {
      throw new Error('Filters must be an object');
    }

    if (typeof searchTerm !== 'string') {
      throw new Error('Search term must be a string');
    }

    const validSortFields = ['name', 'location', 'rating', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error(`Sort order must be 'asc' or 'desc'`);
    }
  }

  /**
   * Sorts hotels according to criteria
   */
  _sortHotels(hotels, sortBy, sortOrder) {
    return hotels.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle null/undefined values
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortOrder === 'asc' ? 1 : -1;
      if (valueB == null) return sortOrder === 'asc' ? -1 : 1;

      // Handle strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Comparison
      let comparison = 0;
      if (valueA > valueB) comparison = 1;
      else if (valueA < valueB) comparison = -1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}