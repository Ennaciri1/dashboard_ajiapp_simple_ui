/**
 * Entité Contact - Représente un contact dans le domaine métier
 */
export class Contact {
  constructor({
    id,
    name,
    link,
    icon,
    active = true,
    category,
    description = '',
    priority = 'normal',
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.icon = icon;
    this.active = active;
    this.category = category;
    this.description = description;
    this.priority = priority;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Méthodes métier
  isActive() {
    return this.active === true;
  }

  isEmergency() {
    return this.category === 'Emergency';
  }

  isPhoneNumber() {
    return this.link && this.link.startsWith('tel:');
  }

  isWebLink() {
    return this.link && (this.link.startsWith('http://') || this.link.startsWith('https://'));
  }

  isEmail() {
    return this.link && this.link.startsWith('mailto:');
  }

  activate() {
    this.active = true;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.active = false;
    this.updatedAt = new Date();
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Le nom du contact est requis et doit contenir au moins 2 caractères');
    }
    
    if (!this.link || this.link.trim().length === 0) {
      errors.push('Le lien du contact est requis');
    } else {
      // Validation du format du lien
      const isValidPhone = this.link.startsWith('tel:');
      const isValidEmail = this.link.startsWith('mailto:');
      const isValidUrl = /^https?:\/\/.+/.test(this.link);
      
      if (!isValidPhone && !isValidEmail && !isValidUrl) {
        errors.push('Le lien doit être une URL valide, un numéro de téléphone (tel:) ou un email (mailto:)');
      }
    }
    
    if (!this.category || this.category.trim().length === 0) {
      errors.push('La catégorie est requise');
    }

    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (this.priority && !validPriorities.includes(this.priority)) {
      errors.push('La priorité doit être: low, normal, high ou urgent');
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
      active: this.active,
      category: this.category,
      description: this.description,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromJSON(data) {
    return new Contact(data);
  }
}
