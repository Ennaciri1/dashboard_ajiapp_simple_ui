import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import HotelsTable from '../../../features/hotels/HotelsTable';
import { filterHotels, HOTEL_FILTER_DEFAULTS, HOTEL_FILTERS } from '../../../features/hotels';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { hotelService } from '../../../services/api/hotelService';
import './Hotels.css';

const Hotels = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [hotels, setHotels] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [filters, setFilters] = useState(HOTEL_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredHotels = useMemo(() => filterHotels(hotels, filters), [hotels, filters]);

  // Load hotels from API
  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await hotelService.getAllHotels();
        console.log('API Response:', response);
        
        // Handle API response structure: response.data.hotels
        let hotelsData = [];
        if (response && response.data && response.data.hotels) {
          hotelsData = Array.isArray(response.data.hotels) ? response.data.hotels : [];
        } else if (response && response.data && Array.isArray(response.data)) {
          hotelsData = response.data;
        } else if (Array.isArray(response)) {
          hotelsData = response;
        }
        
        setHotels(hotelsData);
      } catch (err) {
        console.error('Error loading hotels:', err);
        setError('Error loading hotels');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

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
    if (selectedHotelId) {
      navigate(`/services/hotels/edit/${selectedHotelId}`);
      setAnchorEl(null);
    }
  };

  const handleViewHotel = () => {
    const hotel = hotels.find((h) => h.id === selectedHotelId);
    if (hotel) {
      console.log('View hotel:', hotel.id);
      showSuccess(`Viewing hotel: ${hotel.name}`);
      setAnchorEl(null);
    }
  };

  const handleDeleteHotel = async () => {
    if (selectedHotelId) {
      const confirmed = window.confirm('Are you sure you want to delete this hotel?');
      if (!confirmed) {
        setAnchorEl(null);
        return;
      }

      try {
        await hotelService.deleteHotel(selectedHotelId);
        setHotels(prev => prev.filter(h => h.id !== selectedHotelId));
        setSelectedHotels(prev => prev.filter(id => id !== selectedHotelId));
        showSuccess('Hotel deleted successfully');
      } catch (error) {
        console.error('Error deleting hotel:', error);
        showError('Error deleting hotel');
      } finally {
        setAnchorEl(null);
      }
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
      // Delete all selected hotels
      await Promise.all(selectedHotels.map(hotelId => hotelService.deleteHotel(hotelId)));
      
      // Update state
      setHotels(prev => prev.filter(hotel => !selectedHotels.includes(hotel.id)));
      setSelectedHotels([]);
      
      showSuccess(`${selectedHotels.length} hotels deleted successfully`);
    } catch (error) {
      console.error('Error deleting hotels:', error);
      showError('Error deleting hotels');
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
