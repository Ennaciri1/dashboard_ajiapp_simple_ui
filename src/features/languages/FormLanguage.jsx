import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { useLanguages } from '../../presentation/hooks/useLanguages';
import './FormLanguage.css';

const FormLanguage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { showSuccess, showError } = useNotification();
  const { createLanguage, updateLanguage, getLanguageById } = useLanguages();

  const [formData, setFormData] = useState({
    code: '',
    name: ''
  });

  const [loading, setLoading] = useState(false);

  // Load language data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadLanguage = async () => {
        try {
          setLoading(true);
          const language = await getLanguageById(id);
          
          if (language) {
            setFormData({
              code: language.code || '',
              name: language.name || ''
            });
          }
        } catch (error) {
          console.error('Error loading language:', error);
          showError('Failed to load language data');
        } finally {
          setLoading(false);
        }
      };
      loadLanguage();
    }
  }, [id, isEditMode, getLanguageById, showError]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Pour le code, convertir en majuscules et limiter à 2 caractères
    if (field === 'code') {
      setFormData({ ...formData, [field]: value.toUpperCase().slice(0, 2) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleBack = () => {
    navigate('/services/languages');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!formData.code.trim() || formData.code.trim().length !== 2) {
        showError('Language code must be exactly 2 characters');
        setLoading(false);
        return;
      }

      if (!formData.name.trim()) {
        showError('Please enter the language name');
        setLoading(false);
        return;
      }

      const formattedData = {
        code: formData.code.trim().toLowerCase(),
        name: formData.name.trim()
      };

      if (isEditMode) {
        await updateLanguage(id, formattedData);
        showSuccess('Language updated successfully!');
      } else {
        await createLanguage(formattedData);
        showSuccess('Language created successfully!');
      }
      
      navigate('/services/languages');
    } catch (error) {
      console.error('Error saving language:', error);
      showError(error.message || (isEditMode ? 'Error updating language' : 'Error creating language'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>{isEditMode ? 'Edit Language' : 'Add Language'}</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Language Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={handleInputChange('code')}
              placeholder="e.g., en, fr, es"
              className="simple-input"
              maxLength={2}
              required
              disabled={isEditMode}
            />
            <small className="form-hint">ISO 639-1 code (2 characters, e.g., en, fr, es)</small>
          </div>

          <div className="form-group">
            <label>Language Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="e.g., English, French, Spanish"
              className="simple-input"
              required
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

export default FormLanguage;

