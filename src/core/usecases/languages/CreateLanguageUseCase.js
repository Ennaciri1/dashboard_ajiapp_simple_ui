import { Language } from '../../entities/Language.js';

/**
 * Cas d'usage : Créer une nouvelle langue
 */
export class CreateLanguageUseCase {
  constructor(languageRepository) {
    this.languageRepository = languageRepository;
  }

  async execute(languageData) {
    try {
      const languageEntityData = {
        id: languageData.id,
        code: languageData.code?.trim().toLowerCase() || '',
        name: languageData.name?.trim() || '',
        createdAt: languageData.createdAt,
        updatedAt: languageData.updatedAt,
        createdBy: languageData.createdBy,
        updatedBy: languageData.updatedBy
      };
      
      const language = new Language(languageEntityData);

      const validation = language.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      // Vérification de l'unicité du code
      await this._checkCodeUniqueness(language.code);

      // Préparer les données pour l'API (format attendu par le backend)
      const apiData = {
        code: language.code,
        name: language.name
      };

      const savedLanguage = await this.languageRepository.create(apiData);

      return Language.fromJSON({
        id: savedLanguage.id || savedLanguage.data?.id,
        code: savedLanguage.code || savedLanguage.data?.code,
        name: savedLanguage.name || savedLanguage.data?.name,
        createdAt: savedLanguage.createdAt || savedLanguage.data?.createdAt,
        updatedAt: savedLanguage.updatedAt || savedLanguage.data?.updatedAt,
        createdBy: savedLanguage.createdBy || savedLanguage.data?.createdBy,
        updatedBy: savedLanguage.updatedBy || savedLanguage.data?.updatedBy
      });
    } catch (error) {
      throw new Error(`Error creating language: ${error.message}`);
    }
  }

  /**
   * Vérifie l'unicité du code de la langue
   */
  async _checkCodeUniqueness(code) {
    const existingLanguage = await this.languageRepository.findByCode(code);
    if (existingLanguage) {
      throw new Error('A language with this code already exists');
    }
  }
}

