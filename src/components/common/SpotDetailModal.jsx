import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Card,
  CardMedia,
  IconButton,
  Skeleton,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  PhotoLibrary as ImageIcon
} from '@mui/icons-material';

const SpotDetailModal = React.memo(({ open, onClose, spot }) => {
  const [imageLoading, setImageLoading] = React.useState({});
  const [imageErrors, setImageErrors] = React.useState({});

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  React.useEffect(() => {
    if (open && spot?.images) {
      // Reset states when modal opens
      setImageLoading({});
      setImageErrors({});
    }
  }, [open, spot?.id]);

  // Gérer le focus initial du modal
  React.useEffect(() => {
    if (open) {
      // S'assurer que le modal reçoit le focus
      setTimeout(() => {
        const dialog = document.querySelector('[role="dialog"]');
        if (dialog) {
          dialog.focus();
        }
      }, 100);
    }
  }, [open]);
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      disableScrollLock
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={false}
      keepMounted={false}
      PaperProps={{
        sx: { 
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
      TransitionProps={{
        timeout: 200
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {spot?.nameTranslations?.en || spot?.name || 'Tourist Spot Details'}
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          aria-label="Close dialog"
          tabIndex={0}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!spot ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
          {/* Images Section */}
          {spot.images && spot.images.length > 0 && (
            <Grid size={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon color="primary" />
                  Images ({spot.images.length})
                </Typography>
                <Grid container spacing={2}>
                  {spot.images.map((image, index) => {
                    const imageKey = `${spot.id}-image-${index}`;
                    const fullImageUrl = image.url ? `${baseURL}${image.url}` : null;
                    const hasError = imageErrors[imageKey];
                    const isLoading = imageLoading[imageKey] === true;
                    
                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={imageKey}>
                        <Card sx={{ maxWidth: 200, mx: 'auto' }}>
                          <Box sx={{ position: 'relative', height: 150 }}>
                            {isLoading && (
                              <Skeleton 
                                variant="rectangular" 
                                width="100%" 
                                height={150}
                                sx={{ position: 'absolute', top: 0, left: 0 }}
                              />
                            )}
                            
                            {!hasError && fullImageUrl && (
                              <img
                                src={fullImageUrl}
                                alt={`${spot.name || 'Tourist spot'} - Image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: isLoading ? 'none' : 'block'
                                }}
                                onLoad={() => {
                                  setImageLoading(prev => ({ ...prev, [imageKey]: false }));
                                }}
                                onError={() => {
                                  setImageLoading(prev => ({ ...prev, [imageKey]: false }));
                                  setImageErrors(prev => ({ ...prev, [imageKey]: true }));
                                }}
                              />
                            )}
                            
                            {hasError && (
                              <Box sx={{ 
                                height: 150, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                backgroundColor: 'grey.100',
                                flexDirection: 'column',
                                gap: 1
                              }}>
                                <Typography variant="caption" color="text.secondary">
                                  Image failed to load
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  {fullImageUrl}
                                </Typography>
                              </Box>
                            )}
                            
                            {!fullImageUrl && (
                              <Box sx={{ 
                                height: 150, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                backgroundColor: 'grey.100',
                                flexDirection: 'column',
                                gap: 1
                              }}>
                                <Typography variant="caption" color="text.secondary">
                                  No image URL
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          {image.owner && (
                            <Box sx={{ p: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Owner: {image.owner}
                              </Typography>
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>
          )}

          {/* Basic Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Basic Information
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">
                {spot.descriptionTranslations?.en || spot.description || 'No description available'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" color="action" />
                {spot.addressTranslations?.en || spot.address || 'No address available'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                City
              </Typography>
              <Typography variant="body1">
                {spot.cityName || 'Unknown'}
              </Typography>
            </Box>
          </Grid>

          {/* Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Details
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Entry Type
              </Typography>
              <Chip 
                label={spot.paidEntry ? 'Paid Entry' : 'Free Entry'} 
                color={spot.paidEntry ? 'primary' : 'success'}
                icon={spot.paidEntry ? <MoneyIcon /> : null}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Opening Hours
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon fontSize="small" color="action" />
                {spot.openingTime || 'N/A'} - {spot.closingTime || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label={spot.active ? 'Active' : 'Inactive'} 
                color={spot.active ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {spot.location && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location Coordinates
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {spot.location.latitude}, {spot.location.longitude}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Additional Info */}
          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom color="primary">
              Additional Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">
                  {spot.createdAt ? new Date(spot.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {spot.updatedAt ? new Date(spot.updatedAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1">
                  {spot.createdBy || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Updated By
                </Typography>
                <Typography variant="body1">
                  {spot.updatedBy || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          aria-label="Close dialog"
          tabIndex={0}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

SpotDetailModal.displayName = 'SpotDetailModal';

export default SpotDetailModal;
