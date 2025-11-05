/**
 * Entité Stadium - Représente un stade dans le domaine métier
 */
export class Stadium {
  constructor({
    id,
    name,
    description,
    cityId,
    cityName,
    location = {},
    images = [],
    capacity,
    inauguration,
    homeGround,
    status = 'active',
    createdAt,
    updatedAt,
    createdBy,
    updatedBy
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.cityId = cityId;
    this.cityName = cityName;
    this.location = location;
    this.images = images;
    this.capacity = capacity;
    this.inauguration = inauguration;
    this.homeGround = homeGround;
    this.status = status;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }

  // Méthodes métier
  isActive() {
    return this.status === 'active';
  }

  hasImage(imageUrl) {
    return this.images.some(img => img.url === imageUrl);
  }

  addImage(imageUrl, owner = '') {
    if (!this.hasImage(imageUrl)) {
      this.images.push({ url: imageUrl, owner });
      this.updatedAt = new Date();
    }
  }

  removeImage(imageUrl) {
    this.images = this.images.filter(img => img.url !== imageUrl);
    this.updatedAt = new Date();
  }

  updateCapacity(newCapacity) {
    if (newCapacity < 0) {
      throw new Error('La capacité ne peut pas être négative');
    }
    this.capacity = newCapacity;
    this.updatedAt = new Date();
  }

  getAge() {
    if (!this.inauguration) return null;
    const inaugurationDate = new Date(this.inauguration);
    const now = new Date();
    return Math.floor((now - inaugurationDate) / (365.25 * 24 * 60 * 60 * 1000));
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Le nom du stade est requis et doit contenir au moins 2 caractères');
    }
    
    if (!this.description || this.description.trim().length < 10) {
      errors.push('La description est requise et doit contenir au moins 10 caractères');
    }
    
    if (!this.cityId || this.cityId.trim().length === 0) {
      errors.push('La ville est requise');
    }
    
    if (!this.capacity || this.capacity < 1) {
      errors.push('La capacité doit être un nombre positif');
    }
    
    if (this.inauguration) {
      const inaugurationDate = new Date(this.inauguration);
      if (isNaN(inaugurationDate.getTime())) {
        errors.push('La date d\'inauguration doit être une date valide');
      } else if (inaugurationDate > new Date()) {
        errors.push('La date d\'inauguration ne peut pas être dans le futur');
      }
    }
    
    if (this.location.latitude && (this.location.latitude < -90 || this.location.latitude > 90)) {
      errors.push('La latitude doit être entre -90 et 90');
    }
    
    if (this.location.longitude && (this.location.longitude < -180 || this.location.longitude > 180)) {
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
      description: this.description,
      cityId: this.cityId,
      cityName: this.cityName,
      location: this.location,
      images: this.images,
      capacity: this.capacity,
      inauguration: this.inauguration,
      homeGround: this.homeGround,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy
    };
  }

  // Factory method
  static fromJSON(data) {
    return new Stadium(data);
  }
}

