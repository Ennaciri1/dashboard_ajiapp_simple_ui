/**
 * Cas d'usage : Supprimer un stade
 */
export class DeleteStadiumUseCase {
  constructor(stadiumRepository) {
    this.stadiumRepository = stadiumRepository;
  }

  async execute(id) {
    try {
      const existingStadium = await this.stadiumRepository.findById(id);
      if (!existingStadium) {
        throw new Error('Stade non trouvé');
      }

      const deleted = await this.stadiumRepository.delete(id);

      if (!deleted) {
        throw new Error('Échec de la suppression du stade');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting stadium: ${error.message}`);
    }
  }
}
