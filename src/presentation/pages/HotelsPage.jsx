import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

import { useHotels } from '../hooks/useHotels';
import { FilterToolbar, ActionMenu } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import HotelsTable from '../../features/hotels/HotelsTable';
import { filterHotels, HOTEL_FILTER_DEFAULTS, HOTEL_FILTERS } from '../../features/hotels';

/**
 * Page des hôtels - Composant pur qui utilise le hook useHotels
 * Toute la logique métier est déléguée au hook
 */
const HotelsPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  // État local pour l'UI seulement
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [filters, setFilters] = useState(HOTEL_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  // Hook personnalisé pour la gestion des hôtels
  const {
    hotels,
    loading,
    error,
    total,
    isTestMode,
    deleteHotel,
    clearError,
    refresh
  } = useHotels();

  // Filtrage côté client (peut être déplacé dans le hook si nécessaire)
  const filteredHotels = useMemo(() => filterHotels(hotels, filters), [hotels, filters]);

  // Handlers d'événements (logique UI pure)
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAddHotel = () => {
    navigate('/services/hotels/formHotel');
  };

  const handleEditHotel = (hotelId) => {
    navigate(`/services/hotels/edit/${hotelId}`);
    handleCloseMenu();
  };

  const handleDeleteHotel = async (hotelId) => {
    try {
      await deleteHotel(hotelId);
      showSuccess('Hôtel supprimé avec succès');
      
      // Nettoyage de la sélection si l'hôtel supprimé était sélectionné
      setSelectedHotels(prev => prev.filter(id => id !== hotelId));
    } catch (error) {
      showError(`Erreur lors de la suppression: ${error.message}`);
    }
    handleCloseMenu();
  };

  const handleViewHotel = (hotelId) => {
    // Logique d'affichage des détails
    console.log('Viewing hotel:', hotelId);
    handleCloseMenu();
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedHotels(newSelection);
  };

  const handleMenuOpen = (event, hotelId) => {
    setAnchorEl(event.currentTarget);
    setSelectedHotelId(hotelId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedHotelId(null);
  };

  const handleRetry = () => {
    clearError();
    refresh();
  };

  // Actions du menu contextuel
  const menuActions = [
    {
      label: 'Voir',
      icon: <ViewIcon />,
      onClick: () => handleViewHotel(selectedHotelId)
    },
    {
      label: 'Modifier',
      icon: <EditIcon />,
      onClick: () => handleEditHotel(selectedHotelId)
    },
    {
      label: 'Supprimer',
      icon: <DeleteIcon />,
      onClick: () => handleDeleteHotel(selectedHotelId),
      color: 'error'
    }
  ];

  // Rendu conditionnel pour les erreurs
  if (error) {
    return (
      <Box className="hotels-page">
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Réessayer
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="hotels-page">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des Hôtels
      </Typography>

      {/* Indicateur de mode test */}
      {isTestMode && (
        <Alert severity="info" sx={{ mb: 2 }}>
          🧪 Mode test activé - API non disponible (192.168.11.127:8080). Les données affichées sont des exemples et les actions sont simulées.
        </Alert>
      )}

      {/* Barre d'outils de filtrage */}
      <FilterToolbar
        filters={filters}
        onFiltersChange={handleFilterChange}
        filterOptions={HOTEL_FILTERS}
        onAdd={handleAddHotel}
        addLabel="Ajouter un hôtel"
        addIcon={<AddIcon />}
      />

      {/* Contenu principal */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {total} hôtel{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                {filteredHotels.length !== total && 
                  ` (${filteredHotels.length} affiché${filteredHotels.length > 1 ? 's' : ''})`
                }
              </Typography>

              <HotelsTable
                hotels={filteredHotels}
                selectedHotels={selectedHotels}
                onSelectionChange={handleSelectionChange}
                onMenuOpen={handleMenuOpen}
                loading={loading}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Menu contextuel */}
      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        actions={menuActions}
      />
    </Box>
  );
};

export default HotelsPage;
