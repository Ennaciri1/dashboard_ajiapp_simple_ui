/**
 * Cas d'usage : Supprimer un hôtel
 */
export class DeleteHotelUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Exécute le cas d'usage
   * @param {string|number} id - ID de l'hôtel à supprimer
   * @returns {Promise<boolean>}
   */
  async execute(id) {
    try {
      // Vérification de l'existence de l'hôtel
      const existingHotel = await this.hotelRepository.findById(id);
      if (!existingHotel) {
        throw new Error('Hôtel non trouvé');
      }

      // Vérifications métier avant suppression
      await this._checkBusinessRules(existingHotel);

      // Suppression
      const deleted = await this.hotelRepository.delete(id);

      if (!deleted) {
        throw new Error('Échec de la suppression de l\'hôtel');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting hotel: ${error.message}`);
    }
  }

  /**
   * Vérifie les règles métier avant suppression
   */
  // eslint-disable-next-line no-unused-vars
  async _checkBusinessRules(_hotel) {
    // Exemple : vérifier s'il y a des réservations actives
    // Cette logique dépendra de votre domaine métier
    
    // Pour l'instant, on permet toujours la suppression
    // Vous pouvez ajouter des vérifications ici selon vos besoins
    
    return true;
  }
}
