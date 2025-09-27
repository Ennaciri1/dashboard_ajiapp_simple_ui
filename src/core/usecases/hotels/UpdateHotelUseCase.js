import { Hotel } from '../../entities/Hotel.js';

/**
 * Cas d'usage : Mettre à jour un hôtel existant
 */
export class UpdateHotelUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Exécute le cas d'usage
   * @param {string|number} id - ID de l'hôtel à mettre à jour
   * @param {Object} updateData - Données de mise à jour
   * @returns {Promise<Hotel>}
   */
  async execute(id, updateData) {
    try {
      // Vérification de l'existence de l'hôtel
      const existingHotel = await this.hotelRepository.findById(id);
      if (!existingHotel) {
        throw new Error('Hôtel non trouvé');
      }

      // Création de l'entité mise à jour
      const updatedHotelData = {
        ...existingHotel,
        ...updateData,
        id, // Préservation de l'ID
        updatedAt: new Date()
      };

      const hotel = new Hotel(updatedHotelData);

      // Validation de l'entité
      const validation = hotel.validate();
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
      }

      // Vérification de l'unicité du nom (si changé)
      if (updateData.name && updateData.name !== existingHotel.name) {
        await this._checkNameUniqueness(updateData.name, id);
      }

      // Sauvegarde
      const savedHotel = await this.hotelRepository.update(id, hotel);

      return Hotel.fromJSON(savedHotel);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'hôtel: ${error.message}`);
    }
  }

  /**
   * Vérifie l'unicité du nom de l'hôtel (excluant l'hôtel actuel)
   */
  async _checkNameUniqueness(name, excludeId) {
    const existingHotels = await this.hotelRepository.search(name);
    const exactMatch = existingHotels.find(
      hotel => hotel.name.toLowerCase() === name.toLowerCase() && hotel.id !== excludeId
    );

    if (exactMatch) {
      throw new Error('Un autre hôtel avec ce nom existe déjà');
    }
  }
}
