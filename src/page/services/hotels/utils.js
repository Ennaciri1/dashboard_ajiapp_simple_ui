import { RATING_FILTERS, RATING_THRESHOLDS, PRICE_RANGES } from './constants.js';

// Filter hotels based on search term and filters
export const filterHotels = (hotels, searchTerm, statusFilter, ratingFilter, priceFilter) => {
  return hotels.filter(hotel => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'All' || hotel.status === statusFilter;

    // Rating filter
    const matchesRating = ratingFilter === RATING_FILTERS.ALL ||
      (ratingFilter === RATING_FILTERS.HIGH && hotel.rating >= RATING_THRESHOLDS.HIGH) ||
      (ratingFilter === RATING_FILTERS.MEDIUM && hotel.rating >= RATING_THRESHOLDS.MEDIUM && hotel.rating < RATING_THRESHOLDS.HIGH) ||
      (ratingFilter === RATING_FILTERS.LOW && hotel.rating < RATING_THRESHOLDS.MEDIUM);

    // Price filter
    const matchesPrice = priceFilter === PRICE_RANGES.ALL ||
      (priceFilter === PRICE_RANGES.BUDGET && hotel.pricePerNight <= 100) ||
      (priceFilter === PRICE_RANGES.MID_RANGE && hotel.pricePerNight > 100 && hotel.pricePerNight <= 250) ||
      (priceFilter === PRICE_RANGES.LUXURY && hotel.pricePerNight > 250);

    return matchesSearch && matchesStatus && matchesRating && matchesPrice;
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

// Get price filter label
export const getPriceFilterLabel = (priceFilter) => {
  switch (priceFilter) {
    case PRICE_RANGES.BUDGET:
      return 'Budget (0-100)';
    case PRICE_RANGES.MID_RANGE:
      return 'Mid-range (100-250)';
    case PRICE_RANGES.LUXURY:
      return 'Luxury (250+)';
    default:
      return 'All Prices';
  }
};
