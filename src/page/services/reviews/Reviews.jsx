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
import './Reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews] = useState(sampleReviews);
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
      onClick: () => alert(`Review ${selectedReviewId} approved`)
    },
    {
      key: 'reject',
      label: 'Reject',
      onClick: () => alert(`Review ${selectedReviewId} rejected`)
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => alert(`Review ${selectedReviewId} deleted`)
    }
  ];

  return (
    <div className="global-container">
      <FilterToolbar
        title="Reviews Management"
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
      />

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredReviews.length} review{filteredReviews.length === 1 ? '' : 's'} found
          {filteredReviews.length !== reviews.length && ` out of ${reviews.length} total`}
        </Typography>
      </Box>

      <Card>
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

      <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} items={actionItems} />
    </div>
  );
};

export default Reviews;
