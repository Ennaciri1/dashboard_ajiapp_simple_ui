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
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import SpotsTable from '../../../features/touristSpots/SpotsTable';
import { TOURIST_FILTER_DEFAULTS, TOURIST_FILTERS, filterSpots } from '../../../features/touristSpots';
import { touristSpotService } from '../../../services/api/touristSpotService';
import { cityService } from '../../../services/api/cityService';
import { FilterToolbar, ActionMenu, SpotDetailModal } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import './TouristSpots.css';

const TouristSpots = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [spots, setSpots] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(TOURIST_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [focusedElement, setFocusedElement] = useState(null);
  const [cities, setCities] = useState([]);

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

  // Load tourist spots from API
  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await touristSpotService.getAllTouristSpots();
        console.log('API Response:', response);
        
        // Handle API response structure: response.data.spots
        let spotsData = [];
        if (response && response.data && response.data.spots) {
          spotsData = Array.isArray(response.data.spots) ? response.data.spots : [];
        } else if (response && response.data && Array.isArray(response.data)) {
          spotsData = response.data;
        } else if (Array.isArray(response)) {
          spotsData = response;
        }
        
        setSpots(spotsData);
      } catch (err) {
        console.error('Error loading tourist spots:', err);
        setError('Error loading tourist spots');
        setSpots([]);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, []);

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
    try {
      await touristSpotService.deleteTouristSpot(selectedSpotId);
      setSpots(prev => prev.filter(spot => spot.id !== selectedSpotId));
      setSelectedSpots(prev => prev.filter(id => id !== selectedSpotId));
      showSuccess('Tourist spot deleted successfully');
    } catch (error) {
      console.error('Error deleting tourist spot:', error);
      showError('Error deleting tourist spot');
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
      // Delete all selected tourist spots
      await Promise.all(selectedSpots.map(spotId => touristSpotService.deleteTouristSpot(spotId)));
      
      // Update state
      setSpots(prev => prev.filter(spot => !selectedSpots.includes(spot.id)));
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

      <SpotDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        spot={selectedSpotId ? spots.find(s => s.id === selectedSpotId) : null}
      />
    </div>
  );
};

export default TouristSpots;
