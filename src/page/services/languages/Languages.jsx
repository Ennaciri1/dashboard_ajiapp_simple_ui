import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import LanguagesTable from '../../../features/languages/LanguagesTable';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { useLanguages } from '../../../presentation/hooks/useLanguages';
import './Languages.css';

const Languages = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { languages: languagesEntities, loading, error, deleteLanguage, refresh } = useLanguages();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [filters, setFilters] = useState({
    search: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguageId, setSelectedLanguageId] = useState(null);

  // Convertir les entités Language en format plat pour le filtrage
  const languages = useMemo(() => {
    return languagesEntities.map(language => ({
      id: language.id,
      code: language.code,
      name: language.name,
      createdAt: language.createdAt,
      updatedAt: language.updatedAt,
      createdBy: language.createdBy,
      updatedBy: language.updatedBy
    }));
  }, [languagesEntities]);

  // Filtrer les langues selon le terme de recherche
  const filteredLanguages = useMemo(() => {
    if (!filters.search) {
      return languages;
    }
    const searchLower = filters.search.toLowerCase();
    return languages.filter(lang => 
      lang.code.toLowerCase().includes(searchLower) ||
      lang.name.toLowerCase().includes(searchLower)
    );
  }, [languages, filters.search]);

  const handleAddLanguage = () => {
    navigate('/services/languages/formLanguage');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedLanguages(filteredLanguages.map((language) => language.id));
    } else {
      setSelectedLanguages([]);
    }
  };

  const handleSelectLanguage = (languageId) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleMenuClick = (event, languageId) => {
    setAnchorEl(event.currentTarget);
    setSelectedLanguageId(languageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLanguageId(null);
  };

  const handleEditLanguage = () => {
    if (selectedLanguageId) {
      navigate(`/services/languages/edit/${selectedLanguageId}`);
      handleMenuClose();
    }
  };

  const handleDeleteLanguage = async () => {
    if (!selectedLanguageId) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete this language? This action cannot be undone.'
    );
    if (!confirmed) {
      handleMenuClose();
      return;
    }

    try {
      await deleteLanguage(selectedLanguageId);
      setSelectedLanguages(prev => prev.filter(id => id !== selectedLanguageId));
      showSuccess('Language deleted successfully');
      handleMenuClose();
      // Recharger les données après suppression
      refresh();
    } catch (error) {
      console.error('Error deleting language:', error);
      showError(error.message || 'Error deleting language');
      handleMenuClose();
    }
  };

  const actionItems = [
    {
      key: 'edit',
      label: 'Edit',
      onClick: handleEditLanguage
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: handleDeleteLanguage
    }
  ];

  const handleDeleteAllLanguages = async () => {
    if (selectedLanguages.length === 0) {
      showError('Please select languages to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedLanguages.length} selected languages? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await Promise.all(selectedLanguages.map(languageId => deleteLanguage(languageId)));
      setSelectedLanguages([]);
      showSuccess(`${selectedLanguages.length} languages deleted successfully`);
      // Recharger les données après suppression
      refresh();
    } catch (error) {
      console.error('Error deleting languages:', error);
      showError('Error deleting languages');
    }
  };

  if (loading) {
    return (
      <div className="global-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="global-container">
      <FilterToolbar
        title="Languages Management"
        search={{
          placeholder: 'Search languages...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        primaryAction={{
          label: 'Add Language',
          onClick: handleAddLanguage
        }}
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllLanguages,
            disabled: selectedLanguages.length === 0,
            color: 'error'
          }
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} found
          {filteredLanguages.length !== languages.length && ` out of ${languages.length} total`}
        </Typography>
      </Box>

      <Card className="languages-card">
        <CardContent>
          <LanguagesTable
            languages={filteredLanguages}
            selectedLanguages={selectedLanguages}
            onSelectAll={handleSelectAll}
            onSelectLanguage={handleSelectLanguage}
            onMenuClick={handleMenuClick}
          />
        </CardContent>
      </Card>

      <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} items={actionItems} />
    </div>
  );
};

export default Languages;

