import { RATING_FILTERS, RATING_THRESHOLDS } from './constants.js';

// Filter spots based on search term and filters
export const filterSpots = (spots, searchTerm, typeFilter, ratingFilter) => {
  return spots.filter(spot => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.interestTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()));

    // Type filter
    const matchesType = typeFilter === RATING_FILTERS.ALL || 
      spot.interestTypes.includes(typeFilter);

    // Rating filter
    const matchesRating = ratingFilter === RATING_FILTERS.ALL ||
      (ratingFilter === RATING_FILTERS.HIGH && spot.rating >= RATING_THRESHOLDS.HIGH) ||
      (ratingFilter === RATING_FILTERS.MEDIUM && spot.rating >= RATING_THRESHOLDS.MEDIUM && spot.rating < RATING_THRESHOLDS.HIGH) ||
      (ratingFilter === RATING_FILTERS.LOW && spot.rating < RATING_THRESHOLDS.MEDIUM);

    return matchesSearch && matchesType && matchesRating;
  });
};

// Get rating filter label
export const getRatingFilterLabel = (ratingFilter) => {
  switch (ratingFilter) {
    case RATING_FILTERS.HIGH:
      return 'High (4.5+)';
    case RATING_FILTERS.MEDIUM:
      return 'Medium (3.5-4.4)';
    case RATING_FILTERS.LOW:
      return 'Low (<3.5)';
    default:
      return 'All Ratings';
  }
};
