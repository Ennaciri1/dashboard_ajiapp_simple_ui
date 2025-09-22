import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import SpotsTable from '../../../features/touristSpots/SpotsTable';
import { sampleTouristSpots, TOURIST_FILTER_DEFAULTS, TOURIST_FILTERS, filterSpots } from '../../../features/touristSpots';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import './TouristSpots.css';

const TouristSpots = () => {
  const navigate = useNavigate();
  const [spots] = useState(sampleTouristSpots);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [filters, setFilters] = useState(TOURIST_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  const filteredSpots = filterSpots(spots, filters);

  const handleAddSpot = () => {
    navigate('/services/tourist-spots/formSpots');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedSpots(filteredSpots.map((spot) => spot.id));
    } else {
      setSelectedSpots([]);
    }
  };

  const handleSelectSpot = (spotId) => {
    setSelectedSpots((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
  };

  const handleMenuClick = (event, spotId) => {
    setAnchorEl(event.currentTarget);
    setSelectedSpotId(spotId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSpotId(null);
  };

  const handleEditSpot = () => {
    const spot = spots.find((s) => s.id === selectedSpotId);
    if (spot) {
      console.log('Edit spot:', spot.id);
      alert(`Editing spot: ${spot.name}`);
    }
  };

  const handleDeleteSpot = () => {
    const spot = spots.find((s) => s.id === selectedSpotId);
    if (spot) {
      console.log('Delete spot:', spot.id);
      alert(`Deleting spot: ${spot.name}`);
    }
  };

  const handleViewSpot = () => {
    const spot = spots.find((s) => s.id === selectedSpotId);
    if (spot) {
      console.log('View spot:', spot.id);
      alert(`Viewing spot: ${spot.name}`);
    }
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = TOURIST_FILTERS.map((filter) => ({
    ...filter,
    value: filters[filter.key],
    onChange: handleFilterChange(filter.key)
  }));

  return (
    <div className="global-container">
      <FilterToolbar
        title="Tourist Spots Management"
        search={{
          placeholder: 'Search spots...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add Tourist Spot',
          icon: <AddIcon />,
          onClick: handleAddSpot
        }}
      />

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''} found
          {filteredSpots.length !== spots.length && ` out of ${spots.length} total`}
        </Typography>
      </Box>

      <Card className="tourist-spots-card">
        <CardContent>
          <SpotsTable
            spots={filteredSpots}
            selectedSpots={selectedSpots}
            onSelectAll={handleSelectAll}
            onSelectSpot={handleSelectSpot}
            onMenuClick={handleMenuClick}
          />
        </CardContent>
      </Card>

      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        items={[
          {
            key: 'view',
            label: 'View Spot',
            icon: <ViewIcon fontSize="small" />,
            onClick: handleViewSpot
          },
          {
            key: 'edit',
            label: 'Edit Spot',
            icon: <EditIcon fontSize="small" />,
            onClick: handleEditSpot
          },
          {
            key: 'delete',
            label: 'Delete Spot',
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleDeleteSpot
          }
        ]}
      />
    </div>
  );
};

export default TouristSpots;
