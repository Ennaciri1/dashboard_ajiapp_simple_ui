import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslations } from '../../presentation/hooks/useTranslations';
import { useLanguages } from '../../presentation/hooks/useLanguages';
import { useNotification } from '../../contexts/NotificationContext';
import './TranslationEditor.css';

/**
 * TranslationEditor Component
 * Displays and allows editing of translations for a specific entity field
 * 
 * @param {string} entityType - Type of entity (e.g., 'tourist_spot', 'city', 'hotel')
 * @param {string} entityId - ID of the entity
 * @param {string} fieldName - Name of the field (e.g., 'name', 'description', 'address')
 * @param {string} label - Label to display for the field
 * @param {boolean} required - Whether the field is required
 * @param {boolean} multiline - Whether to use multiline input
 * @param {number} rows - Number of rows for multiline input
 */
const TranslationEditor = ({
  entityType,
  entityId,
  fieldName,
  label,
  required = false,
  multiline = false,
  rows = 3
}) => {
  const { showSuccess, showError } = useNotification();
  const { languages, loading: languagesLoading } = useLanguages();
  const {
    getFieldTranslations,
    updateTranslation,
    loading: translationsLoading,
    error: translationsError
  } = useTranslations();

  const [fieldTranslations, setFieldTranslations] = useState({});
  const [localTranslations, setLocalTranslations] = useState({});
  const [saving, setSaving] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Get current translations for this field
  useEffect(() => {
    if (entityType && entityId && fieldName && languages.length > 0) {
      const translations = getFieldTranslations(entityType, entityId, fieldName, languages);
      setFieldTranslations(translations);
      setLocalTranslations(translations);
      setHasChanges(false);
    }
  }, [entityType, entityId, fieldName, getFieldTranslations, languages]);

  // Initialize local translations for all supported languages
  useEffect(() => {
    if (languages.length > 0) {
      const initialTranslations = { ...localTranslations };
      languages.forEach(lang => {
        if (!initialTranslations.hasOwnProperty(lang.code)) {
          initialTranslations[lang.code] = '';
        }
      });
      setLocalTranslations(initialTranslations);
    }
  }, [languages]);

  // Check if there are changes
  useEffect(() => {
    const changed = JSON.stringify(localTranslations) !== JSON.stringify(fieldTranslations);
    setHasChanges(changed);
  }, [localTranslations, fieldTranslations]);

  const handleTranslationChange = (languageCode, value) => {
    setLocalTranslations(prev => ({
      ...prev,
      [languageCode]: value
    }));
  };

  const handleSave = async () => {
    if (!entityType || !entityId || !fieldName) {
      showError('Missing required parameters for translation update');
      return;
    }

    setSaving(prev => ({ ...prev, [fieldName]: true }));

    try {
      await updateTranslation(entityType, entityId, fieldName, localTranslations);
      setFieldTranslations(localTranslations);
      setHasChanges(false);
      showSuccess(`Translation for ${label || fieldName} updated successfully`);
    } catch (error) {
      console.error('Error updating translation:', error);
      showError(error.message || 'Error updating translation');
    } finally {
      setSaving(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleCancel = () => {
    setLocalTranslations(fieldTranslations);
    setHasChanges(false);
  };

  if (languagesLoading || translationsLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (translationsError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {translationsError}
      </Alert>
    );
  }

  if (!languages || languages.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No supported languages found. Please add languages first.
      </Alert>
    );
  }

  return (
    <Card className="translation-editor-card">
      <CardContent>
        <Box className="translation-editor-header">
          <Typography variant="h6" className="translation-field-label">
            {label || fieldName}
            {required && <span className="required-indicator">*</span>}
          </Typography>
          {hasChanges && (
            <Box className="translation-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="translation-cancel-btn"
                disabled={saving[fieldName]}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="translation-save-btn"
                disabled={saving[fieldName]}
              >
                {saving[fieldName] ? 'Saving...' : 'Save Translations'}
              </button>
            </Box>
          )}
        </Box>

        <Grid container spacing={2} className="translation-inputs-grid">
          {languages.map(language => (
            <Grid item xs={12} sm={6} md={4} key={language.code}>
              <Box className="translation-input-wrapper">
                <InputLabel htmlFor={`${fieldName}-${language.code}`} className="translation-input-label">
                  {language.name} ({language.code.toUpperCase()})
                </InputLabel>
                <TextField
                  id={`${fieldName}-${language.code}`}
                  fullWidth
                  multiline={multiline}
                  rows={multiline ? rows : 1}
                  value={localTranslations[language.code] || ''}
                  onChange={(e) => handleTranslationChange(language.code, e.target.value)}
                  placeholder={`Enter ${label || fieldName} in ${language.name}`}
                  variant="outlined"
                  size="small"
                  className="translation-input"
                  disabled={saving[fieldName]}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TranslationEditor;

