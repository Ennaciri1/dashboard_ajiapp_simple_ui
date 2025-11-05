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
    updatedAt,
    _rawData
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
    // Preserve raw data from API for components that need it
    this._rawData = _rawData || {};
  }

  // Business methods
  isActive() {
    return this.status === 'active';
  }

  hasAmenity(amenity) {
    return this.amenities.includes(amenity);
  }

  updateRating(newRating) {
    if (newRating < 0 || newRating > 5) {
      throw new Error('Rating must be between 0 and 5');
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
      errors.push('Hotel name is required and must contain at least 2 characters');
    }
    
    if (!this.location || (typeof this.location === 'string' && this.location.trim().length < 2) || (typeof this.location === 'object' && !this.location.cityName && !this.location.city)) {
      errors.push('Location is required');
    }
    
    if (this.rating && (this.rating < 0 || this.rating > 5)) {
      errors.push('Rating must be between 0 and 5');
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
