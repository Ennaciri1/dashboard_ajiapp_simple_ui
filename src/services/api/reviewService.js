import httpClient from './httpClient';

const API_BASE = '/reviews';

export const reviewService = {
  // Get all reviews
  getAllReviews: async () => {
    try {
      const response = await httpClient.get(`${API_BASE}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Update review status
  updateReviewStatus: async (reviewId, statusData) => {
    try {
      const response = await httpClient.put(`${API_BASE}/${reviewId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await httpClient.delete(`${API_BASE}/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Approve review
  approveReview: async (reviewId) => {
    return reviewService.updateReviewStatus(reviewId, {
      status: 'APPROVED',
      rejectionReason: null
    });
  },

  // Reject review
  rejectReview: async (reviewId, rejectionReason) => {
    if (!rejectionReason || rejectionReason.trim() === '') {
      throw new Error('Rejection reason is required');
    }
    
    return reviewService.updateReviewStatus(reviewId, {
      status: 'REJECTED',
      rejectionReason: rejectionReason.trim()
    });
  },

  // Set review to pending
  setPendingReview: async (reviewId) => {
    return reviewService.updateReviewStatus(reviewId, {
      status: 'PENDING',
      rejectionReason: null
    });
  }
};
