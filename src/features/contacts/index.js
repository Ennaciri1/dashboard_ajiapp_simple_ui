import { FILTER_ALL } from '../../constants/filters';
import { sampleContacts } from './sampleData';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const CONTACT_STATUS_FILTERS = {
  ALL: FILTER_ALL,
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const CONTACT_STATUS_OPTIONS = [
  { value: CONTACT_STATUS_FILTERS.ALL, label: 'All Status' },
  { value: CONTACT_STATUS_FILTERS.ACTIVE, label: 'Active' },
  { value: CONTACT_STATUS_FILTERS.INACTIVE, label: 'Inactive' }
];

export const CONTACT_CATEGORY_OPTIONS = [
  { value: FILTER_ALL, label: 'All Categories' },
  { value: 'Information', label: 'Information' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Events', label: 'Events' }
];

export const CONTACT_FILTER_DEFAULTS = {
  search: '',
  status: CONTACT_STATUS_FILTERS.ALL,
  category: FILTER_ALL
};

export const CONTACT_FILTERS = [
  {
    key: 'status',
    label: 'Status',
    options: CONTACT_STATUS_OPTIONS
  },
  {
    key: 'category',
    label: 'Category',
    options: CONTACT_CATEGORY_OPTIONS
  }
];

export const filterContacts = (contacts, { search, status, category }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return contacts.filter((contact) => {
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(contact.name).includes(normalizedSearch) ||
      toLowerCase(contact.icon).includes(normalizedSearch) ||
      toLowerCase(contact.link).includes(normalizedSearch);

    const matchesStatus =
      status === FILTER_ALL ||
      (status === CONTACT_STATUS_FILTERS.ACTIVE && contact.active) ||
      (status === CONTACT_STATUS_FILTERS.INACTIVE && !contact.active);

    const matchesCategory = category === FILTER_ALL || contact.category === category;

    return matchesSearch && matchesStatus && matchesCategory;
  });
};

export const getContactName = (contact, fallbackLanguage = 'en') => {
  if (!contact) {
    return '';
  }
  return contact.name || '';
};

export { sampleContacts };
