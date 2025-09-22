export const FILTER_ALL = 'all';

export const RATING_FILTERS = {
  ALL: FILTER_ALL,
  EXCELLENT: 'excellent',
  VERY_GOOD: 'very_good',
  GOOD: 'good',
  FAIR: 'fair'
};

export const RATING_FILTER_OPTIONS = [
  { value: RATING_FILTERS.ALL, label: 'All Ratings' },
  { value: RATING_FILTERS.EXCELLENT, label: 'Excellent (4.5+)' },
  { value: RATING_FILTERS.VERY_GOOD, label: 'Very Good (4.0+)' },
  { value: RATING_FILTERS.GOOD, label: 'Good (3.5+)' },
  { value: RATING_FILTERS.FAIR, label: 'Fair (3.0+)' }
];

export const PRICE_FILTERS = {
  ALL: FILTER_ALL,
  BUDGET: 'budget',
  MID_RANGE: 'mid_range',
  LUXURY: 'luxury'
};

export const PRICE_RANGE_OPTIONS = [
  { value: PRICE_FILTERS.ALL, label: 'All Prices' },
  { value: PRICE_FILTERS.BUDGET, label: 'Budget (0-100)' },
  { value: PRICE_FILTERS.MID_RANGE, label: 'Mid-range (100-250)' },
  { value: PRICE_FILTERS.LUXURY, label: 'Luxury (250+)' }
];

export const createOptionsFromList = (values = [], {
  includeAll = true,
  allLabel = 'All',
  mapLabel = (value) => value
} = {}) => {
  const options = values.map((value) => ({ value, label: mapLabel(value) }));
  if (!includeAll) {
    return options;
  }
  return [{ value: FILTER_ALL, label: allLabel }, ...options];
};
