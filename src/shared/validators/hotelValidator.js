/**
 * Validateurs pour les données d'hôtel
 */

export const hotelValidators = {
  /**
   * Valide le nom de l'hôtel
   */
  name: (name) => {
    const errors = [];
    
    if (!name || typeof name !== 'string') {
      errors.push('Le nom est requis');
    } else if (name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    } else if (name.length > 100) {
      errors.push('Le nom ne peut pas dépasser 100 caractères');
    }
    
    return errors;
  },

  /**
   * Valide la localisation
   */
  location: (location) => {
    const errors = [];
    
    if (!location || typeof location !== 'string') {
      errors.push('La localisation est requise');
    } else if (location.trim().length < 2) {
      errors.push('La localisation doit contenir au moins 2 caractères');
    } else if (location.length > 200) {
      errors.push('La localisation ne peut pas dépasser 200 caractères');
    }
    
    return errors;
  },

  /**
   * Valide la note
   */
  rating: (rating) => {
    const errors = [];
    
    if (rating !== null && rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating)) {
        errors.push('La note doit être un nombre');
      } else if (numRating < 0 || numRating > 5) {
        errors.push('La note doit être entre 0 et 5');
      }
    }
    
    return errors;
  },

  /**
   * Valide les équipements
   */
  amenities: (amenities) => {
    const errors = [];
    
    if (amenities && !Array.isArray(amenities)) {
      errors.push('Les équipements doivent être un tableau');
    } else if (amenities && amenities.some(item => typeof item !== 'string')) {
      errors.push('Tous les équipements doivent être des chaînes de caractères');
    }
    
    return errors;
  },

  /**
   * Valide les images
   */
  images: (images) => {
    const errors = [];
    
    if (images && !Array.isArray(images)) {
      errors.push('Les images doivent être un tableau');
    } else if (images) {
      const urlRegex = /^https?:\/\/.+/i;
      images.forEach((image, index) => {
        if (typeof image !== 'string' || !urlRegex.test(image)) {
          errors.push(`L'image ${index + 1} doit être une URL valide`);
        }
      });
    }
    
    return errors;
  },

  /**
   * Valide les informations de contact
   */
  contactInfo: (contactInfo) => {
    const errors = [];
    
    if (contactInfo && typeof contactInfo !== 'object') {
      errors.push('Les informations de contact doivent être un objet');
    } else if (contactInfo) {
      // Validation de l'email si présent
      if (contactInfo.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactInfo.email)) {
          errors.push('L\'email doit avoir un format valide');
        }
      }
      
      // Validation du téléphone si présent
      if (contactInfo.phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(contactInfo.phone)) {
          errors.push('Le numéro de téléphone contient des caractères invalides');
        }
      }
    }
    
    return errors;
  }
};

/**
 * Valide toutes les données d'un hôtel
 */
export const validateHotel = (hotelData) => {
  const allErrors = [];
  
  // Validation de chaque champ
  allErrors.push(...hotelValidators.name(hotelData.name));
  allErrors.push(...hotelValidators.location(hotelData.location));
  allErrors.push(...hotelValidators.rating(hotelData.rating));
  allErrors.push(...hotelValidators.amenities(hotelData.amenities));
  allErrors.push(...hotelValidators.images(hotelData.images));
  allErrors.push(...hotelValidators.contactInfo(hotelData.contactInfo));
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};
