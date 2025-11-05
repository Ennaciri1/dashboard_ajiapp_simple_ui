/**
 * Entité Contact - Représente un contact dans le domaine métier
 */
export class Contact {
  constructor({
    id,
    name,
    link,
    icon,
    isActive = true,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy
  }) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.icon = icon;
    this.isActive = isActive;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }

  // Méthodes métier
  isActive() {
    return this.isActive === true;
  }

  isPhoneNumber() {
    return this.link && (this.link.startsWith('tel:') || /^\+?[\d\s\-()]+$/.test(this.link));
  }

  isWebLink() {
    return this.link && (this.link.startsWith('http://') || this.link.startsWith('https://'));
  }

  isEmail() {
    return this.link && (this.link.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.link));
  }

  isTextLink() {
    return this.link && !this.isPhoneNumber() && !this.isWebLink() && !this.isEmail();
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  // Méthode pour obtenir le nom
  getName() {
    return this.name || '';
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Le nom du contact est requis et doit contenir au moins 2 caractères');
    }
    
    if (!this.link || this.link.trim().length === 0) {
      errors.push('Le lien du contact est requis');
    } else if (this.link.trim().length < 2) {
      errors.push('Le lien doit contenir au moins 2 caractères');
    }
    
    if (!this.icon || this.icon.trim().length === 0) {
      errors.push('L\'icône est requise');
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
      link: this.link,
      icon: this.icon,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy
    };
  }

  // Méthode pour l'API POST
  toCreatePayload() {
    return {
      nameTranslations: { en: this.name },
      link: this.link,
      icon: this.icon
    };
  }

  // Méthode pour l'API PUT
  toUpdatePayload() {
    return {
      nameTranslations: { en: this.name },
      link: this.link,
      icon: this.icon,
      isActive: this.isActive
    };
  }

  // Factory method
  static fromJSON(data) {
    return new Contact({
      id: data.id,
      name: data.name || (data.nameTranslations && data.nameTranslations.en) || '',
      link: data.link,
      icon: data.icon,
      isActive: data.isActive !== undefined ? data.isActive : data.active,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy
    });
  }
}
