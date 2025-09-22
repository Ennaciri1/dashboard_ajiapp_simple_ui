import {
  RATING_FILTERS,
  RATING_FILTER_OPTIONS,
  PRICE_FILTERS,
  PRICE_RANGE_OPTIONS
} from '../../constants/filters.js';
import { matchesRatingFilter, matchesPriceFilter } from '../../utils/filters.js';
import { sampleHotels } from './sampleData.js';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const HOTEL_FILTER_DEFAULTS = {
  search: '',
  rating: RATING_FILTERS.ALL,
  price: PRICE_FILTERS.ALL
};

export const HOTEL_FILTERS = [
  {
    key: 'rating',
    label: 'Rating',
    options: RATING_FILTER_OPTIONS
  },
  {
    key: 'price',
    label: 'Price Range',
    options: PRICE_RANGE_OPTIONS
  }
];

export const filterHotels = (hotels, { search, rating, price }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return hotels.filter((hotel) => {
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(hotel.name).includes(normalizedSearch) ||
      toLowerCase(hotel.location).includes(normalizedSearch) ||
      toLowerCase(hotel.description).includes(normalizedSearch) ||
      (hotel.amenities || []).some((amenity) =>
        toLowerCase(amenity).includes(normalizedSearch)
      );

    const matchesRating = matchesRatingFilter(hotel.rating, rating);
    const matchesPrice = matchesPriceFilter(hotel.pricePerNight, price);

    return matchesSearch && matchesRating && matchesPrice;
  });
};

export { sampleHotels };
