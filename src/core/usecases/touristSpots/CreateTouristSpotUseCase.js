import { TouristSpot } from '../../entities/TouristSpot.js';
import { cityService } from '../../../infrastructure/api/cityService.js';
import { validateCreationTranslations } from '../../../shared/utils/translationValidator.js';

/**
 * Use case: Create a new tourist spot
 */
export class CreateTouristSpotUseCase {
  constructor(touristSpotRepository) {
    this.touristSpotRepository = touristSpotRepository;
  }

  async execute(spotData) {
    try {
      // Récupérer le nom de la ville depuis cityId si nécessaire
      let cityName = spotData.cityName || spotData.city || '';
      
      // Si on a seulement cityId, récupérer le nom de la ville
      if (!cityName && spotData.cityId) {
        try {
          const cityResponse = await cityService.getCityById(spotData.cityId);
          // Gérer différents formats de réponse
          const cityData = cityResponse.data?.data || cityResponse.data || cityResponse;
          cityName = cityData.nameTranslations?.en || cityData.name || cityData.id || spotData.cityId;
        } catch (error) {
          console.warn('Could not fetch city name, using cityId:', error);
          cityName = spotData.cityId; // Fallback sur l'ID si la requête échoue
        }
      }
      
      // Si toujours pas de nom de ville, utiliser l'ID comme fallback final
      if (!cityName) {
        cityName = spotData.cityId || 'Unknown City';
      }
      
      const spotEntityData = {
        id: spotData.id,
        name: spotData.nameTranslations?.en || spotData.name || '',
        city: cityName, // Utiliser le nom de la ville récupéré
        description: spotData.descriptionTranslations?.en || spotData.description || '',
        interestTypes: spotData.interestTypes || [],
        coordinates: spotData.location ? {
          lat: spotData.location.latitude,
          lng: spotData.location.longitude
        } : {},
        images: spotData.images || [],
        openingHours: spotData.openingHours || {},
        entryFee: spotData.entryFee || '',
        rating: spotData.rating || null,
        status: spotData.isActive !== undefined ? (spotData.isActive ? 'active' : 'inactive') : spotData.status || 'active',
        createdAt: spotData.createdAt,
        updatedAt: spotData.updatedAt
      };
      
      const spot = new TouristSpot(spotEntityData);

      // Validate translations - only English allowed on creation
      const translationValidation = validateCreationTranslations(spotData);
      if (!translationValidation.isValid) {
        throw new Error(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
      }

      const validation = spot.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      // Préparer les données pour l'API (format attendu par le backend)
      // Force isActive = false on creation
      const apiData = {
        ...spotData,
        // S'assurer que les données de l'entité sont incluses si nécessaire
        cityName: cityName,
        city: cityName,
        isActive: false
      };

      const savedSpot = await this.touristSpotRepository.create(apiData);

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
      throw new Error(`Error creating tourist spot: ${error.message}`);
    }
  }
}
