import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select, FormControlLabel, Switch } from '@mui/material';
import { CONTACT_CATEGORY_OPTIONS } from './index';
import { useNotification } from '../../contexts/NotificationContext';
import './FormContact.css';

const FormContact = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    link: '',
    icon: '',
    category: CONTACT_CATEGORY_OPTIONS[1]?.value || '',
    active: true
  });

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleToggle = (event) => {
    setFormData({ ...formData, active: event.target.checked });
  };

  const handleBack = () => {
    navigate('/services/contact');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedData = {
      name: formData.name.trim(),
      link: formData.link,
      icon: formData.icon,
      category: formData.category,
      active: formData.active
    };

    console.log('Contact form submitted:', formattedData);
    showSuccess('Contact saved successfully!');
    navigate('/services/contact');
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>Contact</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Contact name"
              className="simple-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Link *</label>
            <input
              type="url"
              value={formData.link}
              onChange={handleInputChange('link')}
              placeholder="https://..."
              className="simple-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Icon *</label>
            <input
              type="text"
              value={formData.icon}
              onChange={handleInputChange('icon')}
              placeholder="e.g. phone"
              className="simple-input"
              required
            />
          </div>

          <div className="form-group">
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select value={formData.category} label="Category *" onChange={handleInputChange('category')} required>
                {CONTACT_CATEGORY_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="form-group">
            <FormControlLabel
              control={<Switch checked={formData.active} onChange={handleToggle} color="primary" />}
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

export default FormContact;
