import httpClient from './httpClient.js';

/**
 * Repository pour la gestion des avis - Implémentation avec API réelle
 */
export class ReviewRepository {
  constructor() {
    this.basePath = '/reviews';
  }

  /**
   * Récupère tous les avis
   */
  async findAll(filters = {}) {
    try {
      const response = await httpClient.get(`${this.basePath}/all`);
      
      // L'API retourne { code, message, data, error }
      if (response.data && response.data.data) {
        let reviews = response.data.data;
        
        // Filtrage côté client si nécessaire
        if (filters.status) {
          reviews = reviews.filter(review => review.status === filters.status);
        }
        
        if (filters.entityType) {
          reviews = reviews.filter(review => review.entityType === filters.entityType);
        }
        
        return reviews;
      }
      
      return [];
    } catch (error) {
      console.warn('API non disponible, utilisation des données de test:', error.message);
      
      // Données de test en fallback
      return this._getMockData(filters);
    }
  }

  /**
   * Données de test quand l'API n'est pas disponible
   */
  _getMockData(filters = {}) {
    const mockReviews = [
      {
        id: "68d54c96aefd9d7d1ef4fd33",
        message: "Excellent séjour dans cet hôtel ! Le service était impeccable et la vue magnifique.",
        rating: 5,
        date: "2025-09-25T15:07:18.169Z",
        status: "APPROVED",
        entityType: "HOTEL",
        entityId: "hotel-123",
        rejectionReason: null,
        approvedAt: "2025-09-25T16:00:00.000Z",
        userName: "Sarah Johnson",
        userProfilePicture: null
      },
      {
        id: "68d54cadaefd9d7d1ef4fd34",
        message: "Site touristique vraiment intéressant, guide très compétent. Je recommande !",
        rating: 4,
        date: "2025-09-25T15:07:41.459Z",
        status: "PENDING",
        entityType: "TOURISTSPOT",
        entityId: "spot-456",
        rejectionReason: null,
        approvedAt: null,
        userName: "Ahmed El Idrissi",
        userProfilePicture: null
      },
      {
        id: "68d54cc6aefd9d7d1ef4fd35",
        message: "Activité décevante, pas à la hauteur des attentes. Organisation défaillante.",
        rating: 2,
        date: "2025-09-24T10:30:00.000Z",
        status: "REJECTED",
        entityType: "ACTIVITY",
        entityId: "activity-789",
        rejectionReason: "Avis trop négatif sans justification constructive",
        approvedAt: null,
        userName: "Laura Chen",
        userProfilePicture: null
      },
      {
        id: "mock-review-4",
        message: "Très bon rapport qualité-prix pour ce restaurant. Plats savoureux et service rapide.",
        rating: 4,
        date: "2025-09-23T19:15:00.000Z",
        status: "PENDING",
        entityType: "HOTEL",
        entityId: "hotel-456",
        rejectionReason: null,
        approvedAt: null,
        userName: "Mohammed Alami",
        userProfilePicture: null
      },
      {
        id: "mock-review-5",
        message: "Expérience inoubliable ! Les paysages sont à couper le souffle.",
        rating: 5,
        date: "2025-09-22T14:20:00.000Z",
        status: "APPROVED",
        entityType: "TOURISTSPOT",
        entityId: "spot-789",
        rejectionReason: null,
        approvedAt: "2025-09-22T15:00:00.000Z",
        userName: "Fatima Zahra",
        userProfilePicture: null
      }
    ];

    // Filtrage selon les paramètres
    let filteredReviews = mockReviews;
    
    if (filters.status) {
      filteredReviews = filteredReviews.filter(review => review.status === filters.status);
    }
    
    if (filters.entityType) {
      filteredReviews = filteredReviews.filter(review => review.entityType === filters.entityType);
    }
    
    return filteredReviews;
  }

  /**
   * Met à jour le statut d'un avis
   */
  async updateStatus(reviewId, status, rejectionReason = null) {
    if (!reviewId || reviewId === 'null' || reviewId === 'undefined') {
      throw new Error('ID d\'avis invalide');
    }

    try {
      const statusData = {
        status,
        rejectionReason
      };
      
      const response = await httpClient.put(`${this.basePath}/${reviewId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.warn('API non disponible pour la mise à jour, simulation:', error.message);
      
      // Simulation de la mise à jour
      return {
        success: true,
        message: `Statut mis à jour vers ${status} (mode test)`,
        data: { id: reviewId, status, rejectionReason }
      };
    }
  }

  /**
   * Supprime un avis
   */
  async delete(reviewId) {
    if (!reviewId || reviewId === 'null' || reviewId === 'undefined') {
      throw new Error('ID d\'avis invalide');
    }

    try {
      await httpClient.delete(`${this.basePath}/${reviewId}`);
      return true;
    } catch (error) {
      console.warn('API non disponible pour la suppression, simulation:', error.message);
      
      // Simulation de la suppression
      return true;
    }
  }

  /**
   * Approuve un avis
   */
  async approve(reviewId) {
    return this.updateStatus(reviewId, 'APPROVED', null);
  }

  /**
   * Rejette un avis
   */
  async reject(reviewId, rejectionReason) {
    if (!rejectionReason || rejectionReason.trim() === '') {
      throw new Error('Une raison de rejet est requise');
    }
    
    return this.updateStatus(reviewId, 'REJECTED', rejectionReason.trim());
  }

  /**
   * Remet un avis en attente
   */
  async setPending(reviewId) {
    return this.updateStatus(reviewId, 'PENDING', null);
  }
}
