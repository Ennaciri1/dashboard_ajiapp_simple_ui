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
import HotelsTable from '../../../features/hotels/HotelsTable';
import { sampleHotels, filterHotels, HOTEL_FILTER_DEFAULTS, HOTEL_FILTERS } from '../../../features/hotels';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import './Hotels.css';

const Hotels = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [hotels, setHotels] = useState(sampleHotels);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [filters, setFilters] = useState(HOTEL_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const filteredHotels = filterHotels(hotels, filters);

  const handleAddHotel = () => {
    navigate('/services/hotels/formHotel');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedHotels(filteredHotels.map((hotel) => hotel.id));
    } else {
      setSelectedHotels([]);
    }
  };

  const handleSelectHotel = (hotelId) => {
    setSelectedHotels((prev) =>
      prev.includes(hotelId)
        ? prev.filter((id) => id !== hotelId)
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
    const hotel = hotels.find((h) => h.id === selectedHotelId);
    if (hotel) {
      console.log('Edit hotel:', hotel.id);
      showSuccess(`Editing hotel: ${hotel.name}`);
    }
  };

  const handleDeleteHotel = () => {
    const hotel = hotels.find((h) => h.id === selectedHotelId);
    if (hotel) {
      setHotels(prev => prev.filter(h => h.id !== selectedHotelId));
      setSelectedHotels(prev => prev.filter(id => id !== selectedHotelId));
      showSuccess(`Hotel "${hotel.name}" deleted successfully`);
    }
  };

  const handleDeleteAllHotels = async () => {
    if (selectedHotels.length === 0) {
      showError('Please select hotels to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedHotels.length} selected hotels? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Update state to remove selected hotels
      setHotels(prev => prev.filter(hotel => !selectedHotels.includes(hotel.id)));
      setSelectedHotels([]);
      
      showSuccess(`${selectedHotels.length} hotels deleted successfully`);
    } catch (error) {
      console.error('Error deleting hotels:', error);
      showError('Error deleting hotels');
    }
  };

  const handleViewHotel = () => {
    const hotel = hotels.find((h) => h.id === selectedHotelId);
    if (hotel) {
      console.log('View hotel:', hotel.id);
      showSuccess(`Viewing hotel: ${hotel.name}`);
    }
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = HOTEL_FILTERS.map((filter) => ({
    ...filter,
    value: filters[filter.key],
    onChange: handleFilterChange(filter.key)
  }));

  return (
    <div className="global-container">
      <FilterToolbar
        title="Hotels Management"
        search={{
          placeholder: 'Search hotels...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add Hotel',
          icon: <AddIcon />,
          onClick: handleAddHotel
        }}
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllHotels,
            disabled: selectedHotels.length === 0,
            color: 'error'
          }
        ]}
      />

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          {filteredHotels.length !== hotels.length && ` out of ${hotels.length} total`}
        </Typography>
      </Box>

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

      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        items={[
          {
            key: 'view',
            label: 'View',
            icon: <ViewIcon fontSize="small" />,
            onClick: handleViewHotel
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditIcon fontSize="small" />,
            onClick: handleEditHotel
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleDeleteHotel
          }
        ]}
      />
    </div>
  );
};

export default Hotels;
