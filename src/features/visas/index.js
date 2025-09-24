import { FILTER_ALL } from '../../constants/filters';
import { sampleVisas } from './sampleData';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const VISA_REQUIREMENT_FILTERS = {
  ALL: FILTER_ALL,
  REQUIRED: 'required',
  NOT_REQUIRED: 'not_required'
};

export const VISA_REQUIREMENT_OPTIONS = [
  { value: VISA_REQUIREMENT_FILTERS.ALL, label: 'All' },
  { value: VISA_REQUIREMENT_FILTERS.REQUIRED, label: 'Required' },
  { value: VISA_REQUIREMENT_FILTERS.NOT_REQUIRED, label: 'Not required' }
];

export const VISA_FILTER_DEFAULTS = {
  search: '',
  requirement: VISA_REQUIREMENT_FILTERS.ALL
};

export const VISA_FILTERS = [
  {
    key: 'requirement',
    label: 'Requirement',
    options: VISA_REQUIREMENT_OPTIONS
  }
];

export const filterVisas = (visas, { search, requirement }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return visas.filter((visa) => {
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(visa.country).includes(normalizedSearch) ||
      toLowerCase(visa.nationality).includes(normalizedSearch);

    const matchesRequirement =
      requirement === FILTER_ALL ||
      (requirement === VISA_REQUIREMENT_FILTERS.REQUIRED && visa.isRequired) ||
      (requirement === VISA_REQUIREMENT_FILTERS.NOT_REQUIRED && !visa.isRequired);

    return matchesSearch && matchesRequirement;
  });
};

export const getVisaCountry = (visa, fallbackLanguage = 'en') => {
  return visa?.country || '';
};

export const getVisaNationality = (visa, fallbackLanguage = 'en') => {
  return visa?.nationality || '';
};

export { sampleVisas };
