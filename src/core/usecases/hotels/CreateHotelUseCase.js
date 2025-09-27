import { Hotel } from '../../entities/Hotel.js';

/**
 * Cas d'usage : Créer un nouvel hôtel
 */
export class CreateHotelUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Exécute le cas d'usage
   * @param {Object} hotelData - Données de l'hôtel à créer
   * @returns {Promise<Hotel>}
   */
  async execute(hotelData) {
    try {
      // Création de l'entité Hotel
      const hotel = new Hotel(hotelData);

      // Validation de l'entité
      const validation = hotel.validate();
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
      }

      // Vérification de l'unicité du nom
      await this._checkNameUniqueness(hotel.name);

      // Sauvegarde
      const savedHotel = await this.hotelRepository.create(hotel);

      return Hotel.fromJSON(savedHotel);
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'hôtel: ${error.message}`);
    }
  }

  /**
   * Vérifie l'unicité du nom de l'hôtel
   */
  async _checkNameUniqueness(name) {
    const existingHotels = await this.hotelRepository.search(name);
    const exactMatch = existingHotels.find(
      hotel => hotel.name.toLowerCase() === name.toLowerCase()
    );

    if (exactMatch) {
      throw new Error('Un hôtel avec ce nom existe déjà');
    }
  }
}
