import { Language } from '../../entities/Language.js';

/**
 * Cas d'usage : Récupérer la liste des langues
 */
export class GetLanguagesUseCase {
  constructor(languageRepository) {
    this.languageRepository = languageRepository;
  }

  /**
   * Exécute le cas d'usage
   * @returns {Promise<{languages: Language[], total: number}>}
   */
  async execute() {
    try {
      const languagesData = await this.languageRepository.findAll();

      // S'assurer que languagesData est un tableau
      if (!Array.isArray(languagesData)) {
        console.warn('Repository did not return an array:', languagesData);
        return {
          languages: [],
          total: 0
        };
      }

      const languageEntities = languagesData.map(langData => {
        return Language.fromJSON({
          id: langData.id,
          code: langData.code,
          name: langData.name,
          createdAt: langData.createdAt,
          updatedAt: langData.updatedAt,
          createdBy: langData.createdBy,
          updatedBy: langData.updatedBy
        });
      });

      return {
        languages: languageEntities,
        total: languageEntities.length
      };
    } catch (error) {
      throw new Error(`Error fetching languages: ${error.message}`);
    }
  }
}

