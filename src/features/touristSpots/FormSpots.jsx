import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INTEREST_TYPES } from './index.js';
import './FormSpots.css';

// Form validation utility
const validateFormData = (data) => {
  const errors = {};
  
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.city.trim()) errors.city = 'City is required';
  if (!data.description.trim()) errors.description = 'Description is required';
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  if (!data.entryFee || data.entryFee < 0) {
    errors.entryFee = 'Entry fee must be a positive number';
  }
  if (data.interestTypes.length === 0) {
    errors.interestTypes = 'At least one interest type is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form data formatting utility
const formatFormData = (data) => {
  return {
    ...data,
    rating: parseFloat(data.rating),
    ratingCount: parseInt(data.ratingCount) || 0,
    likesCount: parseInt(data.likesCount) || 0,
    entryFee: parseFloat(data.entryFee),
    latitude: parseFloat(data.latitude) || null,
    longitude: parseFloat(data.longitude) || null
  };
};

const FormSpots = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    description: '',
    history: '',
    rating: '',
    ratingCount: '',
    likesCount: '',
    interestTypes: [],
    entryFee: '',
    openingHours: '',
    latitude: '',
    longitude: '',
    image: ''
  });

  const [newInterestType, setNewInterestType] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleInterestTypeAdd = () => {
    if (newInterestType && !formData.interestTypes.includes(newInterestType)) {
      setFormData({
        ...formData,
        interestTypes: [...formData.interestTypes, newInterestType]
      });
      setNewInterestType('');
    }
  };

  const handleInterestTypeRemove = (typeToRemove) => {
    setFormData({
      ...formData,
      interestTypes: formData.interestTypes.filter(type => type !== typeToRemove)
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
    console.log('Form submitted:', formattedData);
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
        <h1>Add Spot</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Spot Name *</label>
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
            <label>City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={handleInputChange('city')}
              required
              className={`simple-input ${errors.city ? 'error' : ''}`}
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
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
            <label>History</label>
            <textarea
              value={formData.history}
              onChange={handleInputChange('history')}
              rows={4}
              className="simple-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input
                type="number"
                value={formData.rating}
                onChange={handleInputChange('rating')}
                min="0"
                max="5"
                step="0.1"
                className={`simple-input ${errors.rating ? 'error' : ''}`}
              />
              {errors.rating && <span className="error-message">{errors.rating}</span>}
            </div>

            <div className="form-group">
              <label>Number of Ratings</label>
              <input
                type="number"
                value={formData.ratingCount}
                onChange={handleInputChange('ratingCount')}
                min="0"
                className="simple-input"
              />
            </div>

            <div className="form-group">
              <label>Number of Likes</label>
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
            <label>Interest Types</label>
            <div className="types-display">
              {formData.interestTypes.map((type, index) => (
                <span key={index} className="type-tag">
                  {type} <button type="button" onClick={() => handleInterestTypeRemove(type)}>×</button>
                </span>
              ))}
            </div>
            <div className="add-type">
              <select
                value={newInterestType}
                onChange={(e) => setNewInterestType(e.target.value)}
                className="simple-select"
              >
                <option value="">Choose a type</option>
                {INTEREST_TYPES
                  .filter(option => !formData.interestTypes.includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleInterestTypeAdd}
                disabled={!newInterestType}
                className="add-btn"
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entry Fee</label>
              <input
                type="text"
                value={formData.entryFee}
                onChange={handleInputChange('entryFee')}
                placeholder="ex: €29, Free, $15"
                className="simple-input"
              />
            </div>

            <div className="form-group">
              <label>Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={handleInputChange('openingHours')}
                placeholder="ex: 9:00-18:00, 24/7"
                className="simple-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                value={formData.latitude}
                onChange={handleInputChange('latitude')}
                step="any"
                className={`simple-input ${errors.latitude ? 'error' : ''}`}
              />
              {errors.latitude && <span className="error-message">{errors.latitude}</span>}
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                value={formData.longitude}
                onChange={handleInputChange('longitude')}
                step="any"
                className={`simple-input ${errors.longitude ? 'error' : ''}`}
              />
              {errors.longitude && <span className="error-message">{errors.longitude}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={handleInputChange('image')}
              placeholder="https://example.com/image.jpg"
              className="simple-input"
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
