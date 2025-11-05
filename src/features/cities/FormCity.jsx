import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { cityService } from '../../infrastructure/api/cityService';
import { useNotification } from '../../contexts/NotificationContext';
import { TranslationEditor } from '../../components/common';
import { validateCreationTranslations, validateUpdateTranslations, validateActivationTranslations } from '../../shared/utils/translationValidator.js';
import { languageService } from '../../shared/services/languageService.js';
import { useTranslations } from '../../presentation/hooks/useTranslations.js';
import './FormCity.css';

const FormCity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    active: false // Default to false for new cities
  });

  const [loading, setLoading] = useState(false);
  const { groupedTranslations } = useTranslations();

  // Load city data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadCity = async () => {
        try {
          setLoading(true);
          const response = await cityService.getCityById(id);
          const city = response.data || response;
          
          setFormData({
            name: city.nameTranslations?.en || city.name || '',
            active: city.active !== undefined ? city.active : true
          });
        } catch (error) {
          console.error('Error loading city:', error);
          showError('Failed to load city data');
        } finally {
          setLoading(false);
        }
      };
      loadCity();
    }
  }, [id, isEditMode, showError]);

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
        nameTranslations: { en: formData.name.trim() }
      };

      if (isEditMode) {
        // Validate translations if updating
        const hasTranslationFields = Object.keys(formattedData).some(key => key.includes('Translations'));
        if (hasTranslationFields) {
          const activeLanguages = await languageService.getActiveLanguages();
          const translationValidation = validateUpdateTranslations(formattedData, activeLanguages);
          if (!translationValidation.isValid) {
            showError(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
            setLoading(false);
            return;
          }
        }

        // If trying to activate, validate all translations exist
        if (formData.active === true) {
          const activeLanguages = await languageService.getActiveLanguages();
          const activationValidation = validateActivationTranslations(
            groupedTranslations,
            'city',
            id,
            activeLanguages,
            ['name']
          );
          
          if (!activationValidation.isValid) {
            showError(`Cannot activate city: ${activationValidation.errors.join(', ')}`);
            setLoading(false);
            return;
          }
        }

        formattedData.active = formData.active;
        await cityService.updateCity(id, formattedData);
        showSuccess('City updated successfully!');
      } else {
        // Validate translations - only English allowed on creation
        const translationValidation = validateCreationTranslations(formattedData);
        if (!translationValidation.isValid) {
          showError(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
          setLoading(false);
          return;
        }

        // Force isActive = false on creation
        formattedData.active = false;
        await cityService.createCity(formattedData);
        showSuccess('City created successfully!');
      }
      
      navigate('/services/cities');
    } catch (error) {
      console.error('Error saving city:', error);
      const errorMessage = error.message || (isEditMode ? 'Error updating city' : 'Error creating city');
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>{isEditMode ? 'Edit City' : 'Add City'}</h1>
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

          {/* Translation Editor - Only show in edit mode when entity exists */}
          {isEditMode && id && (
            <div className="form-group">
              <TranslationEditor
                entityType="city"
                entityId={id}
                fieldName="name"
                label="City Name Translations"
                required={true}
                multiline={false}
              />
            </div>
          )}

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
