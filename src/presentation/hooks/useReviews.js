import { useState, useEffect, useCallback } from 'react';
import { Review } from '../../core/entities/Review.js';
import { ReviewRepository } from '../../infrastructure/api/ReviewRepository.js';

/**
 * Custom hook for reviews management
 * Uses real API for client reviews management
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);

  // Initialisation du repository
  const reviewRepository = new ReviewRepository();

  /**
   * Charge la liste des avis depuis l'API
   */
  const loadReviews = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Récupération depuis l'API réelle
      const reviewsData = await reviewRepository.findAll(params);
      
      // Conversion en entités Review
      const reviewEntities = reviewsData.map(reviewData => {
        // Adaptation des données API vers notre format d'entité
        return Review.fromJSON({
          id: reviewData.id,
          message: reviewData.message,
          rating: reviewData.rating,
          status: reviewData.status,
          rejectionReason: reviewData.rejectionReason,
          userId: reviewData.userId || 'unknown',
          userName: reviewData.userName,
          entityType: reviewData.entityType.toLowerCase(), // HOTEL -> hotel
          entityId: reviewData.entityId,
          entityName: reviewData.entityName || `${reviewData.entityType} ${reviewData.entityId}`,
          createdAt: reviewData.date,
          updatedAt: reviewData.approvedAt || reviewData.date
        });
      });

      setReviews(reviewEntities);
      setTotal(reviewEntities.length);
      setIsTestMode(false); // API disponible
    } catch (err) {
      setError(err.message);
      setIsTestMode(false);
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Approuve un avis
   */
  const approveReview = useCallback(async (reviewId) => {
    setLoading(true);
    setError(null);

    try {
      // Appel API pour approuver
      await reviewRepository.approve(reviewId);

      // Mise à jour de la liste locale
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          const updatedReview = Review.fromJSON(review);
          updatedReview.approve();
          return updatedReview;
        }
        return review;
      }));

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rejette un avis
   */
  const rejectReview = useCallback(async (reviewId, reason) => {
    setLoading(true);
    setError(null);

    try {
      // Appel API pour rejeter
      await reviewRepository.reject(reviewId, reason);

      // Mise à jour de la liste locale
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          const updatedReview = Review.fromJSON(review);
          updatedReview.reject(reason);
          return updatedReview;
        }
        return review;
      }));

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprime un avis
   */
  const deleteReview = useCallback(async (reviewId) => {
    setLoading(true);
    setError(null);

    try {
      // Appel API pour supprimer
      await reviewRepository.delete(reviewId);

      // Mise à jour de la liste locale
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setTotal(prev => prev - 1);

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filtre les avis par statut
   */
  const getReviewsByStatus = useCallback((status) => {
    return reviews.filter(review => review.status === status);
  }, [reviews]);

  /**
   * Statistiques des avis
   */
  const getReviewsStats = useCallback(() => {
    const pending = reviews.filter(r => r.isPending()).length;
    const approved = reviews.filter(r => r.isApproved()).length;
    const rejected = reviews.filter(r => r.isRejected()).length;
    const positive = reviews.filter(r => r.isPositive()).length;
    const negative = reviews.filter(r => r.isNegative()).length;

    return {
      total: reviews.length,
      pending,
      approved,
      rejected,
      positive,
      negative,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0
    };
  }, [reviews]);

  /**
   * Efface les erreurs
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial loading
  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    // État
    reviews,
    loading,
    error,
    total,
    isTestMode,
    
    // Actions
    loadReviews,
    approveReview,
    rejectReview,
    deleteReview,
    clearError,
    
    // Helpers
    getReviewsByStatus,
    getReviewsStats,
    refresh: loadReviews
  };
};
