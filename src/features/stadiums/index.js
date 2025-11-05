// Stadium filters and utilities
export const STADIUM_FILTER_DEFAULTS = {
  search: '',
  city: 'all',
  status: 'all',
  capacity: 'all'
};

export const STADIUM_FILTERS = [
  {
    key: 'city',
    label: 'City',
    type: 'select',
    options: [
      { value: 'all', label: 'All Cities' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'all', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    key: 'capacity',
    label: 'Capacity',
    type: 'select',
    options: [
      { value: 'all', label: 'All Capacities' },
      { value: 'small', label: 'Small (< 20,000)' },
      { value: 'medium', label: 'Medium (20,000 - 50,000)' },
      { value: 'large', label: 'Large (> 50,000)' }
    ]
  }
];

// Filter function for stadiums
export const filterStadiums = (stadiums, filters) => {
  if (!Array.isArray(stadiums)) return [];

  return stadiums.filter(stadium => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const name = (stadium.nameTranslations?.en || stadium.name || '').toLowerCase();
      const description = (stadium.descriptionTranslations?.en || stadium.description || '').toLowerCase();
      const homeGround = (stadium.homeGround || '').toLowerCase();
      
      if (!name.includes(searchTerm) && 
          !description.includes(searchTerm) && 
          !homeGround.includes(searchTerm)) {
        return false;
      }
    }

    // City filter
    if (filters.city && filters.city !== 'all') {
      if (stadium.cityId !== filters.city) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      const isActive = stadium.active !== undefined ? stadium.active : (stadium.isActive !== undefined ? stadium.isActive : true);
      if (filters.status === 'active' && !isActive) {
        return false;
      }
      if (filters.status === 'inactive' && isActive) {
        return false;
      }
    }

    // Capacity filter
    if (filters.capacity && filters.capacity !== 'all') {
      const capacity = stadium.capacity || 0;
      switch (filters.capacity) {
        case 'small':
          if (capacity >= 20000) return false;
          break;
        case 'medium':
          if (capacity < 20000 || capacity > 50000) return false;
          break;
        case 'large':
          if (capacity <= 50000) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });
};

// Export components
export { default as StadiumsTable } from './StadiumsTable';
export { default as FormStadium } from './FormStadium';

