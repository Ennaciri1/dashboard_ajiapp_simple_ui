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
      console.error('Erreur API lors du chargement des avis:', error.message);
      throw new Error(`Impossible de charger les avis depuis l'API: ${error.message}`);
    }
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
        rejectionReason: rejectionReason || null
      };
      
      const response = await httpClient.put(`${this.basePath}/${reviewId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Erreur API lors de la mise à jour du statut:', error.message);
      throw new Error(`Impossible de mettre à jour le statut: ${error.message}`);
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
      console.error('Erreur API lors de la suppression:', error.message);
      throw new Error(`Impossible de supprimer l'avis: ${error.message}`);
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
