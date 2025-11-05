import { Stadium } from '../../entities/Stadium.js';
import { validateCreationTranslations } from '../../../shared/utils/translationValidator.js';

/**
 * Use case: Create a new stadium
 */
export class CreateStadiumUseCase {
  constructor(stadiumRepository) {
    this.stadiumRepository = stadiumRepository;
  }

  async execute(stadiumData) {
    try {
      const stadiumEntityData = {
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
        status: stadiumData.isActive !== undefined ? (stadiumData.isActive ? 'active' : 'inactive') : stadiumData.status || 'active',
        createdAt: stadiumData.createdAt,
        updatedAt: stadiumData.updatedAt,
        createdBy: stadiumData.createdBy,
        updatedBy: stadiumData.updatedBy
      };
      
      const stadium = new Stadium(stadiumEntityData);

      // Validate translations - only English allowed on creation
      const translationValidation = validateCreationTranslations(stadiumData);
      if (!translationValidation.isValid) {
        throw new Error(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
      }

      const validation = stadium.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      // Force isActive = false on creation
      const dataToSave = {
        ...stadiumData,
        isActive: false
      };

      const savedStadium = await this.stadiumRepository.create(dataToSave);

      return Stadium.fromJSON({
        id: savedStadium.id || savedStadium.data?.id,
        name: savedStadium.nameTranslations?.en || savedStadium.name || savedStadium.data?.name,
        description: savedStadium.descriptionTranslations?.en || savedStadium.description || savedStadium.data?.description,
        cityId: savedStadium.cityId || savedStadium.data?.cityId || '',
        cityName: savedStadium.cityName || savedStadium.data?.cityName || '',
        location: savedStadium.location || savedStadium.data?.location || {},
        images: savedStadium.images || savedStadium.data?.images || [],
        capacity: savedStadium.capacity || savedStadium.data?.capacity || 0,
        inauguration: savedStadium.inauguration || savedStadium.data?.inauguration || null,
        homeGround: savedStadium.homeGround || savedStadium.data?.homeGround || '',
        status: savedStadium.isActive !== undefined ? (savedStadium.isActive ? 'active' : 'inactive') : 
                savedStadium.active !== undefined ? (savedStadium.active ? 'active' : 'inactive') : 
                savedStadium.status || 'active',
        createdAt: savedStadium.createdAt || savedStadium.data?.createdAt,
        updatedAt: savedStadium.updatedAt || savedStadium.data?.updatedAt,
        createdBy: savedStadium.createdBy || savedStadium.data?.createdBy,
        updatedBy: savedStadium.updatedBy || savedStadium.data?.updatedBy
      });
    } catch (error) {
      throw new Error(`Error creating stadium: ${error.message}`);
    }
  }
}
