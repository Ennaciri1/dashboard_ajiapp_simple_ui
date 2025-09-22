import { RATING_FILTERS, PRICE_FILTERS } from '../constants/filters.js';

const ratingPredicates = {
  [RATING_FILTERS.EXCELLENT]: (value) => value >= 4.5,
  [RATING_FILTERS.VERY_GOOD]: (value) => value >= 4.0 && value < 4.5,
  [RATING_FILTERS.GOOD]: (value) => value >= 3.5 && value < 4.0,
  [RATING_FILTERS.FAIR]: (value) => value >= 3.0 && value < 3.5
};

export const matchesRatingFilter = (rating, filter) => {
  if (filter === RATING_FILTERS.ALL) {
    return true;
  }

  const predicate = ratingPredicates[filter];
  return predicate ? predicate(rating) : true;
};

const pricePredicates = {
  [PRICE_FILTERS.BUDGET]: (value) => value <= 100,
  [PRICE_FILTERS.MID_RANGE]: (value) => value > 100 && value <= 250,
  [PRICE_FILTERS.LUXURY]: (value) => value > 250
};

export const matchesPriceFilter = (price, filter) => {
  if (filter === PRICE_FILTERS.ALL) {
    return true;
  }

  const predicate = pricePredicates[filter];
  return predicate ? predicate(price) : true;
};
