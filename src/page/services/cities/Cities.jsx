import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import CitiesTable from '../../../features/cities/CitiesTable';
import {
  filterCities,
  CITY_FILTER_OPTIONS,
  CITY_STATUS_FILTERS
} from '../../../features/cities';
import { cityService } from '../../../services/api/cityService';
import { FilterToolbar } from '../../../components/common';
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

  const handleDeleteClick = (cityId) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      handleDeleteCity(cityId);
    }
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

  const handleDeleteCity = async (cityId) => {
    try {
      await cityService.deleteCity(cityId);
      setCities(prev => prev.filter(city => city.id !== cityId));
      setSelectedCities(prev => prev.filter(id => id !== cityId));
      showSuccess('City deleted successfully');
    } catch (error) {
      console.error('Error deleting city:', error);
      showError('Error deleting city');
    }
  };

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
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>

    </div>
  );
};

export default Cities;
