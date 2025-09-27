/**
 * Entité Visa - Représente une information de visa dans le domaine métier
 */
export class Visa {
  constructor({
    id,
    country,
    nationality,
    isRequired,
    imageUrl,
    processingTime,
    cost = null,
    validityDuration = null,
    requirements = [],
    notes = '',
    updatedAt,
    createdAt
  }) {
    this.id = id;
    this.country = country;
    this.nationality = nationality;
    this.isRequired = isRequired;
    this.imageUrl = imageUrl;
    this.processingTime = processingTime;
    this.cost = cost;
    this.validityDuration = validityDuration;
    this.requirements = requirements;
    this.notes = notes;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Méthodes métier
  requiresVisa() {
    return this.isRequired === true;
  }

  isVisaFree() {
    return this.isRequired === false;
  }

  hasCost() {
    return this.cost !== null && this.cost > 0;
  }

  isExpedited() {
    return this.processingTime && this.processingTime.toLowerCase().includes('expedited');
  }

  isEVisa() {
    return this.processingTime && this.processingTime.toLowerCase().includes('e-visa');
  }

  isVisaOnArrival() {
    return this.processingTime && this.processingTime.toLowerCase().includes('on arrival');
  }

  getCountryNationalityKey() {
    return `${this.country}-${this.nationality}`.toLowerCase().replace(/\s+/g, '-');
  }

  addRequirement(requirement) {
    if (requirement && !this.requirements.includes(requirement)) {
      this.requirements.push(requirement);
      this.updatedAt = new Date();
    }
  }

  removeRequirement(requirement) {
    this.requirements = this.requirements.filter(req => req !== requirement);
    this.updatedAt = new Date();
  }

  updateProcessingTime(newProcessingTime) {
    this.processingTime = newProcessingTime;
    this.updatedAt = new Date();
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.country || this.country.trim().length === 0) {
      errors.push('Le pays de destination est requis');
    }
    
    if (!this.nationality || this.nationality.trim().length === 0) {
      errors.push('La nationalité est requise');
    }
    
    if (this.isRequired === null || this.isRequired === undefined) {
      errors.push('L\'indication de visa requis est obligatoire');
    }
    
    if (!this.processingTime || this.processingTime.trim().length === 0) {
      errors.push('Le temps de traitement est requis');
    }
    
    if (this.imageUrl && !/^https?:\/\/.+/.test(this.imageUrl)) {
      errors.push('L\'URL de l\'image doit être valide');
    }
    
    if (this.cost !== null && (isNaN(this.cost) || this.cost < 0)) {
      errors.push('Le coût doit être un nombre positif');
    }
    
    if (this.requirements && !Array.isArray(this.requirements)) {
      errors.push('Les exigences doivent être un tableau');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Méthodes d'affichage
  getStatusLabel() {
    if (this.isVisaFree()) {
      return 'Sans visa';
    } else if (this.isEVisa()) {
      return 'E-visa';
    } else if (this.isVisaOnArrival()) {
      return 'Visa à l\'arrivée';
    } else {
      return 'Visa requis';
    }
  }

  getStatusColor() {
    if (this.isVisaFree()) {
      return 'success';
    } else if (this.isEVisa() || this.isVisaOnArrival()) {
      return 'warning';
    } else {
      return 'error';
    }
  }

  // Sérialisation
  toJSON() {
    return {
      id: this.id,
      country: this.country,
      nationality: this.nationality,
      isRequired: this.isRequired,
      imageUrl: this.imageUrl,
      processingTime: this.processingTime,
      cost: this.cost,
      validityDuration: this.validityDuration,
      requirements: this.requirements,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromJSON(data) {
    return new Visa(data);
  }
}
