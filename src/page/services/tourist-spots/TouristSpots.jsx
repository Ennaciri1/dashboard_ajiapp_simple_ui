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
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import SpotsTable from '../../../features/touristSpots/SpotsTable';
import { TOURIST_FILTER_DEFAULTS, TOURIST_FILTERS, filterSpots } from '../../../features/touristSpots';
import { useTouristSpots } from '../../../presentation/hooks/useTouristSpots';
import { useLanguages } from '../../../presentation/hooks/useLanguages';
import { cityService } from '../../../infrastructure/api/cityService';
import { FilterToolbar, ActionMenu, SpotDetailModal } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import './TouristSpots.css';

const TouristSpots = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { spots: spotsEntities, loading, error, deleteSpot, loadSpots } = useTouristSpots();
  const { languages } = useLanguages();
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [filters, setFilters] = useState(TOURIST_FILTER_DEFAULTS);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [focusedElement, setFocusedElement] = useState(null);
  const [cities, setCities] = useState([]);

  // Convertir les entités TouristSpot en format plat pour le filtrage
  const spots = useMemo(() => {
    console.log('TouristSpots - Converting spotsEntities:', spotsEntities);
    console.log('TouristSpots - spotsEntities length:', spotsEntities?.length || 0);
    
    if (!Array.isArray(spotsEntities) || spotsEntities.length === 0) {
      console.log('TouristSpots - No spots entities to convert');
      return [];
    }
    
    return spotsEntities.map(spot => {
      // Use raw data if available, otherwise use entity properties
      const rawData = spot._rawData || {};
      
      console.log('TouristSpots - Converting spot:', spot);
      console.log('TouristSpots - rawData:', rawData);
      
      const result = {
        id: spot.id,
        name: spot.name || '',
        nameTranslations: spot.nameTranslations || {},
        city: spot.city || rawData.cityName || '',
        cityName: rawData.cityName || spot.city || '', // SpotsTable expects cityName
        cityId: rawData.cityId || '',
        description: spot.description || '',
        descriptionTranslations: spot.descriptionTranslations || {},
        address: rawData.address || spot.address || '', // API provides address directly
        addressTranslations: spot.addressTranslations || {},
        interestTypes: spot.interestTypes || [],
        rating: spot.rating,
        coordinates: spot.coordinates,
        images: spot.images || [],
        openingHours: spot.openingHours || {},
        openingTime: rawData.openingTime || '',
        closingTime: rawData.closingTime || '',
        entryFee: spot.entryFee || '',
        paidEntry: rawData.paidEntry !== undefined ? rawData.paidEntry : (spot.entryFee === 'paid' || spot.entryFee === true), // SpotsTable expects paidEntry boolean
        active: rawData.active !== undefined ? rawData.active : (spot.status === 'active'), // SpotsTable expects active boolean
        likes: rawData.likes || 0,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
      };
      
      console.log('TouristSpots - Converted result:', result);
      return result;
    });
  }, [spotsEntities]);

  const filteredSpots = useMemo(() => {
    if (!Array.isArray(spots)) {
      return [];
    }
    return filterSpots(spots, filters);
  }, [spots, filters]);

  // Rendre inert le contenu de la page quand le modal est ouvert
  React.useEffect(() => {
    const mainContent = document.querySelector('.global-container');
    if (mainContent) {
      if (detailModalOpen) {
        mainContent.setAttribute('inert', 'true');
        mainContent.setAttribute('aria-hidden', 'true');
      } else {
        mainContent.removeAttribute('inert');
        mainContent.removeAttribute('aria-hidden');
      }
    }
    
    // Cleanup
    return () => {
      if (mainContent) {
        mainContent.removeAttribute('inert');
        mainContent.removeAttribute('aria-hidden');
      }
    };
  }, [detailModalOpen]);

  // Load cities from API
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await cityService.getAllCities();
        setCities(response.data || []);
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };
    loadCities();
  }, []);

  // Load spots on mount and when language changes
  useEffect(() => {
    loadSpots({ language: selectedLanguage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]); // loadSpots is stable from useCallback, only re-load when language changes

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
  };

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
    // Ne pas réinitialiser selectedSpotId ici pour garder l'ID pour le modal
  };

  const handleViewSpot = React.useCallback(() => {
    console.log('View clicked, selectedSpotId:', selectedSpotId);
    if (selectedSpotId) {
      const spot = spots.find(s => s.id === selectedSpotId);
      console.log('Found spot:', spot);
      
      // Sauvegarder l'élément actuellement focusé
      setFocusedElement(document.activeElement);
      
      setDetailModalOpen(true);
      setAnchorEl(null);
      
      // Retirer le focus de l'élément actuel
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  }, [selectedSpotId, spots]);

  const handleCloseDetailModal = React.useCallback(() => {
    setDetailModalOpen(false);
    setSelectedSpotId(null);
    
    // Restaurer le focus sur l'élément précédemment focusé
    setTimeout(() => {
      if (focusedElement && focusedElement.focus) {
        focusedElement.focus();
      } else {
        // Fallback: chercher le premier bouton d'actions
        const firstButton = document.querySelector('.actions-button');
        if (firstButton) {
          firstButton.focus();
        }
      }
      setFocusedElement(null);
    }, 100);
  }, [focusedElement]);

  const handleEditSpot = () => {
    if (selectedSpotId) {
      navigate(`/services/tourist-spots/edit/${selectedSpotId}`);
      setAnchorEl(null);
    }
  };

  const handleDeleteSpot = async () => {
    if (selectedSpotId) {
      const confirmed = window.confirm('Are you sure you want to delete this tourist spot?');
      if (!confirmed) {
        setAnchorEl(null);
        return;
      }

    try {
        await deleteSpot(selectedSpotId);
      setSelectedSpots(prev => prev.filter(id => id !== selectedSpotId));
      showSuccess('Tourist spot deleted successfully');
    } catch (error) {
      console.error('Error deleting tourist spot:', error);
      showError('Error deleting tourist spot');
      } finally {
        setAnchorEl(null);
      }
    }
  };

  const handleDeleteAllSpots = async () => {
    if (selectedSpots.length === 0) {
      showError('Please select tourist spots to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedSpots.length} selected tourist spots? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await Promise.all(selectedSpots.map(spotId => deleteSpot(spotId)));
      setSelectedSpots([]);
      showSuccess(`${selectedSpots.length} tourist spots deleted successfully`);
    } catch (error) {
      console.error('Error deleting tourist spots:', error);
      showError('Error deleting tourist spots');
    }
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = TOURIST_FILTERS.map((filter) => {
    let options = filter.options;
    
    // Populate city options dynamically
    if (filter.key === 'city') {
      options = [
        { value: 'all', label: 'All Cities' },
        ...cities.map(city => ({
          value: city.id,
          label: city.nameTranslations?.en || city.name || city.id
        }))
      ];
    }
    
    return {
      ...filter,
      options,
      value: filters[filter.key],
      onChange: handleFilterChange(filter.key)
    };
  });

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
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllSpots,
            disabled: selectedSpots.length === 0,
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
            label: 'View Details',
            icon: <ViewIcon fontSize="small" />,
            onClick: handleViewSpot
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditIcon fontSize="small" />,
            onClick: handleEditSpot
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleDeleteSpot
          }
        ]}
      />

      <SpotDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        spot={selectedSpotId ? spots.find(s => s.id === selectedSpotId) : null}
      />
    </div>
  );
};

export default TouristSpots;
