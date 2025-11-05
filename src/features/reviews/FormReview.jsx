import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControlLabel,
  Switch,
  Rating,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Star as StarIcon
} from '@mui/icons-material';
import {
  REVIEW_STATUS,
  REVIEW_STATUS_OPTIONS,
  REVIEW_ENTITY_OPTIONS
} from './index';
import { useNotification } from '../../contexts/NotificationContext';
import { useHotels } from '../../presentation/hooks/useHotels';
import { useTouristSpots } from '../../presentation/hooks/useTouristSpots';
import './FormReview.css';

const activityOptions = [
  { id: 'a-1', name: 'Desert Quad Adventure' },
  { id: 'a-2', name: 'Atlas Mountains Trek' }
];

// Sample users for form (can be replaced with real user API later)
const sampleUsers = [
  { id: 'user-1', name: 'Ahmed El Idrissi' },
  { id: 'user-2', name: 'Sarah Johnson' },
  { id: 'user-3', name: 'Mohammed Alami' },
  { id: 'user-4', name: 'Fatima Zahra' },
  { id: 'user-5', name: 'Laura Chen' }
];

const getUserOptions = () => sampleUsers.map((user) => ({ value: user.id, label: user.name }));

const FormReview = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const { hotels: hotelsEntities, loadHotels } = useHotels();
  const { spots: spotsEntities, loadSpots } = useTouristSpots();
  const [isModerationMode, setIsModerationMode] = useState(false);
  
  // Convert entities to flat format for form
  const touristSpots = useMemo(() => {
    return spotsEntities.map(spot => ({
      id: spot.id,
      name: spot.name,
      nameTranslations: { en: spot.name }
    }));
  }, [spotsEntities]);
  
  const hotels = useMemo(() => {
    return hotelsEntities.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      nameTranslations: { en: hotel.name }
    }));
  }, [hotelsEntities]);

  const [formData, setFormData] = useState({
    message: '',
    rating: 0,
    status: REVIEW_STATUS.PENDING,
    rejectionReason: '',
    userId: sampleUsers[0]?.id || '',
    entityType: 'spot',
    entityId: ''
  });

  // Load entities from API
  useEffect(() => {
    const loadEntities = async () => {
      try {
        await Promise.all([
          loadSpots(),
          loadHotels()
        ]);
        
        // Set default entityId if available
        if (spotsEntities.length > 0) {
          setFormData(prev => ({ ...prev, entityId: spotsEntities[0].id }));
        }
      } catch (error) {
        console.error('Error loading entities:', error);
      }
    };
    
    loadEntities();
  }, [loadSpots, loadHotels, spotsEntities]);

  const currentEntityOptions = useMemo(() => {
    let entities = [];
    
    switch (formData.entityType) {
      case 'spot':
        entities = touristSpots.map(spot => ({
          id: spot.id,
          name: spot.nameTranslations?.en || spot.name
        }));
        break;
      case 'hotel':
        entities = hotels.map(hotel => ({
          id: hotel.id,
          name: hotel.nameTranslations?.en || hotel.name
        }));
        break;
      case 'activity':
        entities = activityOptions;
        break;
      default:
        entities = [];
    }
    
    return entities.map((entity) => ({
      value: entity.id,
      label: entity.name
    }));
  }, [formData.entityType, touristSpots, hotels]);

  const handleInputChange = (field) => (event) => {
    const value = event?.target?.value ?? event;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      status: value,
      rejectionReason: value === REVIEW_STATUS.REJECTED ? prev.rejectionReason : ''
    }));
  };

  const handleEntityTypeChange = (event) => {
    const newType = event.target.value;
    let firstEntityId = '';
    
    switch (newType) {
      case 'spot':
        firstEntityId = touristSpots[0]?.id || '';
        break;
      case 'hotel':
        firstEntityId = hotels[0]?.id || '';
        break;
      case 'activity':
        firstEntityId = activityOptions[0]?.id || '';
        break;
    }
    
    setFormData({
      ...formData,
      entityType: newType,
      entityId: firstEntityId
    });
  };

  const handleToggleModeration = (event) => {
    setIsModerationMode(event.target.checked);
  };

  const handleBack = () => {
    navigate('/services/reviews');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedData = {
      ...formData,
      rating: Number(formData.rating),
      rejectionReason: formData.status === REVIEW_STATUS.REJECTED ? formData.rejectionReason : '',
      entityId: formData.entityId,
      createdAt: new Date().toISOString()
    };

    console.log('Review form submitted:', formattedData);
    showSuccess('Review saved successfully!');
    navigate('/services/reviews');
  };

  return (
    <div className="form-review-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-button">
          <ArrowBackIcon />
          Back
        </button>
        <div className="header-content">
          <Typography variant="h4" className="form-title">
            Reviews Management
          </Typography>
          <Typography variant="body1" color="textSecondary" className="form-subtitle">
            Create or edit a review
          </Typography>
        </div>
      </div>

      <div className="form-content">
        <Card className="form-card">
          <CardContent>
            <form onSubmit={handleSubmit} className="review-form">
              {/* Moderation Mode */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Moderation Mode
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isModerationMode}
                      onChange={handleToggleModeration}
                      color="primary"
                      className="moderation-switch"
                    />
                  }
                  label="Enable moderation mode"
                  className="moderation-label"
                />
                {isModerationMode && (
                  <Alert severity="info" className="moderation-alert">
                    Moderation mode enabled - You can modify status and rejection reason
                  </Alert>
                )}
              </Box>

              <Divider className="form-divider" />

              {/* Review Content */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Review Content
                </Typography>
                
                <Box className="form-group">
                  <Typography variant="subtitle1" className="field-label">
                    Message *
                  </Typography>
                  <textarea
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    rows={4}
                    className="message-textarea"
                    readOnly={isModerationMode}
                    required
                    placeholder="Describe your experience..."
                  />
                </Box>

                <Box className="form-group">
                  <Typography variant="subtitle1" className="field-label">
                    Rating *
                  </Typography>
                  <Box className="rating-container">
                    <Rating
                      name="rating"
                      value={Number(formData.rating)}
                      onChange={(_, value) => handleInputChange('rating')(value || 0)}
                      required
                      size="large"
                      icon={<StarIcon fontSize="inherit" />}
                      className="rating-input"
                    />
                    <Typography variant="body2" color="textSecondary" className="rating-hint">
                      {formData.rating > 0 ? `${formData.rating}/5 stars` : 'Select a rating'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider className="form-divider" />

              {/* Status and Moderation */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Status and Moderation
                </Typography>
                
                <Box className="form-group">
                  <FormControl fullWidth className="select-field">
                    <InputLabel>Status *</InputLabel>
                    <Select 
                      value={formData.status} 
                      label="Status *" 
                      onChange={handleStatusChange} 
                      required
                    >
                      {REVIEW_STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box className="status-option">
                            <Chip 
                              label={option.label} 
                              size="small" 
                              color={
                                option.value === 'APPROVED' ? 'success' :
                                option.value === 'REJECTED' ? 'error' :
                                option.value === 'PENDING' ? 'warning' : 'default'
                              }
                              variant="outlined"
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {formData.status === REVIEW_STATUS.REJECTED && (
                  <Box className="form-group">
                    <Typography variant="subtitle1" className="field-label">
                      Rejection Reason *
                    </Typography>
                    <textarea
                      value={formData.rejectionReason}
                      onChange={handleInputChange('rejectionReason')}
                      rows={3}
                      className="rejection-textarea"
                      required
                      placeholder="Explain why this review is rejected..."
                    />
                  </Box>
                )}
              </Box>

              <Divider className="form-divider" />

              {/* User and Entity */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  User and Entity
                </Typography>
                
                <Box className="form-group">
                  <FormControl fullWidth className="select-field">
                    <InputLabel>User *</InputLabel>
                    <Select 
                      value={formData.userId} 
                      label="User *" 
                      onChange={handleInputChange('userId')} 
                      required
                    >
                      {getUserOptions().map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box className="form-row">
                  <Box className="form-group">
                    <FormControl fullWidth className="select-field">
                      <InputLabel>Entity Type *</InputLabel>
                      <Select 
                        value={formData.entityType} 
                        label="Entity Type *" 
                        onChange={handleEntityTypeChange} 
                        required
                      >
                        {REVIEW_ENTITY_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="form-group">
                    <FormControl fullWidth className="select-field">
                      <InputLabel>Entity *</InputLabel>
                      <Select 
                        value={formData.entityId} 
                        label="Entity *" 
                        onChange={handleInputChange('entityId')} 
                        required
                      >
                        {currentEntityOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>

              <Divider className="form-divider" />

              {/* Actions */}
              <Box className="form-actions">
                <button type="button" onClick={handleBack} className="cancel-button">
                  <CancelIcon />
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  <SaveIcon />
                  Save
                </button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormReview;
