import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Typography,
  Alert
} from '@mui/material';
import { LoadingButton } from '../ui';
import { Hotel } from '../../../core/entities/Hotel.js';
import { validateHotel } from '../../../shared/validators/hotelValidator.js';
import { HOTEL_AMENITIES, PRICE_RANGES } from '../../../shared/types/Hotel.js';

/**
 * Composant de formulaire pour les hôtels - Utilise les entités pour la validation
 */
const HotelForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    amenities: [],
    rating: '',
    priceRange: '',
    images: [],
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  // Initialisation avec les données existantes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Validation en temps réel
  useEffect(() => {
    const validation = validateHotel(formData);
    setValidationErrors(validation.errors);
  }, [formData]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    if (field.includes('.')) {
      // Gestion des champs imbriqués (contactInfo.email)
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAmenitiesChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      amenities: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Création de l'entité pour validation finale
      const hotel = new Hotel(formData);
      const validation = hotel.validate();
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }

      // Soumission du formulaire
      await onSubmit(hotel.toJSON());
      
      // Reset du formulaire si c'est une création
      if (!initialData) {
        setFormData({
          name: '',
          location: '',
          description: '',
          amenities: [],
          rating: '',
          priceRange: '',
          images: [],
          contactInfo: { email: '', phone: '', website: '' }
        });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const isFormValid = validationErrors.length === 0 && formData.name && formData.location;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Erreurs de validation globales */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Erreurs de validation :</Typography>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Erreur de soumission */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      {/* Informations de base */}
      <Typography variant="h6" gutterBottom>
        Informations de base
      </Typography>

      <TextField
        fullWidth
        label="Nom de l'hôtel"
        value={formData.name}
        onChange={handleInputChange('name')}
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Localisation"
        value={formData.location}
        onChange={handleInputChange('location')}
        error={!!errors.location}
        helperText={errors.location}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={handleInputChange('description')}
        multiline
        rows={3}
        margin="normal"
      />

      {/* Note et gamme de prix */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="Note (0-5)"
          type="number"
          value={formData.rating}
          onChange={handleInputChange('rating')}
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          sx={{ flex: 1 }}
        />

        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Gamme de prix</InputLabel>
          <Select
            value={formData.priceRange}
            onChange={handleInputChange('priceRange')}
            label="Gamme de prix"
          >
            {Object.entries(PRICE_RANGES).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Équipements */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Équipements</InputLabel>
        <Select
          multiple
          value={formData.amenities}
          onChange={handleAmenitiesChange}
          input={<OutlinedInput label="Équipements" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {Object.entries(HOTEL_AMENITIES).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Informations de contact */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Informations de contact
      </Typography>

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.contactInfo.email}
        onChange={handleInputChange('contactInfo.email')}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Téléphone"
        value={formData.contactInfo.phone}
        onChange={handleInputChange('contactInfo.phone')}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Site web"
        value={formData.contactInfo.website}
        onChange={handleInputChange('contactInfo.website')}
        margin="normal"
      />

      {/* Boutons d'action */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <LoadingButton
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </LoadingButton>
        
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          disabled={!isFormValid}
          loadingText="Enregistrement..."
        >
          {initialData ? 'Modifier' : 'Créer'} l'hôtel
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default HotelForm;
