import { FILTER_ALL } from '../../constants/filters';
import { sampleCities } from './sampleData';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const CITY_STATUS_FILTERS = {
  ALL: FILTER_ALL,
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const CITY_FILTER_OPTIONS = [
  { value: CITY_STATUS_FILTERS.ALL, label: 'All Cities' },
  { value: CITY_STATUS_FILTERS.ACTIVE, label: 'Active' },
  { value: CITY_STATUS_FILTERS.INACTIVE, label: 'Inactive' }
];

export const filterCities = (cities, { search, status }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return cities.filter((city) => {
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(city.code).includes(normalizedSearch) ||
      toLowerCase(city.name).includes(normalizedSearch) ||
      toLowerCase(city.description).includes(normalizedSearch);

    const matchesStatus =
      status === FILTER_ALL ||
      (status === CITY_STATUS_FILTERS.ACTIVE && city.active) ||
      (status === CITY_STATUS_FILTERS.INACTIVE && !city.active);

    return matchesSearch && matchesStatus;
  });
};

export const getCityName = (city, fallbackLanguage = 'en') => {
  if (!city) {
    return '';
  }
  return city.name || city.code;
};

export { sampleCities };
