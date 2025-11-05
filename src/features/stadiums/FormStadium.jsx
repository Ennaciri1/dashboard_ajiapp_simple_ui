import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch
} from '@mui/material';
import './FormStadium.css';
import { MapSelector, MultiImageSelector } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import { cityService } from '../../infrastructure/api/cityService';
import { useStadiums } from '../../presentation/hooks/useStadiums';
import { imageService } from '../../infrastructure/api/imageService';

// Form validation utility
const validateFormData = (data) => {
  const errors = {};
  
  if (!data.name.trim()) errors.name = 'Stadium name is required';
  if (!data.description.trim()) errors.description = 'Description is required';
  if (!data.cityId) errors.cityId = 'City is required';
  if (!data.capacity || data.capacity <= 0) {
    errors.capacity = 'Capacity must be a positive number';
  }
  if (!data.inauguration) {
    errors.inauguration = 'Inauguration date is required';
  } else {
    const inaugurationDate = new Date(data.inauguration);
    if (isNaN(inaugurationDate.getTime())) {
      errors.inauguration = 'Invalid inauguration date';
    } else if (inaugurationDate > new Date()) {
      errors.inauguration = 'Inauguration date cannot be in the future';
    }
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
    capacity: parseInt(data.capacity) || 0,
    inauguration: data.inauguration,
    homeGround: data.homeGround ? data.homeGround.trim() : ""
  };

  // Only include active field for updates (edit mode)
  if (isEditMode) {
    formattedData.active = Boolean(data.active);
  }
  
  // Log the formatted data for debugging
  console.log('Formatted data for API:', JSON.stringify(formattedData, null, 2));
  console.log('Is edit mode:', isEditMode);
  
  return formattedData;
};

const FormStadium = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  const { createStadium, updateStadium, getStadiumById } = useStadiums();
  
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cityId: '',
    latitude: '',
    longitude: '',
    capacity: '',
    inauguration: '',
    homeGround: '',
    images: [],
    active: false, // Default to false for new stadiums
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

  // Load stadium data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadStadium = async () => {
        try {
          setInitialLoading(true);
          const stadiumEntity = await getStadiumById(id);
          
          if (stadiumEntity) {
            // Récupérer les détails complets depuis l'API pour cityId et location
            const { StadiumRepository } = await import('../../infrastructure/api/StadiumRepository.js');
            const repository = new StadiumRepository();
            const stadiumData = await repository.findById(id);
            
          setFormData({
              name: stadiumEntity.name || '',
              description: stadiumEntity.description || '',
              cityId: stadiumData?.cityId || '',
              latitude: stadiumData?.location?.latitude?.toString() || '',
              longitude: stadiumData?.location?.longitude?.toString() || '',
              capacity: stadiumEntity.capacity?.toString() || '',
              inauguration: stadiumEntity.inauguration || '',
              homeGround: stadiumEntity.homeGround || '',
              images: (stadiumEntity.images || []).map((image, index) => ({
              ...image,
              id: image.id || `existing-${index}`,
              name: image.name || `Image ${index + 1}`,
                url: typeof image === 'string' ? image : image.url,
              owner: image.owner || ''
            })),
              active: stadiumEntity.status === 'active',
          });
          }
        } catch (error) {
          console.error('Error loading stadium:', error);
          showError('Error loading stadium data');
          navigate('/services/stadiums');
        } finally {
          setInitialLoading(false);
        }
      };
      loadStadium();
    }
  }, [isEditMode, id, navigate, showError, getStadiumById]);

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
          
          const response = await imageService.uploadImage(image.file, 'stadiums');
          console.log('Full upload response:', JSON.stringify(response, null, 2));
          console.log('Response data:', response?.data);
          const imageUrl = imageService.getImageUrl(response);
          console.log('Extracted imageUrl:', imageUrl);
          
          if (!imageUrl) {
            console.error('Failed to extract URL from response:', response);
            console.error('Response structure:', {
              hasData: !!response?.data,
              dataKeys: response?.data ? Object.keys(response.data) : [],
              fullData: response?.data
            });
            throw new Error('Failed to extract image URL from server response');
          }
          
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
      console.log('Uploaded images result:', uploadedImages);
      
      // Create stadium data with uploaded images
      const stadiumData = {
        ...formData,
        images: uploadedImages
      };
      console.log('Stadium data with images:', stadiumData);
      
      const formattedData = formatFormData(stadiumData, isEditMode);
      console.log('Stadium form submitted:', formattedData);
      console.log('Form data before formatting:', stadiumData);
      console.log('Active status before formatting:', stadiumData.active, typeof stadiumData.active);
      if (isEditMode) {
        console.log('Active status after formatting:', formattedData.active, typeof formattedData.active);
      }
      
      if (isEditMode) {
        await updateStadium(id, formattedData);
        showSuccess('Stadium updated successfully!');
      } else {
        await createStadium(formattedData);
        showSuccess('Stadium created successfully!');
      }
      navigate('/services/stadiums');
    } catch (error) {
      console.error('Error creating stadium:', error);
      console.error('Error details:', error.payload);
      console.error('Error status:', error.status);
      console.error('Validation errors:', error.payload?.data);
      showError(`Error creating stadium: ${error.payload?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    navigate('/services/stadiums');
  };

  if (initialLoading) {
    return (
      <div className="simple-form-container">
        <div className="form-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h1>Loading Stadium...</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading stadium data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>{isEditMode ? 'Edit Stadium' : 'Add Stadium'}</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Stadium Name *</label>
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
              <label>Capacity *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={handleInputChange('capacity')}
                min="1"
                className={`simple-input ${errors.capacity ? 'error' : ''}`}
                required
              />
              {errors.capacity && <span className="error-message">{errors.capacity}</span>}
            </div>
            <div className="form-group">
              <label>Inauguration Date *</label>
              <input
                type="date"
                value={formData.inauguration}
                onChange={handleInputChange('inauguration')}
                max={new Date().toISOString().split('T')[0]}
                className={`simple-input ${errors.inauguration ? 'error' : ''}`}
                required
              />
              {errors.inauguration && <span className="error-message">{errors.inauguration}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Home Ground</label>
            <input
              type="text"
              value={formData.homeGround}
              onChange={handleInputChange('homeGround')}
              className="simple-input"
              placeholder="e.g., Manchester United FC"
            />
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
            label="Stadium Location"
          />

          <div className="form-group">
            <MultiImageSelector
              images={formData.images}
              onChange={handleImagesChange}
              label="Stadium Images *"
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
              label={`Active${!isEditMode ? ' (Auto-disabled for new stadiums)' : ''}`}
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

export default FormStadium;

