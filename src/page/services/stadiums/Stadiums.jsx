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
import StadiumsTable from '../../../features/stadiums/StadiumsTable';
import { filterStadiums, STADIUM_FILTER_DEFAULTS, STADIUM_FILTERS } from '../../../features/stadiums';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { useStadiums } from '../../../presentation/hooks/useStadiums';
import { useLanguages } from '../../../presentation/hooks/useLanguages';
import { cityService } from '../../../infrastructure/api/cityService';
import './Stadiums.css';

const Stadiums = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { stadiums: stadiumsEntities, loading, error, deleteStadium, loadStadiums } = useStadiums();
  const { languages } = useLanguages();
  const [selectedStadiums, setSelectedStadiums] = useState([]);
  const [filters, setFilters] = useState(STADIUM_FILTER_DEFAULTS);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStadiumId, setSelectedStadiumId] = useState(null);
  const [cities, setCities] = useState([]);

  // Convertir les entités Stadium en format plat pour le filtrage
  const stadiums = useMemo(() => {
    console.log('Stadiums - Converting stadiumsEntities:', stadiumsEntities);
    console.log('Stadiums - stadiumsEntities length:', stadiumsEntities?.length || 0);
    
    if (!Array.isArray(stadiumsEntities) || stadiumsEntities.length === 0) {
      console.log('Stadiums - No stadiums entities to convert');
      return [];
    }
    
    return stadiumsEntities.map(stadium => ({
      id: stadium.id,
      name: stadium.name,
      description: stadium.description,
      cityId: stadium.cityId,
      cityName: stadium.cityName,
      location: stadium.location,
      images: stadium.images || [],
      capacity: stadium.capacity,
      inauguration: stadium.inauguration,
      homeGround: stadium.homeGround,
      active: stadium.status === 'active',
      createdAt: stadium.createdAt,
      updatedAt: stadium.updatedAt
    }));
  }, [stadiumsEntities]);

  const filteredStadiums = useMemo(() => filterStadiums(stadiums, filters), [stadiums, filters]);

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

  // Load stadiums on mount and when language changes
  useEffect(() => {
    loadStadiums({ language: selectedLanguage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]); // Re-load when language changes

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
  };

  // Note: loadStadiums() est déjà appelé dans useStadiums au montage, pas besoin de le rappeler ici

  const handleAddStadium = () => {
    navigate('/services/stadiums/formStadium');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedStadiums(filteredStadiums.map((stadium) => stadium.id));
    } else {
      setSelectedStadiums([]);
    }
  };

  const handleSelectStadium = (stadiumId) => {
    setSelectedStadiums((prev) =>
      prev.includes(stadiumId)
        ? prev.filter((id) => id !== stadiumId)
        : [...prev, stadiumId]
    );
  };

  const handleMenuClick = (event, stadiumId) => {
    setAnchorEl(event.currentTarget);
    setSelectedStadiumId(stadiumId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStadiumId(null);
  };

  const handleEditStadium = () => {
    if (selectedStadiumId) {
      navigate(`/services/stadiums/edit/${selectedStadiumId}`);
      setAnchorEl(null);
    }
  };

  const handleViewStadium = () => {
    const stadium = stadiums.find((s) => s.id === selectedStadiumId);
    if (stadium) {
      console.log('View stadium:', stadium.id);
      showSuccess(`Viewing stadium: ${stadium.nameTranslations?.en || stadium.name}`);
      setAnchorEl(null);
    }
  };

  const handleDeleteStadium = async () => {
    if (selectedStadiumId) {
      const confirmed = window.confirm('Are you sure you want to delete this stadium?');
      if (!confirmed) {
        setAnchorEl(null);
        return;
      }

      try {
        await deleteStadium(selectedStadiumId);
        setSelectedStadiums(prev => prev.filter(id => id !== selectedStadiumId));
        showSuccess('Stadium deleted successfully');
      } catch (error) {
        console.error('Error deleting stadium:', error);
        showError('Error deleting stadium');
      } finally {
        setAnchorEl(null);
      }
    }
  };

  const handleDeleteAllStadiums = async () => {
    if (selectedStadiums.length === 0) {
      showError('Please select stadiums to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedStadiums.length} selected stadiums? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await Promise.all(selectedStadiums.map(stadiumId => deleteStadium(stadiumId)));
      setSelectedStadiums([]);
      showSuccess(`${selectedStadiums.length} stadiums deleted successfully`);
    } catch (error) {
      console.error('Error deleting stadiums:', error);
      showError('Error deleting stadiums');
    }
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = STADIUM_FILTERS.map((filter) => {
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
        title="Stadiums Management"
        search={{
          placeholder: 'Search stadiums...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add Stadium',
          icon: <AddIcon />,
          onClick: handleAddStadium
        }}
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllStadiums,
            disabled: selectedStadiums.length === 0,
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
          {filteredStadiums.length} stadium{filteredStadiums.length !== 1 ? 's' : ''} found
          {filteredStadiums.length !== stadiums.length && ` out of ${stadiums.length} total`}
        </Typography>
      </Box>

      <Card className="stadiums-card">
        <CardContent>
          <StadiumsTable
            stadiums={filteredStadiums}
            selectedStadiums={selectedStadiums}
            onSelectAll={handleSelectAll}
            onSelectStadium={handleSelectStadium}
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
            onClick: handleViewStadium
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditIcon fontSize="small" />,
            onClick: handleEditStadium
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleDeleteStadium
          }
        ]}
      />
    </div>
  );
};

export default Stadiums;
