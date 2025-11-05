import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
import { useHotels } from '../../../presentation/hooks/useHotels';
import { useLanguages } from '../../../presentation/hooks/useLanguages';
import './Hotels.css';

const Hotels = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { hotels: hotelsEntities, loading, error, deleteHotel, loadHotels } = useHotels();
  const { languages } = useLanguages();
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [filters, setFilters] = useState(HOTEL_FILTER_DEFAULTS);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  // Convertir les entités Hotel en format plat pour le filtrage
  const hotels = useMemo(() => {
    console.log('Hotels - Converting hotelsEntities:', hotelsEntities);
    console.log('Hotels - hotelsEntities length:', hotelsEntities?.length || 0);
    
    if (!Array.isArray(hotelsEntities) || hotelsEntities.length === 0) {
      console.log('Hotels - No hotels entities to convert');
      return [];
    }
    
    return hotelsEntities.map(hotel => {
      // Use raw data if available, otherwise use entity properties
      const rawData = hotel._rawData || {};
      
      console.log('Hotels - Converting hotel:', hotel);
      console.log('Hotels - hotel.name:', hotel.name);
      console.log('Hotels - hotel.description:', hotel.description);
      console.log('Hotels - rawData:', rawData);
      console.log('Hotels - rawData.cityName:', rawData.cityName);
      console.log('Hotels - rawData.priceRange:', rawData.priceRange);
      console.log('Hotels - rawData.likesCount:', rawData.likesCount);
      
      const mappedHotel = {
        id: hotel.id,
        name: hotel.name || '',
        city: rawData.cityName || hotel.location?.cityName || '',
        cityName: rawData.cityName || hotel.location?.cityName || '', // HotelsTable expects cityName
        location: rawData.location || hotel.location || {},
        description: hotel.description || '',
        amenities: hotel.amenities || [],
        rating: hotel.rating,
        priceRange: rawData.priceRange || hotel.priceRange || {},
        images: hotel.images || [],
        likesCount: rawData.likesCount || 0,
        active: rawData.active !== undefined ? rawData.active : (hotel.status === 'active'),
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt
      };
      
      console.log('Hotels - Mapped hotel:', mappedHotel);
      return mappedHotel;
    });
  }, [hotelsEntities]);

  const filteredHotels = useMemo(() => filterHotels(hotels, filters), [hotels, filters]);

  // Load hotels on mount and when language changes
  useEffect(() => {
    loadHotels({ language: selectedLanguage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]); // Re-load when language changes

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
  };

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
        await deleteHotel(selectedHotelId);
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
      await Promise.all(selectedHotels.map(hotelId => deleteHotel(hotelId)));
      
      // Update state
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
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          {filteredHotels.length !== hotels.length && ` out of ${hotels.length} total`}
        </Typography>
      </Box>

      <Card className="hotels-card">
        <CardContent>
          {console.log('Hotels - Rendering HotelsTable with filteredHotels:', filteredHotels)}
          {console.log('Hotels - filteredHotels length:', filteredHotels?.length || 0)}
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
            label: 'View Details',
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
