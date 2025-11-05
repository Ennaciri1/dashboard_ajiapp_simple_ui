import { Language } from '../../entities/Language.js';

/**
 * Cas d'usage : Supprimer une langue
 */
export class DeleteLanguageUseCase {
  constructor(languageRepository) {
    this.languageRepository = languageRepository;
  }

  async execute(id) {
    try {
      const existingLanguage = await this.languageRepository.findById(id);
      if (!existingLanguage) {
        throw new Error('Langue non trouvée');
      }

      await this.languageRepository.delete(id);
      return true;
    } catch (error) {
      throw new Error(`Error deleting language: ${error.message}`);
    }
  }
}

