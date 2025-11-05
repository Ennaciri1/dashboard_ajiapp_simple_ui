/**
 * Entité Language - Représente une langue supportée dans le domaine métier
 */
export class Language {
  constructor({
    id,
    code,
    name,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy
  }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }

  // Méthodes métier
  isValidCode() {
    // Code de langue doit être 2 caractères (ISO 639-1)
    return this.code && this.code.length === 2;
  }

  updateName(newName) {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Le nom de la langue doit contenir au moins 2 caractères');
    }
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.code || !this.code.trim()) {
      errors.push('Le code de la langue est requis');
    } else if (this.code.trim().length !== 2) {
      errors.push('Le code de la langue doit contenir exactement 2 caractères');
    }
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Le nom de la langue est requis et doit contenir au moins 2 caractères');
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
      code: this.code,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy
    };
  }

  // Factory method
  static fromJSON(data) {
    return new Language({
      id: data.id,
      code: data.code,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy
    });
  }
}

