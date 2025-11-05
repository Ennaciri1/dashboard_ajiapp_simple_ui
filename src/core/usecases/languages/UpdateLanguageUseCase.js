import { Language } from '../../entities/Language.js';

/**
 * Cas d'usage : Mettre à jour une langue existante
 */
export class UpdateLanguageUseCase {
  constructor(languageRepository) {
    this.languageRepository = languageRepository;
  }

  async execute(id, updateData) {
    try {
      const existingLanguage = await this.languageRepository.findById(id);
      if (!existingLanguage) {
        throw new Error('Langue non trouvée');
      }

      const updatedLanguageData = {
        ...existingLanguage,
        ...updateData,
        id,
      };

      const languageEntityData = {
        id: updatedLanguageData.id,
        code: updateData.code?.trim().toLowerCase() || updatedLanguageData.code,
        name: updateData.name?.trim() || updatedLanguageData.name,
        createdAt: updatedLanguageData.createdAt,
        updatedAt: new Date().toISOString(),
        createdBy: updatedLanguageData.createdBy,
        updatedBy: updatedLanguageData.updatedBy
      };

      const language = new Language(languageEntityData);

      const validation = language.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
      }

      // Vérifier l'unicité du code si le code a changé
      const existingCode = existingLanguage.code;
      const newCode = updateData.code?.trim().toLowerCase();
      if (newCode && newCode !== existingCode) {
        const existingLanguageWithCode = await this.languageRepository.findByCode(newCode);
        if (existingLanguageWithCode && existingLanguageWithCode.id !== id) {
          throw new Error('A language with this code already exists');
        }
      }

      // Préparer les données pour l'API
      const apiData = {
        code: language.code,
        name: language.name
      };

      const savedLanguage = await this.languageRepository.update(id, apiData);

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
      throw new Error(`Error updating language: ${error.message}`);
    }
  }
}

