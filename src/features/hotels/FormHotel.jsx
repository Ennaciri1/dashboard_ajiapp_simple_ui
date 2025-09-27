import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select, FormControlLabel, Switch } from '@mui/material';
import './FormHotel.css';
import { MapSelector, MultiImageSelector } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import { cityService } from '../../services/api/cityService';
import { hotelService } from '../../services/api/hotelService';
import { imageService } from '../../services/api/imageService';


// Form validation utility
const validateFormData = (data) => {
  const errors = {};
  
  if (!data.name.trim()) errors.name = 'Hotel name is required';
  if (!data.description.trim()) errors.description = 'Description is required';
  if (!data.cityId) errors.cityId = 'City is required';
  if (!data.minPrice || data.minPrice <= 0) {
    errors.minPrice = 'Minimum price must be a positive number';
  }
  if (!data.maxPrice || data.maxPrice <= 0) {
    errors.maxPrice = 'Maximum price must be a positive number';
  }
  if (data.minPrice && data.maxPrice && parseFloat(data.minPrice) > parseFloat(data.maxPrice)) {
    errors.maxPrice = 'Maximum price must be greater than minimum price';
  }
  if (!data.images || data.images.length === 0) {
    errors.images = 'At least one image is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form data formatting utility
const formatFormData = (data, isEditMode = false) => {
  const formattedData = {
    nameTranslations: { en: data.name.trim() },
    descriptionTranslations: { en: data.description.trim() },
    cityId: data.cityId,
    location: {
      latitude: parseFloat(data.latitude) || 0,
      longitude: parseFloat(data.longitude) || 0,
      valid: true
    },
    images: data.images
      ?.filter((image) => image.url && image.url.trim())
      ?.map((image) => ({
        url: image.url.trim(),
        owner: image.owner ? image.owner.trim() : ""
      })) || [],
    priceRange: {
      minPrice: parseFloat(data.minPrice) || 0,
      maxPrice: parseFloat(data.maxPrice) || 0,
      valid: true
    }
  };

  // Only include isActive field for updates (edit mode)
  if (isEditMode) {
    formattedData.isActive = Boolean(data.active);
  }
  
  // Log the formatted data for debugging
  console.log('Formatted data for API:', JSON.stringify(formattedData, null, 2));
  console.log('Is edit mode:', isEditMode);
  
  return formattedData;
};

const FormHotel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cityId: '',
    latitude: '',
    longitude: '',
    minPrice: '',
    maxPrice: '',
    images: [],
    active: false, // Default to false for new hotels
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Load cities from API
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await cityService.getAllCities();
        setCities(response.data || []);
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };
    loadCities();
  }, []);

  // Load hotel data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadHotel = async () => {
        try {
          setInitialLoading(true);
          const response = await hotelService.getHotelById(id);
          const hotel = response.data || response;
          setFormData({
            name: hotel.name || '',
            description: hotel.description || '',
            cityId: hotel.cityId || '',
            latitude: hotel.location?.latitude?.toString() || '',
            longitude: hotel.location?.longitude?.toString() || '',
            minPrice: hotel.priceRange?.minPrice?.toString() || '',
            maxPrice: hotel.priceRange?.maxPrice?.toString() || '',
            images: (hotel.images || []).map((image, index) => ({
              ...image,
              id: image.id || `existing-${index}`,
              name: image.name || `Image ${index + 1}`,
              url: image.url,
              owner: image.owner || ''
            })),
            active: Boolean(hotel.active !== undefined ? hotel.active : (hotel.isActive !== undefined ? hotel.isActive : false)),
          });
        } catch (error) {
          console.error('Error loading hotel:', error);
          showError('Error loading hotel data');
          navigate('/services/hotels');
        } finally {
          setInitialLoading(false);
        }
      };
      loadHotel();
    }
  }, [isEditMode, id, navigate, showError]);

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error when user starts typing
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

  // Function to upload images using imageService
  const uploadImages = async (images) => {
    const uploadedImages = [];
    
    for (const image of images) {
      if (image.file) {
        // New image file to upload
        try {
          const validation = imageService.validateImageFile(image.file);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          
          const response = await imageService.uploadImage(image.file, 'hotels');
          const imageUrl = imageService.getImageUrl(response);
          
          uploadedImages.push({
            url: imageUrl,
            owner: image.owner || ''
          });
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload image: ${error.message}`);
        }
      } else if (image.url) {
        // Existing image URL
        uploadedImages.push({
          url: image.url,
          owner: image.owner || ''
        });
      }
    }
    
    return uploadedImages;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const validation = validateFormData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      showError('Please fix the errors before submitting.');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload images first
      const uploadedImages = await uploadImages(formData.images);
      
      // Create hotel data with uploaded images
      const hotelData = {
        ...formData,
        images: uploadedImages
      };
      
      const formattedData = formatFormData(hotelData, isEditMode);
      console.log('Hotel form submitted:', formattedData);
      console.log('Form data before formatting:', hotelData);
      console.log('Active status before formatting:', hotelData.active, typeof hotelData.active);
      if (isEditMode) {
        console.log('Active status after formatting:', formattedData.isActive, typeof formattedData.isActive);
      }
      
      if (isEditMode) {
        await hotelService.updateHotel(id, formattedData);
        showSuccess('Hotel updated successfully!');
      } else {
        await hotelService.createHotel(formattedData);
        showSuccess('Hotel created successfully!');
      }
      navigate('/services/hotels');
    } catch (error) {
      console.error('Error creating hotel:', error);
      console.error('Error details:', error.payload);
      console.error('Error status:', error.status);
      console.error('Validation errors:', error.payload?.data);
      showError(`Error creating hotel: ${error.payload?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    navigate('/services/hotels');
  };

  if (initialLoading) {
    return (
      <div className="simple-form-container">
        <div className="form-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h1>Loading Hotel...</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading hotel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>{isEditMode ? 'Edit Hotel' : 'Add Hotel'}</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Hotel Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
              className={`simple-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              required
              rows={3}
              className={`simple-textarea ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>


          <div className="form-group">
            <FormControl fullWidth>
              <InputLabel>City *</InputLabel>
              <Select 
                value={formData.cityId} 
                label="City *" 
                onChange={handleInputChange('cityId')} 
                required
                className={errors.cityId ? 'error' : ''}
              >
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
              <label>Min Price ($) *</label>
              <input
                type="number"
                value={formData.minPrice}
                onChange={handleInputChange('minPrice')}
                min="0"
                step="0.01"
                className={`simple-input ${errors.minPrice ? 'error' : ''}`}
                required
              />
              {errors.minPrice && <span className="error-message">{errors.minPrice}</span>}
            </div>
            <div className="form-group">
              <label>Max Price ($) *</label>
              <input
                type="number"
                value={formData.maxPrice}
                onChange={handleInputChange('maxPrice')}
                min="0"
                step="0.01"
                className={`simple-input ${errors.maxPrice ? 'error' : ''}`}
                required
              />
              {errors.maxPrice && <span className="error-message">{errors.maxPrice}</span>}
            </div>
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
            label="Hotel Location"
          />

          <div className="form-group">
            <MultiImageSelector
              images={formData.images}
              onChange={handleImagesChange}
              label="Hotel Images *"
              maxImages={8}
              showPreview={true}
              allowReorder={true}
              showOwnerField={true}
              ownerLabel="Photographer/Source"
            />
            {errors.images && <span className="error-message">{errors.images}</span>}
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
          <div className="form-actions">
            <button type="button" onClick={handleBack} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={isUploading}>
              {isUploading ? (isEditMode ? 'Updating...' : 'Uploading Images...') : (isEditMode ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormHotel;
