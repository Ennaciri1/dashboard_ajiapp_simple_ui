/**
 * Maps entity types from frontend format to API format
 * The API uses snake_case (e.g., 'tourist_spot') while frontend may use different formats
 */
export const mapEntityTypeToAPI = (entityType) => {
  const mapping = {
    'tourist-spot': 'tourist_spot',
    'touristSpot': 'tourist_spot',
    'tourist_spot': 'tourist_spot',
    'city': 'city',
    'hotel': 'hotel',
    'stadium': 'stadium',
    'visa': 'visa',
    'contact': 'contact',
    'activity': 'activity'
  };

  return mapping[entityType] || entityType;
};

/**
 * Maps entity types from API format to frontend format
 */
export const mapEntityTypeFromAPI = (apiEntityType) => {
  const mapping = {
    'tourist_spot': 'tourist-spot',
    'city': 'city',
    'hotel': 'hotel',
    'stadium': 'stadium',
    'visa': 'visa',
    'contact': 'contact',
    'activity': 'activity'
  };

  return mapping[apiEntityType] || apiEntityType;
};

