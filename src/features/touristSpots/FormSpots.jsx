import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch
} from '@mui/material';
import { INTEREST_TYPES } from './index';
import { sampleCities, getCityName } from '../cities';
import './FormSpots.css';

const defaultCityId = sampleCities[0]?.id || '';

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

  if (data.rating < 0 || data.rating > 5) {
    errors.rating = 'Rating must be between 0 and 5';
  }

  if (data.interestTypes.length === 0) {
    errors.interestTypes = 'Select at least one interest type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const formatFormData = (data) => {
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    address: data.address.trim(),
    cityId: data.cityId,
    cityName: getCityName(sampleCities.find((city) => city.id === data.cityId)),
    location: {
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null
    },
    images: data.images.filter((image) => image.url || image.owner),
    isPaidEntry: data.isPaidEntry,
    entryFee: data.isPaidEntry ? data.entryFee : 'Free',
    openingTime: data.openingTime,
    closingTime: data.closingTime,
    active: data.active,
    rating: Number(data.rating) || 0,
    ratingCount: Number(data.ratingCount) || 0,
    likesCount: Number(data.likesCount) || 0,
    interestTypes: data.interestTypes
  };
};

const FormSpots = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    cityId: defaultCityId,
    latitude: '',
    longitude: '',
    images: [{ url: '', owner: '' }],
    isPaidEntry: false,
    entryFee: '',
    openingTime: '09:00',
    closingTime: '18:00',
    active: true,
    rating: 0,
    ratingCount: '',
    likesCount: '',
    interestTypes: []
  });

  const [newInterestType, setNewInterestType] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleToggleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.checked });
  };

  const handleInterestTypeAdd = () => {
    if (newInterestType && !formData.interestTypes.includes(newInterestType)) {
      setFormData({
        ...formData,
        interestTypes: [...formData.interestTypes, newInterestType]
      });
      setNewInterestType('');
      if (errors.interestTypes) {
        setErrors({ ...errors, interestTypes: '' });
      }
    }
  };

  const handleInterestTypeRemove = (typeToRemove) => {
    setFormData({
      ...formData,
      interestTypes: formData.interestTypes.filter((type) => type !== typeToRemove)
    });
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = formData.images.map((image, imageIndex) =>
      imageIndex === index ? { ...image, [field]: value } : image
    );
    setFormData({ ...formData, images: updatedImages });
  };

  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', owner: '' }]
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, imageIndex) => imageIndex !== index)
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      alert('Please fix the errors before submitting.');
      return;
    }

    const formattedData = formatFormData(formData);
    console.log('Tourist spot form submitted:', formattedData);
    alert('Tourist spot saved!');
    navigate('/services/tourist-spots');
  };

  const handleBack = () => {
    navigate('/services/tourist-spots');
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>Add Tourist Spot</h1>
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
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={handleInputChange('address')}
              className="simple-input"
            />
          </div>

          <div className="form-group">
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select value={formData.cityId} label="City" onChange={handleInputChange('cityId')}>
                {sampleCities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {getCityName(city)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.cityId && <span className="error-message">{errors.cityId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                value={formData.latitude}
                onChange={handleInputChange('latitude')}
                step="any"
                className="simple-input"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                value={formData.longitude}
                onChange={handleInputChange('longitude')}
                step="any"
                className="simple-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Images</label>
            <div className="types-display">
              {formData.images.map((image, index) => (
                <div key={index} className="image-entry">
                  <input
                    type="url"
                    value={image.url}
                    onChange={(event) => handleImageChange(index, 'url', event.target.value)}
                    placeholder="Image URL"
                    className="simple-input"
                  />
                  <input
                    type="text"
                    value={image.owner}
                    onChange={(event) => handleImageChange(index, 'owner', event.target.value)}
                    placeholder="Owner"
                    className="simple-input"
                  />
                  <button type="button" className="remove-btn" onClick={() => handleRemoveImage(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="add-btn" onClick={handleAddImage}>
              Add image
            </button>
          </div>

          <div className="form-group">
            <FormControlLabel
              control={<Switch checked={formData.isPaidEntry} onChange={handleToggleChange('isPaidEntry')} color="primary" />}
              label="Is paid entry"
            />
          </div>

          {formData.isPaidEntry && (
            <div className="form-group">
              <label>Entry fee</label>
              <input
                type="text"
                value={formData.entryFee}
                onChange={handleInputChange('entryFee')}
                placeholder="e.g. MAD 120"
                className="simple-input"
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Opening time</label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={handleInputChange('openingTime')}
                className="simple-input"
              />
            </div>
            <div className="form-group">
              <label>Closing time</label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={handleInputChange('closingTime')}
                className="simple-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating</label>
              <input
                type="number"
                value={formData.rating}
                onChange={handleInputChange('rating')}
                min="0"
                max="5"
                step="0.1"
                className="simple-input"
              />
              {errors.rating && <span className="error-message">{errors.rating}</span>}
            </div>
            <div className="form-group">
              <label>Rating count</label>
              <input
                type="number"
                value={formData.ratingCount}
                onChange={handleInputChange('ratingCount')}
                min="0"
                className="simple-input"
              />
            </div>
            <div className="form-group">
              <label>Likes count</label>
              <input
                type="number"
                value={formData.likesCount}
                onChange={handleInputChange('likesCount')}
                min="0"
                className="simple-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Interest types</label>
            <div className="types-display">
              {formData.interestTypes.map((type, index) => (
                <span key={index} className="type-tag">
                  {type}
                  <button type="button" onClick={() => handleInterestTypeRemove(type)}>×</button>
                </span>
              ))}
            </div>
            <div className="add-type">
              <select
                value={newInterestType}
                onChange={(event) => setNewInterestType(event.target.value)}
                className="simple-select"
              >
                <option value="">Choose a type</option>
                {INTEREST_TYPES.filter((option) => !formData.interestTypes.includes(option)).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleInterestTypeAdd} disabled={!newInterestType} className="add-btn">
                Add
              </button>
            </div>
            {errors.interestTypes && <span className="error-message">{errors.interestTypes}</span>}
          </div>

          <div className="form-group">
            <FormControlLabel
              control={<Switch checked={formData.active} onChange={handleToggleChange('active')} color="primary" />}
              label="Active"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleBack} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSpots;
