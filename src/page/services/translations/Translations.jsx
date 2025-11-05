import React, { useState, useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { useTranslations } from '../../../presentation/hooks/useTranslations';
import { useLanguages } from '../../../presentation/hooks/useLanguages';
import { useHotels } from '../../../presentation/hooks/useHotels';
import { useTouristSpots } from '../../../presentation/hooks/useTouristSpots';
import { useStadiums } from '../../../presentation/hooks/useStadiums';
import { cityService } from '../../../infrastructure/api/cityService';
import { contactService } from '../../../infrastructure/api/contactService';
import { visaService } from '../../../infrastructure/api/visaService';
import httpClient from '../../../infrastructure/api/httpClient';
import TranslationsTable from '../../../features/translations/TranslationsTable';
import { FilterToolbar } from '../../../components/common';
import './Translations.css';

const Translations = () => {
  const { groupedTranslations, loading, error, refresh } = useTranslations();
  const { languages } = useLanguages();
  const { hotels } = useHotels();
  const { spots } = useTouristSpots();
  const { stadiums } = useStadiums();
  const [cities, setCities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [visas, setVisas] = useState([]);
  const [activities, setActivities] = useState([]);
  const [entitiesLoading, setEntitiesLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    entityType: 'all'
  });
  const [selectedTab, setSelectedTab] = useState(0);

  // Load cities, contacts, and visas
  useEffect(() => {
    const loadEntities = async () => {
      try {
        setEntitiesLoading(true);
        
        // Load cities
        try {
          const citiesResponse = await cityService.getAllCities();
          const citiesData = citiesResponse.data?.data || citiesResponse.data || [];
          setCities(Array.isArray(citiesData) ? citiesData : []);
        } catch (error) {
          console.error('Error loading cities:', error);
          setCities([]);
        }
        
        // Load contacts
        try {
          const contactsResponse = await contactService.getAllContacts();
          const contactsData = contactsResponse.data?.data || contactsResponse.data || [];
          setContacts(Array.isArray(contactsData) ? contactsData : []);
        } catch (error) {
          console.error('Error loading contacts:', error);
          setContacts([]);
        }
        
        // Load visas
        try {
          const visasResponse = await visaService.getAllVisas();
          const visasData = visasResponse.data?.data || visasResponse.data || [];
          setVisas(Array.isArray(visasData) ? visasData : []);
        } catch (error) {
          console.error('Error loading visas:', error);
          setVisas([]);
        }
        
        // Load activities (generic API call)
        try {
          const activitiesResponse = await httpClient.get('/activities');
          const activitiesData = activitiesResponse.data?.data?.activities || 
                                activitiesResponse.data?.data || 
                                activitiesResponse.data || [];
          setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        } catch (error) {
          console.error('Error loading activities:', error);
          setActivities([]);
        }
      } finally {
        setEntitiesLoading(false);
      }
    };
    loadEntities();
  }, []);

  // Create entity name mapping
  const entityNameMap = useMemo(() => {
    const map = {};
    
    // Map hotels
    hotels.forEach(hotel => {
      map[`hotel_${hotel.id}`] = hotel.name || `Hotel ${hotel.id}`;
    });
    
    // Map tourist spots
    spots.forEach(spot => {
      map[`tourist_spot_${spot.id}`] = spot.name || `Tourist Spot ${spot.id}`;
    });
    
    // Map stadiums
    stadiums.forEach(stadium => {
      map[`stadium_${stadium.id}`] = stadium.name || `Stadium ${stadium.id}`;
    });
    
    // Map cities
    cities.forEach(city => {
      const cityName = city.nameTranslations?.en || city.name || `City ${city.id}`;
      map[`city_${city.id}`] = cityName;
    });
    
    // Map contacts
    contacts.forEach(contact => {
      const contactName = contact.nameTranslations?.en || contact.name || `Contact ${contact.id}`;
      map[`contact_${contact.id}`] = contactName;
    });
    
    // Map visas
    visas.forEach(visa => {
      const visaName = visa.nameTranslations?.en || visa.name || visa.title || `Visa ${visa.id}`;
      map[`visa_${visa.id}`] = visaName;
    });
    
    // Map activities
    activities.forEach(activity => {
      const activityName = activity.nameTranslations?.en || activity.name || activity.title || `Activity ${activity.id}`;
      map[`activity_${activity.id}`] = activityName;
    });
    
    return map;
  }, [hotels, spots, stadiums, cities, contacts, visas, activities]);

  // Get entity name by type and ID
  // First tries the entityNameMap, then tries to get name from translations, finally falls back to ID
  const getEntityName = useMemo(() => {
    return (entityType, entityId) => {
      const key = `${entityType}_${entityId}`;
      
      // First try the pre-loaded entity name map
      if (entityNameMap[key]) {
        return entityNameMap[key];
      }
      
      // If not found, try to get name from translations (usually the 'name' field)
      if (groupedTranslations && groupedTranslations[entityType] && groupedTranslations[entityType][entityId]) {
        const entityTranslations = groupedTranslations[entityType][entityId];
        if (entityTranslations.name && entityTranslations.name.en) {
          return entityTranslations.name.en;
        }
        // Try other common name fields
        if (entityTranslations.title && entityTranslations.title.en) {
          return entityTranslations.title.en;
        }
      }
      
      // Fallback to ID
      return entityId;
    };
  }, [entityNameMap, groupedTranslations]);

  // Get all entity types from grouped translations
  const entityTypes = useMemo(() => {
    if (!groupedTranslations || typeof groupedTranslations !== 'object') {
      return [];
    }
    return Object.keys(groupedTranslations);
  }, [groupedTranslations]);

  // Filter translations data based on search and entity type
  const filteredTranslationsData = useMemo(() => {
    if (!groupedTranslations || typeof groupedTranslations !== 'object') {
      return {};
    }

    // Create a deep copy to ensure React detects changes
    let filtered = JSON.parse(JSON.stringify(groupedTranslations));

    // Filter by entity type
    if (filters.entityType !== 'all') {
      filtered = { [filters.entityType]: filtered[filters.entityType] || {} };
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const result = {};
      
      Object.keys(filtered).forEach(entityType => {
        const entities = filtered[entityType] || {};
        const filteredEntities = {};
        
        Object.keys(entities).forEach(entityId => {
          const fields = entities[entityId] || {};
          const filteredFields = {};
          
          Object.keys(fields).forEach(fieldName => {
            const translations = fields[fieldName] || {};
            const matchesSearch = Object.values(translations).some(translation =>
              String(translation).toLowerCase().includes(searchLower)
            ) || 
            getEntityName(entityType, entityId).toLowerCase().includes(searchLower) ||
            fieldName.toLowerCase().includes(searchLower);
            
            if (matchesSearch) {
              filteredFields[fieldName] = translations;
            }
          });
          
          if (Object.keys(filteredFields).length > 0) {
            filteredEntities[entityId] = filteredFields;
          }
        });
        
        if (Object.keys(filteredEntities).length > 0) {
          result[entityType] = filteredEntities;
        }
      });
      
      return result;
    }

    return filtered;
  }, [groupedTranslations, filters, getEntityName]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    
    // Update entity type filter based on selected tab
    if (newValue === 0) {
      setFilters(prev => ({ ...prev, entityType: 'all' }));
    } else {
      const entityType = entityTypes[newValue - 1];
      setFilters(prev => ({ ...prev, entityType }));
    }
  };

  // Sync selectedTab with entityType filter
  useEffect(() => {
    if (filters.entityType === 'all') {
      setSelectedTab(0);
    } else {
      const index = entityTypes.indexOf(filters.entityType);
      if (index !== -1) {
        setSelectedTab(index + 1);
      }
    }
  }, [filters.entityType, entityTypes]);

  // Get entity type display name
  const getEntityTypeLabel = (entityType) => {
    const labels = {
      city: 'Cities',
      tourist_spot: 'Tourist Spots',
      hotel: 'Hotels',
      stadium: 'Stadiums',
      visa: 'Visas',
      contact: 'Contacts',
      activity: 'Activities'
    };
    return labels[entityType] || entityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading || entitiesLoading) {
    return (
      <div className="global-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="global-container">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="global-container">
      <FilterToolbar
        title="Translations Management"
        search={{
          placeholder: 'Search translations...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
      />

      {/* Entity Type Tabs */}
      <Card className="translations-card">
        <CardContent>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className="entity-type-tabs"
            sx={{ mb: 2 }}
          >
            <Tab label="All" value={0} />
            {entityTypes.map((entityType, index) => (
              <Tab
                key={entityType}
                label={getEntityTypeLabel(entityType)}
                value={index + 1}
              />
            ))}
          </Tabs>

          {/* Count of translations */}
          <Box className="results-indicator" sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              {Object.keys(filteredTranslationsData).reduce((total, entityType) => {
                const entities = filteredTranslationsData[entityType] || {};
                return total + Object.keys(entities).reduce((entityTotal, entityId) => {
                  const fields = entities[entityId] || {};
                  return entityTotal + Object.keys(fields).length;
                }, 0);
              }, 0)} translation row{Object.keys(filteredTranslationsData).reduce((total, entityType) => {
                const entities = filteredTranslationsData[entityType] || {};
                return total + Object.keys(entities).reduce((entityTotal, entityId) => {
                  const fields = entities[entityId] || {};
                  return entityTotal + Object.keys(fields).length;
                }, 0);
              }, 0) !== 1 ? 's' : ''} found
            </Typography>
          </Box>

          {/* Translations Table */}
          {Object.keys(filteredTranslationsData).length === 0 ? (
            <Box className="no-translations" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No translations found
              </Typography>
            </Box>
          ) : (
            <TranslationsTable
              translationsData={filteredTranslationsData}
              getEntityName={getEntityName}
              getEntityTypeLabel={getEntityTypeLabel}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Translations;

