import {
  FILTER_ALL
} from '../../constants/filters.js';
import { sampleTouristSpots } from './sampleData.js';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const TOURIST_FILTER_DEFAULTS = {
  search: '',
  city: FILTER_ALL,
  entry: FILTER_ALL
};

export const TOURIST_FILTERS = [
  {
    key: 'city',
    label: 'City',
    options: [] // Will be populated dynamically with cities from API
  },
  {
    key: 'entry',
    label: 'Entry',
    options: [
      { value: FILTER_ALL, label: 'All Entry Types' },
      { value: 'free', label: 'Free Entry' },
      { value: 'paid', label: 'Paid Entry' }
    ]
  }
];

export const filterSpots = (spots, { search, city, entry }) => {
  // Ensure spots is an array
  if (!Array.isArray(spots)) {
    console.warn('filterSpots: spots is not an array', spots);
    return [];
  }

  const normalizedSearch = search.trim().toLowerCase();

  return spots.filter((spot) => {
    // Get name from translations or fallback to name
    const spotName = spot.nameTranslations?.en || spot.name || '';
    const spotDescription = spot.descriptionTranslations?.en || spot.description || '';
    const spotAddress = spot.addressTranslations?.en || spot.address || '';
    
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(spotName).includes(normalizedSearch) ||
      toLowerCase(spot.cityName || '').includes(normalizedSearch) ||
      toLowerCase(spotDescription).includes(normalizedSearch) ||
      toLowerCase(spotAddress).includes(normalizedSearch) ||
      toLowerCase(spot.address || '').includes(normalizedSearch) ||
      (spot.interestTypes || []).some((interest) =>
        toLowerCase(interest).includes(normalizedSearch)
      );

    // Filter by city
    const matchesCity = 
      city === FILTER_ALL || 
      spot.cityId === city ||
      toLowerCase(spot.cityName || '').includes(toLowerCase(city));

    // Filter by entry type (free/paid)
    const matchesEntry = 
      entry === FILTER_ALL ||
      (entry === 'free' && !spot.paidEntry) ||
      (entry === 'paid' && spot.paidEntry);

    return matchesSearch && matchesCity && matchesEntry;
  });
};

export { sampleTouristSpots };
