import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent } from '@mui/material';
import CitiesTable from '../../../features/cities/CitiesTable';
import {
  sampleCities,
  filterCities,
  CITY_FILTER_OPTIONS,
  CITY_STATUS_FILTERS
} from '../../../features/cities';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import './Cities.css';

const Cities = () => {
  const navigate = useNavigate();
  const [cities] = useState(sampleCities);
  const [selectedCities, setSelectedCities] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: CITY_STATUS_FILTERS.ALL
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);

  const filteredCities = useMemo(() => filterCities(cities, filters), [cities, filters]);

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

  const handleMenuClick = (event, cityId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCityId(cityId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCityId(null);
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

  const actionItems = [
    {
      key: 'view',
      label: 'View',
      onClick: () => alert(`Viewing city #${selectedCityId}`)
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => navigate('/services/cities/formCity')
    },
    {
      key: 'toggle',
      label: 'Toggle status',
      onClick: () => alert('Toggling city status')
    }
  ];

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
      />

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

      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        items={actionItems}
      />
    </div>
  );
};

export default Cities;
