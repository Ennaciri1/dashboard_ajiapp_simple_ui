import { Hotel } from '../../entities/Hotel.js';
import { cityService } from '../../../infrastructure/api/cityService.js';
import { validateUpdateTranslations, validateActivationTranslations } from '../../../shared/utils/translationValidator.js';
import { languageService } from '../../../shared/services/languageService.js';

/**
 * Use case: Update an existing hotel
 */
export class UpdateHotelUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Executes the use case
   * @param {string|number} id - ID of the hotel to update
   * @param {Object} updateData - Update data (can be raw data)
   * @returns {Promise<Hotel>}
   */
  async execute(id, updateData) {
    try {
      // Check if hotel exists
      const existingHotel = await this.hotelRepository.findById(id);
      if (!existingHotel) {
        throw new Error('Hotel not found');
      }

      // Merge existing data with new data
      const updatedHotelData = {
        ...existingHotel,
        ...updateData,
        id, // Preserve ID
      };

      // Get city name from cityId if needed
      let cityName = updatedHotelData.cityName || existingHotel.cityName || '';
      
      // If we only have cityId, fetch the city name
      if (!cityName && updatedHotelData.cityId) {
        try {
          const cityResponse = await cityService.getCityById(updatedHotelData.cityId);
          // Handle different response formats
          const cityData = cityResponse.data?.data || cityResponse.data || cityResponse;
          cityName = cityData.nameTranslations?.en || cityData.name || cityData.id || updatedHotelData.cityId;
        } catch (error) {
          console.warn('Could not fetch city name, using cityId:', error);
          cityName = updatedHotelData.cityId; // Fallback to ID if request fails
        }
      }
      
      // If still no city name, try to extract from location
      if (!cityName) {
        // If location is an object, try to extract cityName from it
        if (updatedHotelData.location && typeof updatedHotelData.location === 'object') {
          cityName = updatedHotelData.location.cityName || updatedHotelData.location.city || '';
        } else if (typeof updatedHotelData.location === 'string') {
          cityName = updatedHotelData.location;
        } else if (existingHotel.location && typeof existingHotel.location === 'string') {
          cityName = existingHotel.location;
        } else {
          cityName = updatedHotelData.cityId || existingHotel.cityId || '';
        }
      }

      // Convert to entity for validation
      const hotelEntityData = {
        id: updatedHotelData.id,
        name: updatedHotelData.nameTranslations?.en || updatedHotelData.name || '',
        location: cityName, // Use the retrieved city name
        description: updatedHotelData.descriptionTranslations?.en || updatedHotelData.description || '',
        amenities: updatedHotelData.amenities || [],
        rating: updatedHotelData.rating || null,
        priceRange: updatedHotelData.priceRange || {},
        images: updatedHotelData.images || [],
        contactInfo: updatedHotelData.contactInfo || {},
        status: updatedHotelData.isActive !== undefined ? (updatedHotelData.isActive ? 'active' : 'inactive') : 
                updatedHotelData.active !== undefined ? (updatedHotelData.active ? 'active' : 'inactive') : 
                updatedHotelData.status || 'active',
        createdAt: updatedHotelData.createdAt,
        updatedAt: new Date().toISOString()
      };

      const hotel = new Hotel(hotelEntityData);

      // Validate translations - check if provided languages are active and supported
      const hasTranslationFields = Object.keys(updateData).some(key => key.includes('Translations'));
      if (hasTranslationFields) {
        const activeLanguages = await languageService.getActiveLanguages();
        const translationValidation = validateUpdateTranslations(updateData, activeLanguages);
        if (!translationValidation.isValid) {
          throw new Error(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
        }
      }

      // If trying to activate entity (isActive = true), validate all translations exist
      if (updateData.isActive === true || updatedHotelData.isActive === true) {
        const activeLanguages = await languageService.getActiveLanguages();
        
        // Get translations from TranslationRepository
        const { TranslationRepository } = await import('../../../infrastructure/api/TranslationRepository.js');
        const { GetTranslationsUseCase } = await import('../translations/GetTranslationsUseCase.js');
        
        const translationRepository = new TranslationRepository();
        const getTranslationsUseCase = new GetTranslationsUseCase(translationRepository);
        const groupedTranslations = await getTranslationsUseCase.execute();
        
        // Validate activation translations
        const activationValidation = validateActivationTranslations(
          groupedTranslations,
          'hotel',
          id,
          activeLanguages,
          ['name'] // Required fields for hotels
        );
        
        if (!activationValidation.isValid) {
          throw new Error(`Cannot activate hotel: ${activationValidation.errors.join(', ')}`);
        }
      }

      // Validate the entity
      const validation = hotel.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      // Check name uniqueness (if changed)
      const existingName = existingHotel.nameTranslations?.en || existingHotel.name || '';
      const newName = updateData.nameTranslations?.en || updateData.name || '';
      if (newName && newName !== existingName) {
        await this._checkNameUniqueness(newName, id);
      }

      // Save - pass raw data to repository
      const savedHotel = await this.hotelRepository.update(id, updatedHotelData);

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
      throw new Error(`Error updating hotel: ${error.message}`);
    }
  }

  /**
   * Checks hotel name uniqueness (excluding current hotel)
   */
  async _checkNameUniqueness(name, excludeId) {
    const existingHotels = await this.hotelRepository.search(name);
    const exactMatch = existingHotels.find(
      hotel => {
        const hotelName = hotel.name || hotel.nameTranslations?.en || '';
        return hotelName.toLowerCase() === name.toLowerCase() && hotel.id !== excludeId;
      }
    );

    if (exactMatch) {
      throw new Error('Another hotel with this name already exists');
    }
  }
}
