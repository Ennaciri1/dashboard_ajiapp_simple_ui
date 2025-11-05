import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio
} from '@mui/material';
import { cityService } from '../../infrastructure/api/cityService';
import { useTouristSpots } from '../../presentation/hooks/useTouristSpots';
import { MapSelector, MultiImageSelector } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import './FormSpots.css';

const validateFormData = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.cityId) {
    errors.cityId = 'City is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const formatFormData = (data, isEditMode = false) => {
  const baseData = {
    nameTranslations: { en: data.name.trim() },
    descriptionTranslations: { en: data.description.trim() },
    addressTranslations: { en: data.address.trim() },
    cityId: data.cityId,
    location: {
      latitude: data.latitude ? parseFloat(data.latitude) : 0,
      longitude: data.longitude ? parseFloat(data.longitude) : 0,
      valid: true
    },
    images: data.images
      .filter((image) => image.url || image.owner)
      .map((image) => ({
        url: image.url || null,
        owner: image.owner || null
      })),
    openingTime: data.openingTime,
    closingTime: data.closingTime,
  };

  // Different field names for create vs update
  if (isEditMode) {
    return {
      ...baseData,
      isPaidEntry: data.entryType === 'paid',
      isActive: data.active,
    };
  } else {
    return {
      ...baseData,
      paidEntry: data.entryType === 'paid',
    };
  }
};

const FormSpots = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { showSuccess, showError } = useNotification();
  const { createSpot, updateSpot, getSpotById } = useTouristSpots();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    cityId: '',
    latitude: '',
    longitude: '',
    images: [],
    entryType: 'free', // 'free' or 'paid'
    active: false,
    openingTime: '09:00',
    closingTime: '18:00',
  });

  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  // Load cities from API
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await cityService.getAllCities();
        setCities(response.data || []);
        if (response.data && response.data.length > 0 && !isEditMode) {
          setFormData(prev => ({ ...prev, cityId: response.data[0].id }));
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };
    loadCities();
  }, [isEditMode]);

  // Load tourist spot data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadTouristSpot = async () => {
        try {
          setInitialLoading(true);
          const spotEntity = await getSpotById(id);
          
          if (spotEntity) {
            // Récupérer les détails complets depuis l'API pour cityId et location
            const { TouristSpotRepository } = await import('../../infrastructure/api/TouristSpotRepository.js');
            const repository = new TouristSpotRepository();
            const spotData = await repository.findById(id);
          
          // Transform API data to form data format
          setFormData({
              name: spotEntity.name || '',
              description: spotEntity.description || '',
              address: spotData?.addressTranslations?.en || spotData?.address || '',
              cityId: spotData?.cityId || '',
              latitude: spotData?.location?.latitude?.toString() || spotEntity.coordinates?.lat?.toString() || '',
              longitude: spotData?.location?.longitude?.toString() || spotEntity.coordinates?.lng?.toString() || '',
              images: (spotEntity.images || []).map((image, index) => ({
              ...image,
              id: image.id || `existing-${index}`,
              name: image.name || `Image ${index + 1}`,
                url: typeof image === 'string' ? image : image.url,
              owner: image.owner || ''
            })),
              entryType: (spotData?.paidEntry || spotData?.isPaidEntry) ? 'paid' : 'free',
              active: spotEntity.status === 'active',
              openingTime: spotData?.openingTime || '09:00',
              closingTime: spotData?.closingTime || '18:00',
          });
          }
        } catch (error) {
          console.error('Error loading tourist spot:', error);
          showError('Error loading tourist spot data');
          navigate('/services/tourist-spots');
        } finally {
          setInitialLoading(false);
        }
      };
      loadTouristSpot();
    }
  }, [isEditMode, id, navigate, getSpotById, showError]);

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleToggleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.checked });
  };


  const handleImagesChange = (images) => {
    setFormData({
      ...formData,
      images: images
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showError('Please fix the errors before submitting.');
      setLoading(false);
      return;
    }

    try {
      const formattedData = formatFormData(formData, isEditMode);
      
      if (isEditMode) {
        await updateSpot(id, formattedData);
        showSuccess('Tourist spot updated successfully!');
      } else {
        await createSpot(formattedData);
        showSuccess('Tourist spot created successfully!');
      }
      
      navigate('/services/tourist-spots');
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} tourist spot:`, error);
      showError(`Error ${isEditMode ? 'updating' : 'creating'} tourist spot`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/services/tourist-spots');
  };

  // Show loading spinner while loading initial data in edit mode
  if (initialLoading) {
    return (
      <div className="simple-form-container">
        <div className="form-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h1>{isEditMode ? 'Edit Tourist Spot' : 'Add Tourist Spot'}</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>{isEditMode ? 'Edit Tourist Spot' : 'Add Tourist Spot'}</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              className={`simple-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={3}
              className={`simple-textarea ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={handleInputChange('address')}
              className="simple-input"
              required
            />
          </div>

          <div className="form-group">
            <FormControl fullWidth>
              <InputLabel>City *</InputLabel>
              <Select value={formData.cityId} label="City *" onChange={handleInputChange('cityId')} required>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.nameTranslations?.en || city.name || city.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.cityId && <span className="error-message">{errors.cityId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude *</label>
              <input
                type="number"
                value={formData.latitude}
                onChange={handleInputChange('latitude')}
                step="any"
                className="simple-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Longitude *</label>
              <input
                type="number"
                value={formData.longitude}
                onChange={handleInputChange('longitude')}
                step="any"
                className="simple-input"
                required
              />
            </div>
          </div>

          <MapSelector
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={({ latitude: nextLat, longitude: nextLng }) => {
              setFormData((prev) => ({
                ...prev,
                latitude: nextLat,
                longitude: nextLng
              }));
            }}
            label="Tourist Spot Location"
          />

          <div className="form-group">
            <MultiImageSelector
              images={formData.images}
              onChange={handleImagesChange}
              label="Tourist Spot Images"
              maxImages={10}
              showPreview={true}
              allowReorder={true}
              showOwnerField={true}
              ownerLabel="Image Owner"
              subdirectory="tourist-spots"
              uploadToServer={true}
            />
          </div>

          <div className="form-group">
            <label>Entry Type *</label>
            <RadioGroup
              value={formData.entryType}
              onChange={handleInputChange('entryType')}
              row
            >
              <FormControlLabel value="free" control={<Radio />} label="Free Entry" />
              <FormControlLabel value="paid" control={<Radio />} label="Paid Entry" />
            </RadioGroup>
          </div>

          <div className="form-group">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleToggleChange('active')}
                  color="primary"
                  disabled={!isEditMode}
                />
              }
              label={`Active${!isEditMode ? ' (Auto-disabled hta t ajouter translations oghyt activa)' : ''}`}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Opening time *</label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={handleInputChange('openingTime')}
                className="simple-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Closing time *</label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={handleInputChange('closingTime')}
                className="simple-input"
                required
              />
            </div>
          </div>


          <div className="form-actions">
            <button type="button" onClick={handleBack} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSpots;
