import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { MultiImageSelector } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import { visaService } from '../../infrastructure/api/visaService';
import { imageService } from '../../infrastructure/api/imageService';
import { validateCreationTranslations, validateUpdateTranslations, validateActivationTranslations } from '../../shared/utils/translationValidator.js';
import { languageService } from '../../shared/services/languageService.js';
import { useTranslations } from '../../presentation/hooks/useTranslations.js';
import './FormVisa.css';

const FormVisa = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    country: '',
    nationality: '',
    isRequired: false,
    images: [],
    processingTime: ''
  });

  const [loading, setLoading] = useState(false);
  const { groupedTranslations } = useTranslations();

  // Load visa data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadVisa = async () => {
        try {
          setLoading(true);
          const response = await visaService.getVisaById(id);
          const visa = response.data || response;
          
          // Construire les images à partir de l'imageUrl
          const visaImages = visa.imageUrl ? [{
            id: Date.now(),
            url: visa.imageUrl,
            preview: visa.imageUrl
          }] : [];

          setFormData({
            country: visa.countryTranslations?.en || visa.country || '',
            nationality: visa.nationalityTranslations?.en || visa.nationality || '',
            isRequired: visa.isRequired || false,
            images: visaImages,
            processingTime: visa.processingTime || ''
          });
        } catch (error) {
          console.error('Error loading visa:', error);
          showError('Failed to load visa data');
        } finally {
          setLoading(false);
        }
      };
      loadVisa();
    }
  }, [id, isEditMode, showError]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      
      // Upload image if there's a new one
      let imageUrl = '';
      if (formData.images.length > 0) {
        const image = formData.images[0];
        if (image.file) {
          // New image to upload
          const response = await imageService.uploadImage(image.file, 'visas');
          imageUrl = imageService.getImageUrl(response);
        } else if (image.url) {
          // Existing image URL
          imageUrl = image.url;
        }
      }

      // Format data according to API requirements
      const visaData = {
        countryTranslations: {
          en: formData.country.trim()
        },
        nationalityTranslations: {
          en: formData.nationality.trim()
        },
        isRequired: formData.isRequired,
        imageUrl: imageUrl || ''
      };

      console.log('Visa data to submit:', visaData);

      if (isEditMode) {
        // Validate translations if updating
        const hasTranslationFields = Object.keys(visaData).some(key => key.includes('Translations'));
        if (hasTranslationFields) {
          const activeLanguages = await languageService.getActiveLanguages();
          const translationValidation = validateUpdateTranslations(visaData, activeLanguages);
          if (!translationValidation.isValid) {
            showError(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
            setLoading(false);
            return;
          }
        }

        // Note: Visa doesn't have isActive field in the form, but if it did, we'd validate activation here
        const updateResponse = await visaService.updateVisa(id, visaData);
        console.log('Update response:', updateResponse);
        showSuccess('Visa updated successfully!');
      } else {
        // Validate translations - only English allowed on creation
        const translationValidation = validateCreationTranslations(visaData);
        if (!translationValidation.isValid) {
          showError(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
          setLoading(false);
          return;
        }

        // Note: Visa doesn't have isActive field, but if API creates with isActive=false, it's handled by backend
        const addResponse = await visaService.addVisa(visaData);
        console.log('Add response:', addResponse);
        showSuccess('Visa added successfully!');
      }
      
      navigate('/services/visa');
    } catch (error) {
      console.error('Error saving visa:', error);
      showError(`Error saving visa: ${error.payload?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="simple-form-container">
        <div className="form-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h1>{isEditMode ? 'Edit Visa' : 'New Visa'}</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>{isEditMode ? 'Edit Visa' : 'New Visa'}</h1>
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
              label="Visa/Country Image (1 image)"
              maxImages={1}
              showPreview={true}
              allowReorder={false}
              uploadToServer={false}
            />
          </div>

          <div className="form-group">
            <FormControlLabel
              control={<Switch checked={formData.isRequired} onChange={handleToggle} color="primary" />}
              label="Is required"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleBack} className="cancel-btn" disabled={loading}>
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

export default FormVisa;
