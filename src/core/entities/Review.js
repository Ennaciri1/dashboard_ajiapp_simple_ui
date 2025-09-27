/**
 * Entité Review - Représente un avis client dans le domaine métier
 */
export class Review {
  constructor({
    id,
    message,
    rating,
    status = 'PENDING',
    rejectionReason = '',
    userId,
    userName,
    entityType,
    entityId,
    entityName,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.message = message;
    this.rating = rating;
    this.status = status;
    this.rejectionReason = rejectionReason;
    this.userId = userId;
    this.userName = userName;
    this.entityType = entityType;
    this.entityId = entityId;
    this.entityName = entityName;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Méthodes métier
  isPending() {
    return this.status === 'PENDING';
  }

  isApproved() {
    return this.status === 'APPROVED';
  }

  isRejected() {
    return this.status === 'REJECTED';
  }

  approve() {
    // Permettre l'approbation des avis en attente ou rejetés
    if (this.isPending() || this.isRejected()) {
      this.status = 'APPROVED';
      this.rejectionReason = '';
      this.updatedAt = new Date();
    } else if (this.isApproved()) {
      // L'avis est déjà approuvé, pas besoin de le faire à nouveau
      console.log('Avis déjà approuvé');
    } else {
      throw new Error('Impossible d\'approuver cet avis dans son état actuel');
    }
  }

  reject(reason) {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Une raison de rejet est requise');
    }
    
    // Permettre le rejet des avis en attente ou approuvés
    if (this.isPending() || this.isApproved()) {
      this.status = 'REJECTED';
      this.rejectionReason = reason;
      this.updatedAt = new Date();
    } else if (this.isRejected()) {
      // L'avis est déjà rejeté, on peut mettre à jour la raison
      this.rejectionReason = reason;
      this.updatedAt = new Date();
      console.log('Raison de rejet mise à jour');
    } else {
      throw new Error('Impossible de rejeter cet avis dans son état actuel');
    }
  }

  isPositive() {
    return this.rating >= 4;
  }

  isNegative() {
    return this.rating <= 2;
  }

  isNeutral() {
    return this.rating === 3;
  }

  getEntityTypeLabel() {
    const entityTypes = {
      hotel: 'Hôtel',
      spot: 'Site touristique',
      activity: 'Activité',
      restaurant: 'Restaurant',
      service: 'Service'
    };
    
    return entityTypes[this.entityType] || this.entityType;
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.message || this.message.trim().length < 10) {
      errors.push('Le message doit contenir au moins 10 caractères');
    }
    
    if (this.message && this.message.length > 1000) {
      errors.push('Le message ne peut pas dépasser 1000 caractères');
    }
    
    if (!this.rating || this.rating < 1 || this.rating > 5) {
      errors.push('La note doit être entre 1 et 5');
    }
    
    if (!this.userId) {
      errors.push('L\'ID utilisateur est requis');
    }
    
    if (!this.userName || this.userName.trim().length === 0) {
      errors.push('Le nom d\'utilisateur est requis');
    }
    
    if (!this.entityType) {
      errors.push('Le type d\'entité est requis');
    }
    
    if (!this.entityId) {
      errors.push('L\'ID de l\'entité est requis');
    }

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(this.status)) {
      errors.push('Le statut doit être: PENDING, APPROVED ou REJECTED');
    }

    if (this.status === 'REJECTED' && (!this.rejectionReason || this.rejectionReason.trim().length === 0)) {
      errors.push('Une raison de rejet est requise pour les avis rejetés');
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
      message: this.message,
      rating: this.rating,
      status: this.status,
      rejectionReason: this.rejectionReason,
      userId: this.userId,
      userName: this.userName,
      entityType: this.entityType,
      entityId: this.entityId,
      entityName: this.entityName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromJSON(data) {
    return new Review(data);
  }
}
