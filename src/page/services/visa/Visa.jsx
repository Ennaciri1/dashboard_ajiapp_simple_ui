import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import VisasTable from '../../../features/visas/VisasTable';
import {
  filterVisas,
  VISA_FILTER_DEFAULTS,
  VISA_FILTERS
} from '../../../features/visas';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { useLanguages } from '../../../presentation/hooks/useLanguages';
import { visaService } from '../../../infrastructure/api/visaService';
import './Visa.css';

const Visa = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const { languages } = useLanguages();
  const [visas, setVisas] = useState([]);
  const [selectedVisas, setSelectedVisas] = useState([]);
  const [filters, setFilters] = useState(VISA_FILTER_DEFAULTS);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisaId, setSelectedVisaId] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredVisas = useMemo(() => filterVisas(visas, filters), [visas, filters]);

  // Load visas from API - reload when returning to this page or when language changes
  useEffect(() => {
    loadVisas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, selectedLanguage]); // Recharge quand le chemin change ou la langue change

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
  };

  const loadVisas = async () => {
    try {
      setLoading(true);
      // Ajouter le header Accept-Language
      const response = await visaService.getAllVisas(selectedLanguage);
      console.log('Visas API Response:', response);
      console.log('Visas data:', response.data);
      
      // Gérer différents formats de réponse API
      // Format possible: { code, message, data: [...], error }
      let visasData = [];
      
      if (response.data) {
        // Format API: { code, message, data: [...], error }
        if (response.data.data && Array.isArray(response.data.data)) {
          visasData = response.data.data;
        } else if (Array.isArray(response.data)) {
          visasData = response.data;
        }
      } else if (Array.isArray(response)) {
        visasData = response;
      }
      
      console.log('Setting visas:', visasData);
      console.log('Number of visas:', visasData.length);
      
      // Warning si le backend retourne un tableau vide après création
      if (visasData.length === 0) {
        console.warn('⚠️ PROBLÈME BACKEND: Le GET retourne un tableau vide!');
        console.warn('Vérifiez que l\'endpoint GET récupère bien les données de la base.');
        console.warn('Vérifiez que le header Accept-Language est bien traité côté backend.');
      }
      
      setVisas(visasData);
    } catch (error) {
      console.error('Error loading visas:', error);
      showError('Error loading visas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisa = () => {
    navigate('/services/visa/formVisa');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedVisas(filteredVisas.map((visa) => visa.id));
    } else {
      setSelectedVisas([]);
    }
  };

  const handleSelectVisa = (visaId) => {
    setSelectedVisas((prev) =>
      prev.includes(visaId) ? prev.filter((id) => id !== visaId) : [...prev, visaId]
    );
  };

  const handleMenuClick = (event, visaId) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisaId(visaId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVisaId(null);
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = VISA_FILTERS.map((filter) => ({
    ...filter,
    value: filters[filter.key],
    onChange: handleFilterChange(filter.key)
  }));

  const handleEditVisa = () => {
    if (selectedVisaId) {
      navigate(`/services/visa/edit/${selectedVisaId}`);
      handleMenuClose();
    }
  };

  const handleDeleteVisa = async () => {
    if (selectedVisaId) {
      try {
        await visaService.deleteVisa(selectedVisaId);
        showSuccess('Visa deleted successfully!');
        loadVisas(); // Reload the list
        handleMenuClose();
      } catch (error) {
        console.error('Error deleting visa:', error);
        showError('Error deleting visa');
      }
    }
  };

  const actionItems = [
    {
      key: 'view',
      label: 'View Details',
      onClick: () => showSuccess(`Viewing visa ${selectedVisaId}`)
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: handleEditVisa
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: handleDeleteVisa
    }
  ];

  const handleDeleteAllVisas = async () => {
    if (selectedVisas.length === 0) {
      showError('Please select visas to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedVisas.length} selected visa(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Delete each selected visa
      await Promise.all(selectedVisas.map(id => visaService.deleteVisa(id)));
      
      // Reload the list
      loadVisas();
      setSelectedVisas([]);
      
      showSuccess(`${selectedVisas.length} visa(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting visas:', error);
      showError('Error deleting visas');
    }
  };

  if (loading) {
    return (
      <div className="global-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="global-container">
      <FilterToolbar
        title="Visa Requirements"
        search={{
          placeholder: 'Search countries or nationalities...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add Visa',
          onClick: handleAddVisa
        }}
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllVisas,
            disabled: selectedVisas.length === 0,
            color: 'error'
          }
        ]}
      />

      {/* Language Selector */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={selectedLanguage}
            label="Language"
            onChange={handleLanguageChange}
          >
            {languages && languages.length > 0 ? (
              languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code.toUpperCase()})
                </MenuItem>
              ))
            ) : (
              <MenuItem value="en">English (EN)</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredVisas.length} visa{filteredVisas.length === 1 ? '' : 's'} found
          {filteredVisas.length !== visas.length && ` out of ${visas.length} total`}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <VisasTable
            visas={filteredVisas}
            selectedVisas={selectedVisas}
            onSelectAll={handleSelectAll}
            onSelectVisa={handleSelectVisa}
            onMenuClick={handleMenuClick}
          />
        </CardContent>
      </Card>

      <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} items={actionItems} />
    </div>
  );
};

export default Visa;
