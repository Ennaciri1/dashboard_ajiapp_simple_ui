import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { cityService } from '../../services/api/cityService';
import { useNotification } from '../../contexts/NotificationContext';
import './FormCity.css';

const FormCity = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    active: true
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleToggle = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.checked });
  };

  const handleBack = () => {
    navigate('/services/cities');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        showError('Please enter the city name');
        setLoading(false);
        return;
      }

      const formattedData = {
        nameTranslations: { en: formData.name.trim() },
        active: formData.active
      };

      await cityService.createCity(formattedData);
      showSuccess('City created successfully!');
      navigate('/services/cities');
    } catch (error) {
      console.error('Error creating city:', error);
      showError('Error creating city');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>Add City</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>City Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="City name"
              className="simple-input"
              required
            />
          </div>



          <div className="form-group">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleToggle('active')}
                  color="primary"
                />
              }
              label="Active"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleBack} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCity;
