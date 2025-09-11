import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { SpotsTable, SearchFilters, ContextMenu } from './components';
import { sampleTouristSpots } from './data';
import { INTEREST_TYPES, RATING_FILTERS, RATING_THRESHOLDS } from './constants.js';
import { filterSpots } from './utils';
import './TouristSpots.css';


const TouristSpots = () => {
  const navigate = useNavigate();
  const [spots] = useState(sampleTouristSpots);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(RATING_FILTERS.ALL);
  const [ratingFilter, setRatingFilter] = useState(RATING_FILTERS.ALL);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  // Filter spots using utility function
  const filteredSpots = filterSpots(spots, searchTerm, typeFilter, ratingFilter);

  const handleAddSpot = () => {
    navigate('/services/tourist-spots/formSpots');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedSpots(filteredSpots.map(spot => spot.id));
    } else {
      setSelectedSpots([]);
    }
  };

  const handleSelectSpot = (spotId) => {
    setSelectedSpots(prev =>
      prev.includes(spotId)
        ? prev.filter(id => id !== spotId)
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
    console.log('Edit spot:', selectedSpotId);
    alert(`Editing spot: ${spots.find(s => s.id === selectedSpotId)?.name}`);
    handleMenuClose();
  };

  const handleDeleteSpot = () => {
    console.log('Delete spot:', selectedSpotId);
    alert(`Deleting spot: ${spots.find(s => s.id === selectedSpotId)?.name}`);
    handleMenuClose();
  };

  const handleViewSpot = () => {
    console.log('View spot:', selectedSpotId);
    alert(`Viewing spot: ${spots.find(s => s.id === selectedSpotId)?.name}`);
    handleMenuClose();
  };

  return (
    <div className="global-container">

      {/* Search and filters bar */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        onAddSpot={handleAddSpot}
      />

      {/* Results indicator */}
      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''} found
          {filteredSpots.length !== spots.length && ` out of ${spots.length} total`}
        </Typography>
      </Box>

      {/* Table */}
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

      {/* Context menu */}
      <ContextMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onEdit={handleEditSpot}
        onDelete={handleDeleteSpot}
        onView={handleViewSpot}
      />
    </div>
  );
};

export default TouristSpots;