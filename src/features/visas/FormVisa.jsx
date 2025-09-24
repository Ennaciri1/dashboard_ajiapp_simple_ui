import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { MultiImageSelector } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import './FormVisa.css';

const FormVisa = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    country: '',
    nationality: '',
    isRequired: false,
    images: [],
    processingTime: ''
  });

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleToggle = (event) => {
    setFormData({ ...formData, isRequired: event.target.checked });
  };

  const handleImagesChange = (images) => {
    setFormData({
      ...formData,
      images: images
    });
  };

  const handleBack = () => {
    navigate('/services/visa');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedData = {
      country: formData.country.trim(),
      nationality: formData.nationality.trim(),
      isRequired: formData.isRequired,
      images: formData.images,
      processingTime: formData.processingTime
    };

    console.log('Visa form submitted:', formattedData);
    showSuccess('Visa saved successfully!');
    navigate('/services/visa');
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>Visa</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              value={formData.country}
              onChange={handleInputChange('country')}
              placeholder="Country name"
              className="simple-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Nationality *</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={handleInputChange('nationality')}
              placeholder="Traveller nationality"
              className="simple-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Processing time *</label>
            <input
              type="text"
              value={formData.processingTime}
              onChange={handleInputChange('processingTime')}
              placeholder="E-visa within 5 days"
              className="simple-input"
              required
            />
          </div>

          <div className="form-group">
            <MultiImageSelector
              images={formData.images}
              onChange={handleImagesChange}
              label="Visa/Country Images"
              maxImages={5}
              showPreview={true}
              allowReorder={true}
            />
          </div>

          <div className="form-group">
            <FormControlLabel
              control={<Switch checked={formData.isRequired} onChange={handleToggle} color="primary" />}
              label="Is required"
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

export default FormVisa;
