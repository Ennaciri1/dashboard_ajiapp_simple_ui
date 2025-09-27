import React, { useMemo, useState } from 'react';
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
import { sampleTouristSpots } from '../touristSpots';
import { sampleHotels } from '../hotels';
import {
  REVIEW_STATUS,
  REVIEW_STATUS_OPTIONS,
  REVIEW_ENTITY_OPTIONS,
  sampleReviewUsers
} from './index';
import { useNotification } from '../../contexts/NotificationContext';
import './FormReview.css';

const activityOptions = [
  { id: 'a-1', name: 'Desert Quad Adventure' },
  { id: 'a-2', name: 'Atlas Mountains Trek' }
];

const entityMap = {
  spot: sampleTouristSpots.map((spot) => ({ id: spot.id, name: spot.name })),
  hotel: sampleHotels.map((hotel) => ({ id: hotel.id, name: hotel.name })),
  activity: activityOptions
};

const getUserOptions = () => sampleReviewUsers.map((user) => ({ value: user.id, label: user.name }));

const FormReview = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [isModerationMode, setIsModerationMode] = useState(false);

  const [formData, setFormData] = useState({
    message: '',
    rating: 0,
    status: REVIEW_STATUS.PENDING,
    rejectionReason: '',
    userId: sampleReviewUsers[0]?.id || '',
    entityType: 'spot',
    entityId: sampleTouristSpots[0]?.id || ''
  });

  const entityOptions = useMemo(() => entityMap[formData.entityType] || [], [formData.entityType]);

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
    const type = event.target.value;
    const options = entityMap[type] || [];
    setFormData((prev) => ({
      ...prev,
      entityType: type,
      entityId: options[0]?.id || ''
    }));
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
          Retour
        </button>
        <div className="header-content">
          <Typography variant="h4" className="form-title">
            Gestion d'Avis
          </Typography>
          <Typography variant="body1" color="textSecondary" className="form-subtitle">
            Créer ou modifier un avis
          </Typography>
        </div>
      </div>

      <div className="form-content">
        <Card className="form-card">
          <CardContent>
            <form onSubmit={handleSubmit} className="review-form">
              {/* Mode de modération */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Mode de Modération
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
                  label="Activer le mode modération"
                  className="moderation-label"
                />
                {isModerationMode && (
                  <Alert severity="info" className="moderation-alert">
                    Mode modération activé - Vous pouvez modifier le statut et la raison de rejet
                  </Alert>
                )}
              </Box>

              <Divider className="form-divider" />

              {/* Contenu de l'avis */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Contenu de l'Avis
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
                    placeholder="Décrivez votre expérience..."
                  />
                </Box>

                <Box className="form-group">
                  <Typography variant="subtitle1" className="field-label">
                    Note *
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
                      {formData.rating > 0 ? `${formData.rating}/5 étoiles` : 'Sélectionnez une note'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider className="form-divider" />

              {/* Statut et modération */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Statut et Modération
                </Typography>
                
                <Box className="form-group">
                  <FormControl fullWidth className="select-field">
                    <InputLabel>Statut *</InputLabel>
                    <Select 
                      value={formData.status} 
                      label="Statut *" 
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
                      Raison du rejet *
                    </Typography>
                    <textarea
                      value={formData.rejectionReason}
                      onChange={handleInputChange('rejectionReason')}
                      rows={3}
                      className="rejection-textarea"
                      required
                      placeholder="Expliquez pourquoi cet avis est rejeté..."
                    />
                  </Box>
                )}
              </Box>

              <Divider className="form-divider" />

              {/* Utilisateur et entité */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Utilisateur et Entité
                </Typography>
                
                <Box className="form-group">
                  <FormControl fullWidth className="select-field">
                    <InputLabel>Utilisateur *</InputLabel>
                    <Select 
                      value={formData.userId} 
                      label="Utilisateur *" 
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
                      <InputLabel>Type d'entité *</InputLabel>
                      <Select 
                        value={formData.entityType} 
                        label="Type d'entité *" 
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
                      <InputLabel>Entité *</InputLabel>
                      <Select 
                        value={formData.entityId} 
                        label="Entité *" 
                        onChange={handleInputChange('entityId')} 
                        required
                      >
                        {entityOptions.map((option) => (
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
                  Annuler
                </button>
                <button type="submit" className="save-button">
                  <SaveIcon />
                  Enregistrer
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
