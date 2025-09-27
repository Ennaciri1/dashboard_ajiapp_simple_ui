/**
 * Entité City - Représente une ville dans le domaine métier
 */
export class City {
  constructor({
    id,
    name,
    country,
    region,
    description,
    coordinates = {},
    population,
    timezone,
    images = [],
    status = 'active',
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.region = region;
    this.description = description;
    this.coordinates = coordinates;
    this.population = population;
    this.timezone = timezone;
    this.images = images;
    this.status = status;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Méthodes métier
  isActive() {
    return this.status === 'active';
  }

  getFullName() {
    return `${this.name}, ${this.region ? this.region + ', ' : ''}${this.country}`;
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
      errors.push('Le nom de la ville est requis et doit contenir au moins 2 caractères');
    }
    
    if (!this.country || this.country.trim().length < 2) {
      errors.push('Le pays est requis');
    }
    
    if (this.coordinates.lat && (this.coordinates.lat < -90 || this.coordinates.lat > 90)) {
      errors.push('La latitude doit être entre -90 et 90');
    }

    if (this.coordinates.lng && (this.coordinates.lng < -180 || this.coordinates.lng > 180)) {
      errors.push('La longitude doit être entre -180 et 180');
    }

    if (this.population && this.population < 0) {
      errors.push('La population ne peut pas être négative');
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
      country: this.country,
      region: this.region,
      description: this.description,
      coordinates: this.coordinates,
      population: this.population,
      timezone: this.timezone,
      images: this.images,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromJSON(data) {
    return new City(data);
  }
}
