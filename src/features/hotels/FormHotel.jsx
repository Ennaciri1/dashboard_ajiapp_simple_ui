import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormHotel.css';

const HOTEL_AMENITIES = [
  'Pool',
  'Spa',
  'Restaurant',
  'Gym',
  'WiFi',
  'Business Center',
  'Airport Shuttle',
  'Mountain View',
  'Beach',
  'Water Sports',
  'Traditional',
  'Cultural Tours',
  'Breakfast',
  'Hiking'
];

// Form validation utility
const validateFormData = (data) => {
  const errors = {};
  
  if (!data.name.trim()) errors.name = 'Hotel name is required';
  if (!data.description.trim()) errors.description = 'Description is required';
  if (!data.bookingInfo.trim()) errors.bookingInfo = 'Booking information is required';
  if (!data.location.trim()) errors.location = 'Location is required';
  if (!data.pricePerNight || data.pricePerNight <= 0) {
    errors.pricePerNight = 'Price per night must be a positive number';
  }
  if (data.amenities.length === 0) {
    errors.amenities = 'At least one amenity is required';
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
    pricePerNight: parseFloat(data.pricePerNight),
    rating: parseFloat(data.rating) || 0,
    ratingCount: parseInt(data.ratingCount) || 0,
    coordinates: {
      lat: parseFloat(data.latitude) || null,
      lng: parseFloat(data.longitude) || null
    }
  };
};

const FormHotel = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bookingInfo: '',
    location: '',
    latitude: '',
    longitude: '',
    pricePerNight: '',
    image: '',
    amenities: [],
  
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleAmenityAdd = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity]
      });
      setNewAmenity('');
    }
  };

  const handleAmenityRemove = (amenityToRemove) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(amenity => amenity !== amenityToRemove)
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
    console.log('Hotel form submitted:', formattedData);
    alert('Hotel saved successfully!');
    navigate('/services/hotels');
  };

  const handleBack = () => {
    navigate('/services/hotels');
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>Add Hotel</h1>
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
            <label>Booking Information *</label>
            <textarea
              value={formData.bookingInfo}
              onChange={handleInputChange('bookingInfo')}
              required
              rows={2}
              className={`simple-textarea ${errors.bookingInfo ? 'error' : ''}`}
            />
            {errors.bookingInfo && <span className="error-message">{errors.bookingInfo}</span>}
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={handleInputChange('location')}
              required
              className={`simple-input ${errors.location ? 'error' : ''}`}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price per Night ($) *</label>
              <input
                type="number"
                value={formData.pricePerNight}
                onChange={handleInputChange('pricePerNight')}
                min="0"
                step="0.01"
                className={`simple-input ${errors.pricePerNight ? 'error' : ''}`}
              />
              {errors.pricePerNight && <span className="error-message">{errors.pricePerNight}</span>}
            </div>

            
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="types-display">
              {formData.amenities.map((amenity, index) => (
                <span key={index} className="type-tag">
                  {amenity} <button type="button" onClick={() => handleAmenityRemove(amenity)}>×</button>
                </span>
              ))}
            </div>
            <div className="add-type">
              <select
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="simple-select"
              >
                <option value="">Choose an amenity</option>
                {HOTEL_AMENITIES
                  .filter(option => !formData.amenities.includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAmenityAdd}
                disabled={!newAmenity}
                className="add-btn"
              >
                Add
              </button>
            </div>
            {errors.amenities && <span className="error-message">{errors.amenities}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude (Optional)</label>
              <input
                type="number"
                value={formData.latitude}
                onChange={handleInputChange('latitude')}
                step="any"
                className="simple-input"
              />
            </div>

            <div className="form-group">
              <label>Longitude (Optional)</label>
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
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={handleInputChange('image')}
              placeholder="https://example.com/hotel-image.jpg"
              className="simple-input"
            />
          </div>

          {formData.image && (
            <div className="form-group">
              <label>Image Preview</label>
              <div className="image-preview">
                <img
                  src={formData.image}
                  alt="Hotel preview"
                  className="preview-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

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

export default FormHotel;
