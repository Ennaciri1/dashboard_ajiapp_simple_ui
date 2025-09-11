// Common utility functions used across the application

// Date formatting
export const formatDate = (date) => new Date(date).toLocaleDateString();

// Text truncation
export const truncateText = (text, maxLength) => 
  text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

// Currency formatting
export const formatCurrency = (value, currency = '$') => 
  `${currency}${value.toLocaleString()}`;

// Generic filter function
export const filterData = (data, searchTerm, filters, searchFields) => {
  return data.filter(item => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    
    // Other filters
    const matchesFilters = Object.entries(filters).every(([key, value]) => 
      value === 'All' || item[key] === value
    );
    
    return matchesSearch && matchesFilters;
  });
};

// Generic search fields for different data types
export const SEARCH_FIELDS = {
  DASHBOARD: ['name', 'type', 'description'],
  FEATURES: ['name', 'category', 'description'],
  HOTELS: ['name', 'location', 'description', 'amenities'],
  TOURIST_SPOTS: ['name', 'city', 'description', 'interestTypes']
};

// Common filter options
export const FILTER_OPTIONS = {
  STATUS: [
    { value: 'All', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Warning', label: 'Warning' }
  ],
  PRIORITY: [
    { value: 'All', label: 'All Priorities' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ]
};
