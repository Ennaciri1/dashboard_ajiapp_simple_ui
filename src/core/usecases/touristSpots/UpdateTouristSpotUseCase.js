import { TouristSpot } from '../../entities/TouristSpot.js';
import { cityService } from '../../../infrastructure/api/cityService.js';
import { validateUpdateTranslations, validateActivationTranslations } from '../../../shared/utils/translationValidator.js';
import { languageService } from '../../../shared/services/languageService.js';

/**
 * Use case: Update an existing tourist spot
 */
export class UpdateTouristSpotUseCase {
  constructor(touristSpotRepository) {
    this.touristSpotRepository = touristSpotRepository;
  }

  async execute(id, updateData) {
    try {
      const existingSpot = await this.touristSpotRepository.findById(id);
      if (!existingSpot) {
        throw new Error('Site touristique non trouvé');
      }

      const updatedSpotData = {
        ...existingSpot,
        ...updateData,
        id,
      };

      // Récupérer le nom de la ville depuis cityId si nécessaire
      let cityName = updatedSpotData.cityName || updatedSpotData.city || '';
      
      // Si on a seulement cityId (nouveau ou mis à jour), récupérer le nom de la ville
      if ((!cityName || updateData.cityId) && updatedSpotData.cityId) {
        try {
          const cityResponse = await cityService.getCityById(updatedSpotData.cityId);
          // Gérer différents formats de réponse
          const cityData = cityResponse.data?.data || cityResponse.data || cityResponse;
          cityName = cityData.nameTranslations?.en || cityData.name || cityData.id || updatedSpotData.cityId;
        } catch (error) {
          console.warn('Could not fetch city name, using existing city name or cityId:', error);
          // Garder le nom existant s'il existe, sinon utiliser l'ID
          cityName = cityName || updatedSpotData.cityId;
        }
      }
      
      // Si toujours pas de nom de ville, utiliser l'ID comme fallback final
      if (!cityName) {
        cityName = updatedSpotData.cityId || existingSpot.cityName || existingSpot.city || 'Unknown City';
      }

      const spotEntityData = {
        id: updatedSpotData.id,
        name: updatedSpotData.nameTranslations?.en || updatedSpotData.name || '',
        city: cityName, // Utiliser le nom de la ville récupéré
        description: updatedSpotData.descriptionTranslations?.en || updatedSpotData.description || '',
        interestTypes: updatedSpotData.interestTypes || [],
        coordinates: updatedSpotData.location ? {
          lat: updatedSpotData.location.latitude,
          lng: updatedSpotData.location.longitude
        } : {},
        images: updatedSpotData.images || [],
        openingHours: updatedSpotData.openingHours || {},
        entryFee: updatedSpotData.entryFee || '',
        rating: updatedSpotData.rating || null,
        status: updatedSpotData.isActive !== undefined ? (updatedSpotData.isActive ? 'active' : 'inactive') : 
                updatedSpotData.active !== undefined ? (updatedSpotData.active ? 'active' : 'inactive') : 
                updatedSpotData.status || 'active',
        createdAt: updatedSpotData.createdAt,
        updatedAt: new Date().toISOString()
      };

      const spot = new TouristSpot(spotEntityData);

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
      if (updateData.isActive === true || updatedSpotData.isActive === true) {
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
          'tourist_spot',
          id,
          activeLanguages,
          ['name'] // Required fields for tourist spots
        );
        
        if (!activationValidation.isValid) {
          throw new Error(`Cannot activate tourist spot: ${activationValidation.errors.join(', ')}`);
        }
      }

      const validation = spot.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      const savedSpot = await this.touristSpotRepository.update(id, updatedSpotData);

      return TouristSpot.fromJSON({
        id: savedSpot.id || savedSpot.data?.id,
        name: savedSpot.nameTranslations?.en || savedSpot.name || savedSpot.data?.name,
        city: savedSpot.cityName || savedSpot.city || savedSpot.data?.cityName,
        description: savedSpot.descriptionTranslations?.en || savedSpot.description || savedSpot.data?.description,
        interestTypes: savedSpot.interestTypes || savedSpot.data?.interestTypes || [],
        coordinates: savedSpot.location ? {
          lat: savedSpot.location.latitude,
          lng: savedSpot.location.longitude
        } : {},
        images: savedSpot.images || savedSpot.data?.images || [],
        openingHours: savedSpot.openingHours || savedSpot.data?.openingHours || {},
        entryFee: savedSpot.entryFee || savedSpot.data?.entryFee || '',
        rating: savedSpot.rating || savedSpot.data?.rating || null,
        status: savedSpot.isActive !== undefined ? (savedSpot.isActive ? 'active' : 'inactive') : 
                savedSpot.active !== undefined ? (savedSpot.active ? 'active' : 'inactive') : 
                savedSpot.status || 'active',
        createdAt: savedSpot.createdAt || savedSpot.data?.createdAt,
        updatedAt: savedSpot.updatedAt || savedSpot.data?.updatedAt
      });
    } catch (error) {
      throw new Error(`Error updating tourist spot: ${error.message}`);
    }
  }
}
