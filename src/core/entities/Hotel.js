/**
 * Entité Hotel - Représente un hôtel dans le domaine métier
 */
export class Hotel {
  constructor({
    id,
    name,
    location,
    description,
    amenities = [],
    rating,
    priceRange,
    images = [],
    contactInfo = {},
    status = 'active',
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.description = description;
    this.amenities = amenities;
    this.rating = rating;
    this.priceRange = priceRange;
    this.images = images;
    this.contactInfo = contactInfo;
    this.status = status;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Méthodes métier
  isActive() {
    return this.status === 'active';
  }

  hasAmenity(amenity) {
    return this.amenities.includes(amenity);
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

  removeImage(imageUrl) {
    this.images = this.images.filter(img => img !== imageUrl);
    this.updatedAt = new Date();
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Le nom de l\'hôtel est requis et doit contenir au moins 2 caractères');
    }
    
    if (!this.location || this.location.trim().length < 2) {
      errors.push('La localisation est requise');
    }
    
    if (this.rating && (this.rating < 0 || this.rating > 5)) {
      errors.push('La note doit être entre 0 et 5');
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
      location: this.location,
      description: this.description,
      amenities: this.amenities,
      rating: this.rating,
      priceRange: this.priceRange,
      images: this.images,
      contactInfo: this.contactInfo,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromJSON(data) {
    return new Hotel(data);
  }
}
