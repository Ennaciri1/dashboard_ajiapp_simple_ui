import { Stadium } from '../../entities/Stadium.js';
import { validateUpdateTranslations, validateActivationTranslations } from '../../../shared/utils/translationValidator.js';
import { languageService } from '../../../shared/services/languageService.js';

/**
 * Use case: Update an existing stadium
 */
export class UpdateStadiumUseCase {
  constructor(stadiumRepository) {
    this.stadiumRepository = stadiumRepository;
  }

  async execute(id, updateData) {
    try {
      const existingStadium = await this.stadiumRepository.findById(id);
      if (!existingStadium) {
        throw new Error('Stade non trouvé');
      }

      const updatedStadiumData = {
        ...existingStadium,
        ...updateData,
        id,
      };

      const stadiumEntityData = {
        id: updatedStadiumData.id,
        name: updatedStadiumData.nameTranslations?.en || updatedStadiumData.name || '',
        description: updatedStadiumData.descriptionTranslations?.en || updatedStadiumData.description || '',
        cityId: updatedStadiumData.cityId || '',
        cityName: updatedStadiumData.cityName || '',
        location: updatedStadiumData.location || {},
        images: updatedStadiumData.images || [],
        capacity: updatedStadiumData.capacity || 0,
        inauguration: updatedStadiumData.inauguration || null,
        homeGround: updatedStadiumData.homeGround || '',
        status: updatedStadiumData.isActive !== undefined ? (updatedStadiumData.isActive ? 'active' : 'inactive') : 
                updatedStadiumData.active !== undefined ? (updatedStadiumData.active ? 'active' : 'inactive') : 
                updatedStadiumData.status || 'active',
        createdAt: updatedStadiumData.createdAt,
        updatedAt: new Date().toISOString(),
        createdBy: updatedStadiumData.createdBy,
        updatedBy: updatedStadiumData.updatedBy
      };

      const stadium = new Stadium(stadiumEntityData);

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
      if (updateData.isActive === true || updatedStadiumData.isActive === true) {
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
          'stadium',
          id,
          activeLanguages,
          ['name'] // Required fields for stadiums
        );
        
        if (!activationValidation.isValid) {
          throw new Error(`Cannot activate stadium: ${activationValidation.errors.join(', ')}`);
        }
      }

      const validation = stadium.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      const savedStadium = await this.stadiumRepository.update(id, updatedStadiumData);

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
      throw new Error(`Error updating stadium: ${error.message}`);
    }
  }
}
