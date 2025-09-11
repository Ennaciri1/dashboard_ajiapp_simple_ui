import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { HotelsTable, SearchFilters, ContextMenu } from './components';
import { sampleHotels } from './sampleData';
import { HOTEL_STATUS, RATING_FILTERS, PRICE_RANGES } from './constants.js';
import { filterHotels } from './utils';
import './Hotels.css';

const Hotels = () => {
  const navigate = useNavigate();
  const [hotels] = useState(sampleHotels);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState(RATING_FILTERS.ALL);
  const [priceFilter, setPriceFilter] = useState(PRICE_RANGES.ALL);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  // Filter hotels using utility function
  const filteredHotels = filterHotels(hotels, searchTerm, 'All', ratingFilter, priceFilter);

  const handleAddHotel = () => {
    navigate('/services/hotels/formHotel');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedHotels(filteredHotels.map(hotel => hotel.id));
    } else {
      setSelectedHotels([]);
    }
  };

  const handleSelectHotel = (hotelId) => {
    setSelectedHotels(prev =>
      prev.includes(hotelId)
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const handleMenuClick = (event, hotelId) => {
    setAnchorEl(event.currentTarget);
    setSelectedHotelId(hotelId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHotelId(null);
  };

  const handleEditHotel = () => {
    console.log('Edit hotel:', selectedHotelId);
    alert(`Editing hotel: ${hotels.find(h => h.id === selectedHotelId)?.name}`);
    handleMenuClose();
  };

  const handleDeleteHotel = () => {
    console.log('Delete hotel:', selectedHotelId);
    alert(`Deleting hotel: ${hotels.find(h => h.id === selectedHotelId)?.name}`);
    handleMenuClose();
  };

  const handleViewHotel = () => {
    console.log('View hotel:', selectedHotelId);
    alert(`Viewing hotel: ${hotels.find(h => h.id === selectedHotelId)?.name}`);
    handleMenuClose();
  };

  return (
    <div className="global-container">
      {/* Search and filters bar */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
        onAddHotel={handleAddHotel}
      />

      {/* Results indicator */}
      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          {filteredHotels.length !== hotels.length && ` out of ${hotels.length} total`}
        </Typography>
      </Box>

      {/* Table */}
      <Card className="hotels-card">
        <CardContent>
          <HotelsTable
            hotels={filteredHotels}
            selectedHotels={selectedHotels}
            onSelectAll={handleSelectAll}
            onSelectHotel={handleSelectHotel}
            onMenuClick={handleMenuClick}
          />
        </CardContent>
      </Card>

      {/* Context menu */}
      <ContextMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onEdit={handleEditHotel}
        onDelete={handleDeleteHotel}
        onView={handleViewHotel}
      />
    </div>
  );
};

export default Hotels;
