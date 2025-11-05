import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import CitiesTable from '../../../features/cities/CitiesTable';
import {
  filterCities,
  CITY_FILTER_OPTIONS,
  CITY_STATUS_FILTERS
} from '../../../features/cities';
import { cityService } from '../../../infrastructure/api/cityService';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import './Cities.css';

const Cities = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: CITY_STATUS_FILTERS.ALL
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);

  const filteredCities = useMemo(() => filterCities(cities, filters), [cities, filters]);

  // Charger les villes depuis l'API
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await cityService.getAllCities();
        setCities(response.data || []);
      } catch (err) {
        console.error('Error loading cities:', err);
        setError('Error loading cities');
        // En cas d'erreur, utiliser les données d'exemple
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleAddCity = () => {
    navigate('/services/cities/formCity');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCities(filteredCities.map((city) => city.id));
    } else {
      setSelectedCities([]);
    }
  };

  const handleSelectCity = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = [
    {
      key: 'status',
      label: 'Status',
      options: CITY_FILTER_OPTIONS,
      value: filters.status,
      onChange: handleFilterChange('status')
    }
  ];

  const handleMenuClick = (event, cityId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCityId(cityId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCityId(null);
  };

  const handleEditCity = () => {
    if (selectedCityId) {
      navigate(`/services/cities/edit/${selectedCityId}`);
      handleMenuClose();
    }
  };

  const handleDeleteCity = async () => {
    if (!selectedCityId) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this city?');
    if (!confirmed) {
      handleMenuClose();
      return;
    }

    try {
      await cityService.deleteCity(selectedCityId);
      setCities(prev => prev.filter(city => city.id !== selectedCityId));
      setSelectedCities(prev => prev.filter(id => id !== selectedCityId));
      showSuccess('City deleted successfully');
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting city:', error);
      showError('Error deleting city');
    }
  };

  const actionItems = [
    {
      key: 'edit',
      label: 'Edit',
      onClick: handleEditCity
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: handleDeleteCity
    }
  ];

  const handleDeleteAllCities = async () => {
    if (selectedCities.length === 0) {
      showError('Please select cities to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedCities.length} selected cities? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Delete all selected cities
      await Promise.all(selectedCities.map(cityId => cityService.deleteCity(cityId)));
      
      // Update state
      setCities(prev => prev.filter(city => !selectedCities.includes(city.id)));
      setSelectedCities([]);
      
      showSuccess(`${selectedCities.length} cities deleted successfully`);
    } catch (error) {
      console.error('Error deleting cities:', error);
      showError('Error deleting cities');
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
        title="Cities Management"
        search={{
          placeholder: 'Search cities...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add City',
          onClick: handleAddCity
        }}
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllCities,
            disabled: selectedCities.length === 0,
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
          {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} found
          {filteredCities.length !== cities.length && ` out of ${cities.length} total`}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <CitiesTable
            cities={filteredCities}
            selectedCities={selectedCities}
            onSelectAll={handleSelectAll}
            onSelectCity={handleSelectCity}
            onMenuClick={handleMenuClick}
          />
        </CardContent>
      </Card>

      <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} items={actionItems} />
    </div>
  );
};

export default Cities;
