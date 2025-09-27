import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent } from '@mui/material';
import ReviewsTable from '../../../features/reviews/ReviewsTable';
import {
  sampleReviews,
  filterReviews,
  REVIEW_FILTERS,
  REVIEW_FILTER_DEFAULTS
} from '../../../features/reviews';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import './Reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [reviews, setReviews] = useState(sampleReviews);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [filters, setFilters] = useState(REVIEW_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const filteredReviews = useMemo(() => filterReviews(reviews, filters), [reviews, filters]);

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
      onClick: () => showSuccess(`Review ${selectedReviewId} approved`)
    },
    {
      key: 'reject',
      label: 'Reject',
      onClick: () => showError(`Review ${selectedReviewId} rejected`)
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => showSuccess(`Review ${selectedReviewId} deleted`)
    }
  ];

  const handleDeleteAllReviews = async () => {
    if (selectedReviews.length === 0) {
      showError('Please select reviews to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedReviews.length} selected reviews? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Update state to remove selected reviews
      setReviews(prev => prev.filter(review => !selectedReviews.includes(review.id)));
      setSelectedReviews([]);
      
      showSuccess(`${selectedReviews.length} reviews deleted successfully`);
    } catch (error) {
      console.error('Error deleting reviews:', error);
      showError('Error deleting reviews');
    }
  };

  return (
    <div className="global-container">
      <div className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Gestion des Avis
        </Typography>
        <Typography variant="body1" color="textSecondary" className="page-subtitle">
          Gérez et modérez les avis des utilisateurs
        </Typography>
      </div>

      <FilterToolbar
        title="Filtres et Actions"
        search={{
          placeholder: 'Rechercher des avis...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Ajouter un Avis',
          onClick: handleAddReview
        }}
        secondaryActions={[
          {
            label: 'Supprimer Sélection',
            onClick: handleDeleteAllReviews,
            disabled: selectedReviews.length === 0,
            color: 'error'
          }
        ]}
      />

      <Box className="results-indicator">
        <Typography variant="body1" color="textPrimary">
          {filteredReviews.length} avis trouvé{filteredReviews.length === 1 ? '' : 's'}
          {filteredReviews.length !== reviews.length && ` sur ${reviews.length} au total`}
        </Typography>
        {selectedReviews.length > 0 && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            {selectedReviews.length} avis sélectionné{selectedReviews.length > 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      <Card className="data-card">
        <CardContent>
          <ReviewsTable
            reviews={filteredReviews}
            selectedReviews={selectedReviews}
            onSelectAll={handleSelectAll}
            onSelectReview={handleSelectReview}
            onMenuClick={handleMenuClick}
          />
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
