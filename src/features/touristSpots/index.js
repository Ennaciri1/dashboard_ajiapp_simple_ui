import {
  FILTER_ALL,
  RATING_FILTERS,
  RATING_FILTER_OPTIONS,
  createOptionsFromList
} from '../../constants/filters.js';
import { matchesRatingFilter } from '../../utils/filters.js';
import { sampleTouristSpots } from './sampleData.js';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const INTEREST_TYPES = [
  'History',
  'Architecture',
  'Nature',
  'Culture',
  'Religion',
  'Shopping',
  'Entertainment',
  'Food',
  'Adventure',
  'Photography',
  'Art',
  'Beach',
  'Mountain',
  'Desert'
];

export const TOURIST_FILTER_DEFAULTS = {
  search: '',
  type: FILTER_ALL,
  rating: RATING_FILTERS.ALL
};

export const TOURIST_FILTERS = [
  {
    key: 'type',
    label: 'Type',
    options: createOptionsFromList(INTEREST_TYPES, { allLabel: 'All Types' })
  },
  {
    key: 'rating',
    label: 'Rating',
    options: RATING_FILTER_OPTIONS
  }
];

export const filterSpots = (spots, { search, type, rating }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return spots.filter((spot) => {
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(spot.name).includes(normalizedSearch) ||
      toLowerCase(spot.city).includes(normalizedSearch) ||
      toLowerCase(spot.description).includes(normalizedSearch) ||
      (spot.interestTypes || []).some((interest) =>
        toLowerCase(interest).includes(normalizedSearch)
      );

    const matchesType =
      type === FILTER_ALL || (spot.interestTypes || []).includes(type);

    const matchesRating = matchesRatingFilter(spot.rating, rating);

    return matchesSearch && matchesType && matchesRating;
  });
};

export { sampleTouristSpots };
