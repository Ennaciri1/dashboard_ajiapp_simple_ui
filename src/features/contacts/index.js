import { FILTER_ALL } from '../../constants/filters';

const toLowerCase = (value = '') => value.toString().toLowerCase();

export const CONTACT_STATUS_FILTERS = {
  ALL: FILTER_ALL,
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const CONTACT_STATUS_OPTIONS = [
  { value: CONTACT_STATUS_FILTERS.ALL, label: 'Tous les statuts' },
  { value: CONTACT_STATUS_FILTERS.ACTIVE, label: 'Actif' },
  { value: CONTACT_STATUS_FILTERS.INACTIVE, label: 'Inactif' }
];

export const CONTACT_FILTER_DEFAULTS = {
  search: '',
  status: CONTACT_STATUS_FILTERS.ALL
};

export const CONTACT_FILTERS = [
  {
    key: 'status',
    label: 'Statut',
    options: CONTACT_STATUS_OPTIONS
  }
];

export const filterContacts = (contacts, { search, status }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return contacts.filter((contact) => {
    const matchesSearch =
      !normalizedSearch ||
      toLowerCase(contact.name || '').includes(normalizedSearch) ||
      toLowerCase(contact.icon || '').includes(normalizedSearch) ||
      toLowerCase(contact.link || '').includes(normalizedSearch);

    const matchesStatus =
      status === FILTER_ALL ||
      (status === CONTACT_STATUS_FILTERS.ACTIVE && (contact.active !== undefined ? contact.active : contact.isActive)) ||
      (status === CONTACT_STATUS_FILTERS.INACTIVE && !(contact.active !== undefined ? contact.active : contact.isActive));

    return matchesSearch && matchesStatus;
  });
};

export const getContactName = (contact) => {
  if (!contact) {
    return '';
  }
  
  // Utiliser le nom directement ou extraire de nameTranslations.en
  return contact.name || (contact.nameTranslations && contact.nameTranslations.en) || '';
};

