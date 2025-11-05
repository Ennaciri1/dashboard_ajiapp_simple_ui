/**
 * Entité TouristSpot - Représente un site touristique dans le domaine métier
 */
export class TouristSpot {
  constructor({
    id,
    name,
    city,
    description,
    interestTypes = [],
    coordinates = {},
    images = [],
    openingHours = {},
    entryFee,
    rating,
    status = 'active',
    createdAt,
    updatedAt,
    _rawData
  }) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.description = description;
    this.interestTypes = interestTypes;
    this.coordinates = coordinates;
    this.images = images;
    this.openingHours = openingHours;
    this.entryFee = entryFee;
    this.rating = rating;
    this.status = status;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    // Preserve raw data from API for components that need it
    this._rawData = _rawData || {};
  }

  // Méthodes métier
  isActive() {
    return this.status === 'active';
  }

  hasInterestType(type) {
    return this.interestTypes.includes(type);
  }

  isOpenAt(time = new Date()) {
    const dayOfWeek = time.toLocaleDateString('fr-FR', { weekday: 'long' });
    const currentTime = time.toTimeString().slice(0, 5);
    
    const todayHours = this.openingHours[dayOfWeek];
    if (!todayHours) return false;
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  }

  updateRating(newRating) {
    if (newRating < 0 || newRating > 5) {
      throw new Error('La note doit être entre 0 et 5');
    }
    this.rating = newRating;
    this.updatedAt = new Date();
  }

  addImage(imageUrl) {
    if (!this.images.includes(imageUrl)) {
      this.images.push(imageUrl);
      this.updatedAt = new Date();
    }
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Le nom du site est requis et doit contenir au moins 2 caractères');
    }
    
    if (!this.city || this.city.trim().length < 2) {
      errors.push('La ville est requise');
    }
    
    if (this.rating && (this.rating < 0 || this.rating > 5)) {
      errors.push('La note doit être entre 0 et 5');
    }

    if (this.coordinates.lat && (this.coordinates.lat < -90 || this.coordinates.lat > 90)) {
      errors.push('La latitude doit être entre -90 et 90');
    }

    if (this.coordinates.lng && (this.coordinates.lng < -180 || this.coordinates.lng > 180)) {
      errors.push('La longitude doit être entre -180 et 180');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sérialisation
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      city: this.city,
      description: this.description,
      interestTypes: this.interestTypes,
      coordinates: this.coordinates,
      images: this.images,
      openingHours: this.openingHours,
      entryFee: this.entryFee,
      rating: this.rating,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromJSON(data) {
    return new TouristSpot(data);
  }
}
