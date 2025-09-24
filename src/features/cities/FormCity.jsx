import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import './FormCity.css';

const FormCity = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    active: true
  });

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleToggle = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.checked });
  };

  const handleBack = () => {
    navigate('/services/cities');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedData = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      location: {
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      },
      active: formData.active
    };

    console.log('City form submitted:', formattedData);
    alert('City saved successfully!');
    navigate('/services/cities');
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
            <label>City Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={handleInputChange('code')}
              placeholder="e.g. RAK"
              className="simple-input"
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="City name"
              className="simple-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={3}
              className="simple-textarea"
            />
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
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCity;
