import { Hotel } from '../../entities/Hotel.js';
import { cityService } from '../../../infrastructure/api/cityService.js';
import { validateCreationTranslations } from '../../../shared/utils/translationValidator.js';

/**
 * Use case: Create a new hotel
 */
export class CreateHotelUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Executes the use case
   * @param {Object} hotelData - Hotel data to create (can be raw data or an entity)
   * @returns {Promise<Hotel>}
   */
  async execute(hotelData) {
    try {
      // If it's already a Hotel entity, use it directly
      let hotel;
      if (hotelData instanceof Hotel) {
        hotel = hotelData;
      } else {
        // Otherwise, create a Hotel entity from the data
        // Convert API data to entity format
        
        // Get city name from cityId if needed
        let cityName = hotelData.cityName || '';
        
        // If we only have cityId, fetch the city name
        if (!cityName && hotelData.cityId) {
          try {
            const cityResponse = await cityService.getCityById(hotelData.cityId);
            // Handle different response formats
            const cityData = cityResponse.data?.data || cityResponse.data || cityResponse;
            cityName = cityData.nameTranslations?.en || cityData.name || cityData.id || hotelData.cityId;
          } catch (error) {
            console.warn('Could not fetch city name, using cityId:', error);
            cityName = hotelData.cityId; // Fallback to ID if request fails
          }
        }
        
        // If still no city name, use ID as final fallback
        if (!cityName) {
          // If location is an object, try to extract cityName from it
          if (hotelData.location && typeof hotelData.location === 'object') {
            cityName = hotelData.location.cityName || hotelData.location.city || '';
          } else if (typeof hotelData.location === 'string') {
            cityName = hotelData.location;
          } else {
            cityName = hotelData.cityId || 'Unknown City';
          }
        }
        
        const hotelEntityData = {
          id: hotelData.id,
          name: hotelData.nameTranslations?.en || hotelData.name || '',
          location: cityName, // Use the retrieved city name
          description: hotelData.descriptionTranslations?.en || hotelData.description || '',
          amenities: hotelData.amenities || [],
          rating: hotelData.rating || null,
          priceRange: hotelData.priceRange || {},
          images: hotelData.images || [],
          contactInfo: hotelData.contactInfo || {},
          status: hotelData.isActive !== undefined ? (hotelData.isActive ? 'active' : 'inactive') : hotelData.status || 'active',
          createdAt: hotelData.createdAt,
          updatedAt: hotelData.updatedAt
        };
        
        hotel = new Hotel(hotelEntityData);
      }

      // Validate translations - only English allowed on creation
      const translationValidation = validateCreationTranslations(hotelData);
      if (!translationValidation.isValid) {
        throw new Error(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
      }

      // Validate the entity
      const validation = hotel.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      // Check name uniqueness
      await this._checkNameUniqueness(hotel.name);

      // Force isActive = false on creation
      const dataToSave = {
        ...hotelData,
        isActive: false
      };

      // Save - pass raw data to repository
      const savedHotel = await this.hotelRepository.create(dataToSave);

      // Convert response to Hotel entity
      return Hotel.fromJSON({
        id: savedHotel.id || savedHotel.data?.id,
        name: savedHotel.nameTranslations?.en || savedHotel.name || savedHotel.data?.name,
        location: savedHotel.cityName || savedHotel.location?.cityName || savedHotel.location || savedHotel.data?.cityName,
        description: savedHotel.descriptionTranslations?.en || savedHotel.description || savedHotel.data?.description,
        amenities: savedHotel.amenities || savedHotel.data?.amenities || [],
        rating: savedHotel.rating || savedHotel.data?.rating || null,
        priceRange: savedHotel.priceRange || savedHotel.data?.priceRange || {},
        images: savedHotel.images || savedHotel.data?.images || [],
        contactInfo: savedHotel.contactInfo || savedHotel.data?.contactInfo || {},
        status: savedHotel.isActive !== undefined ? (savedHotel.isActive ? 'active' : 'inactive') : 
                savedHotel.active !== undefined ? (savedHotel.active ? 'active' : 'inactive') : 
                savedHotel.status || 'active',
        createdAt: savedHotel.createdAt || savedHotel.data?.createdAt,
        updatedAt: savedHotel.updatedAt || savedHotel.data?.updatedAt
      });
    } catch (error) {
      throw new Error(`Error creating hotel: ${error.message}`);
    }
  }

  /**
   * Checks hotel name uniqueness
   */
  async _checkNameUniqueness(name) {
    const existingHotels = await this.hotelRepository.search(name);
    const exactMatch = existingHotels.find(
      hotel => {
        const hotelName = hotel.name || hotel.nameTranslations?.en || '';
        return hotelName.toLowerCase() === name.toLowerCase();
      }
    );

    if (exactMatch) {
      throw new Error('A hotel with this name already exists');
    }
  }
}
