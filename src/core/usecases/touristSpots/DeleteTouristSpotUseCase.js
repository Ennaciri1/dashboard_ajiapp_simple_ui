/**
 * Cas d'usage : Supprimer un site touristique
 */
export class DeleteTouristSpotUseCase {
  constructor(touristSpotRepository) {
    this.touristSpotRepository = touristSpotRepository;
  }

  async execute(id) {
    try {
      const existingSpot = await this.touristSpotRepository.findById(id);
      if (!existingSpot) {
        throw new Error('Site touristique non trouvé');
      }

      const deleted = await this.touristSpotRepository.delete(id);

      if (!deleted) {
        throw new Error('Échec de la suppression du site touristique');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting tourist spot: ${error.message}`);
    }
  }
}
