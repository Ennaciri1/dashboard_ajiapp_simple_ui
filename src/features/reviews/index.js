import { FILTER_ALL, RATING_FILTER_OPTIONS, RATING_FILTERS } from '../../constants/filters';
import { matchesRatingFilter } from '../../utils/filters';
import { sampleReviews, sampleReviewUsers } from './sampleData';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const REVIEW_STATUS = {
  ALL: FILTER_ALL,
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED'
};

export const REVIEW_ENTITY_TYPES = {
  ALL: FILTER_ALL,
  SPOT: 'spot',
  HOTEL: 'hotel',
  ACTIVITY: 'activity'
};

export const REVIEW_STATUS_OPTIONS = [
  { value: REVIEW_STATUS.ALL, label: 'All Status' },
  { value: REVIEW_STATUS.PENDING, label: 'Pending' },
  { value: REVIEW_STATUS.APPROVED, label: 'Approved' },
  { value: REVIEW_STATUS.REJECTED, label: 'Rejected' },
  { value: REVIEW_STATUS.DELETED, label: 'Deleted' }
];

export const REVIEW_ENTITY_OPTIONS = [
  { value: REVIEW_ENTITY_TYPES.ALL, label: 'All Entities' },
  { value: REVIEW_ENTITY_TYPES.SPOT, label: 'Tourist Spots' },
  { value: REVIEW_ENTITY_TYPES.HOTEL, label: 'Hotels' },
  { value: REVIEW_ENTITY_TYPES.ACTIVITY, label: 'Activities' }
];

export const REVIEW_FILTER_DEFAULTS = {
  search: '',
  status: REVIEW_STATUS.ALL,
  rating: RATING_FILTERS.ALL,
  entityType: REVIEW_ENTITY_TYPES.ALL
};

export const REVIEW_FILTERS = [
  {
    key: 'status',
    label: 'Status',
    options: REVIEW_STATUS_OPTIONS
  },
  {
    key: 'entityType',
    label: 'Entity type',
    options: REVIEW_ENTITY_OPTIONS
  },
  {
    key: 'rating',
    label: 'Rating',
    options: RATING_FILTER_OPTIONS
  }
];

export const filterReviews = (reviews, { search, status, rating, entityType }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return reviews.filter((review) => {
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(review.message).includes(normalizedSearch) ||
      toLowerCase(review.userName).includes(normalizedSearch) ||
      toLowerCase(review.entityName).includes(normalizedSearch);

    const matchesStatus = status === FILTER_ALL || review.status === status;
    const matchesEntityType = entityType === FILTER_ALL || review.entityType === entityType;
    const matchesRating = matchesRatingFilter(review.rating, rating);

    return matchesSearch && matchesStatus && matchesEntityType && matchesRating;
  });
};

export { sampleReviews, sampleReviewUsers };
