import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';
import { contactService } from '../../infrastructure/api/contactService';
import { validateCreationTranslations, validateUpdateTranslations, validateActivationTranslations } from '../../shared/utils/translationValidator.js';
import { languageService } from '../../shared/services/languageService.js';
import { useTranslations } from '../../presentation/hooks/useTranslations.js';
import './FormContact.css';

const FormContact = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    link: '',
    icon: '',
    active: false // Default to false for new contacts, like hotels
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const { groupedTranslations } = useTranslations();

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleToggleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.checked });
  };

  // Load contact data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadContact = async () => {
        try {
          setInitialLoading(true);
          const response = await contactService.getContactById(id);
          const contact = response.data || response;
          setFormData({
            name: contact.name || (contact.nameTranslations && contact.nameTranslations.en) || '',
            link: contact.link || '',
            icon: contact.icon || '',
            active: Boolean(contact.active !== undefined ? contact.active : (contact.isActive !== undefined ? contact.isActive : false)),
          });
        } catch (error) {
          console.error('Error loading contact:', error);
          showError('Error loading contact data');
          navigate('/services/contact');
        } finally {
          setInitialLoading(false);
        }
      };
      loadContact();
    }
  }, [isEditMode, id, navigate, showError]);

  const handleBack = () => {
    navigate('/services/contact');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nameTranslations: { en: formData.name.trim() },
        link: formData.link.trim(),
        icon: formData.icon.trim()
      };

      if (isEditMode) {
        // Validate translations if updating
        const hasTranslationFields = Object.keys(payload).some(key => key.includes('Translations'));
        if (hasTranslationFields) {
          const activeLanguages = await languageService.getActiveLanguages();
          const translationValidation = validateUpdateTranslations(payload, activeLanguages);
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
            'contact',
            id,
            activeLanguages,
            ['name']
          );
          
          if (!activationValidation.isValid) {
            showError(`Cannot activate contact: ${activationValidation.errors.join(', ')}`);
            setLoading(false);
            return;
          }
        }

        payload.isActive = Boolean(formData.active);
        await contactService.updateContact(id, payload);
        showSuccess('Contact updated successfully!');
      } else {
        // Validate translations - only English allowed on creation
        const translationValidation = validateCreationTranslations(payload);
        if (!translationValidation.isValid) {
          showError(`Translation validation failed: ${translationValidation.errors.join(', ')}`);
          setLoading(false);
          return;
        }

        // Force isActive = false on creation (already set in formData, but ensure it)
        payload.isActive = false;
        await contactService.createContact(payload);
        showSuccess('Contact created successfully!');
      }
      
      // Redirect to contacts list
      navigate('/services/contact');
    } catch (error) {
      console.error('Error saving contact:', error);
      showError('Error saving contact');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="simple-form-container">
        <div className="form-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h1>Loading Contact...</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading contact data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>{isEditMode ? 'Edit Contact' : 'New Contact'}</h1>
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
              type="text"
              value={formData.link}
              onChange={handleInputChange('link')}
              placeholder="https://... ou tel:+212123456789 ou mailto:contact@example.com ou texte libre"
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
              placeholder="e.g. phone, email, map, etc."
              className="simple-input"
              required
            />
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
              label={`Active${!isEditMode ? ' (Disabled for new contacts)' : ''}`}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleBack} className="cancel-btn" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormContact;
