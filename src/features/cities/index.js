import { FILTER_ALL } from '../../constants/filters';

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
      toLowerCase(city.description).includes(normalizedSearch) ||
      // Rechercher dans les traductions
      Object.values(city.nameTranslations || {}).some(translation => 
        toLowerCase(translation).includes(normalizedSearch)
      );

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
  
  // Si la ville a des traductions, utiliser la langue préférée ou la première disponible
  if (city.nameTranslations) {
    return city.nameTranslations[fallbackLanguage] || 
           Object.values(city.nameTranslations)[0] || 
           city.code || 
           'Sans nom';
  }
  
  // Fallback pour l'ancienne structure
  return city.name || city.code || 'Sans nom';
};

export const getAllCityTranslations = (city) => {
  if (!city || !city.nameTranslations) {
    return [];
  }
  
  return Object.entries(city.nameTranslations).map(([language, translation]) => ({
    language,
    translation
  }));
};
