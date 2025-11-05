import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent } from '@mui/material';
import ReviewsTable from '../../../features/reviews/ReviewsTable';
import {
  filterReviews,
  REVIEW_FILTERS,
  REVIEW_FILTER_DEFAULTS
} from '../../../features/reviews';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { useReviews } from '../../../presentation/hooks/useReviews';
import './Reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [filters, setFilters] = useState(REVIEW_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  // Using useReviews hook for real API
  const {
    reviews,
    loading,
    error,
    isTestMode,
    approveReview,
    rejectReview,
    deleteReview,
    refresh
  } = useReviews();

  const filteredReviews = useMemo(() => filterReviews(reviews, filters), [reviews, filters]);

  // Load data on component mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAddReview = () => {
    navigate('/services/reviews/formReview');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedReviews(filteredReviews.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    );
  };

  const handleMenuClick = (event, reviewId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReviewId(reviewId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReviewId(null);
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = REVIEW_FILTERS.map((filter) => ({
    ...filter,
    value: filters[filter.key],
    onChange: handleFilterChange(filter.key)
  }));

  const actionItems = [
    {
      key: 'approve',
      label: 'Approve',
      onClick: async () => {
        try {
          await approveReview(selectedReviewId);
          showSuccess('Review approved successfully');
        } catch (error) {
          showError(`Error approving review: ${error.message}`);
        }
        handleMenuClose();
      }
    },
    {
      key: 'reject',
      label: 'Reject',
      onClick: async () => {
        const reason = prompt('Rejection reason:');
        if (reason && reason.trim()) {
          try {
            await rejectReview(selectedReviewId, reason.trim());
            showSuccess('Review rejected successfully');
          } catch (error) {
            showError(`Error rejecting review: ${error.message}`);
          }
        }
        handleMenuClose();
      }
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: async () => {
        const confirmed = window.confirm('Are you sure you want to delete this review?');
        if (confirmed) {
          try {
            await deleteReview(selectedReviewId);
            showSuccess('Review deleted successfully');
          } catch (error) {
            showError(`Error deleting review: ${error.message}`);
          }
        }
        handleMenuClose();
      }
    }
  ];

  const handleDeleteAllReviews = async () => {
    if (selectedReviews.length === 0) {
      showError('Please select reviews to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedReviews.length} selected review(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Delete each review via API
      for (const reviewId of selectedReviews) {
        await deleteReview(reviewId);
      }
      
      setSelectedReviews([]);
      showSuccess(`${selectedReviews.length} review(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting reviews:', error);
      showError('Error deleting reviews');
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="global-container">
        <div className="page-header">
          <Typography variant="h4" component="h1" className="page-title">
            Reviews Management
          </Typography>
        </div>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Loading Error
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <button onClick={refresh} className="retry-button">
            Retry
          </button>
        </Box>
      </div>
    );
  }

  return (
    <div className="global-container">
      <div className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Reviews Management
        </Typography>
        <Typography variant="body1" color="textSecondary" className="page-subtitle">
          Manage and moderate user reviews
        </Typography>
      </div>

      {/* Test mode indicator */}
      {isTestMode && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.dark">
            🧪 Test mode enabled - API unavailable. Displayed data is sample.
          </Typography>
        </Box>
      )}

      <FilterToolbar
        title="Filters and Actions"
        search={{
          placeholder: 'Search reviews...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add Review',
          onClick: handleAddReview
        }}
        secondaryActions={[
          {
            label: 'Delete Selected',
            onClick: handleDeleteAllReviews,
            disabled: selectedReviews.length === 0,
            color: 'error'
          }
        ]}
      />

      <Box className="results-indicator">
        <Typography variant="body1" color="textPrimary">
          {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
          {filteredReviews.length !== reviews.length && ` out of ${reviews.length} total`}
        </Typography>
        {selectedReviews.length > 0 && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
          </Typography>
        )}
      </Box>

      <Card className="data-card">
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography variant="body2" color="textSecondary">
                Loading reviews...
              </Typography>
            </Box>
          ) : (
            <ReviewsTable
              reviews={filteredReviews}
              selectedReviews={selectedReviews}
              onSelectAll={handleSelectAll}
              onSelectReview={handleSelectReview}
              onMenuClick={handleMenuClick}
            />
          )}
        </CardContent>
      </Card>

      <ActionMenu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleMenuClose} 
        items={actionItems}
        className="action-menu"
      />
    </div>
  );
};

export default Reviews;
