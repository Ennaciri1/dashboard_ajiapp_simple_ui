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
  IconButton,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  Label as LabelIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import './EntityDetailModal.css';

/**
 * Composant générique pour afficher les détails d'une entité
 * @param {Object} props
 * @param {boolean} props.open - État d'ouverture du modal
 * @param {Function} props.onClose - Fonction de fermeture
 * @param {Object} props.entity - L'entité à afficher
 * @param {Object} props.config - Configuration pour personnaliser l'affichage
 * @param {string} props.config.title - Titre principal (par défaut: entity.name ou entity.title)
 * @param {string} props.config.subtitle - Sous-titre (par défaut: ID)
 * @param {ReactNode} props.config.icon - Icône à afficher dans l'avatar
 * @param {Array} props.config.sections - Sections à afficher
 * @param {string} props.config.sections[].title - Titre de la section
 * @param {Array} props.config.sections[].fields - Champs à afficher dans la section
 * @param {string} props.config.sections[].fields[].label - Label du champ
 * @param {string|Function} props.config.sections[].fields[].value - Valeur ou fonction pour obtenir la valeur
 * @param {ReactNode} props.config.sections[].fields[].icon - Icône optionnelle
 * @param {string} props.config.sections[].fields[].type - Type: 'text', 'number', 'price', 'date', 'location', 'boolean', 'chip', 'images', 'tags'
 * @param {number} props.config.sections[].fields[].gridSize - Taille de la grille (xs={gridSize})
 */
const EntityDetailModal = ({ open, onClose, entity, config }) => {
  // Vérifier que entity et config existent avant de continuer
  if (!entity || !config) return null;
  
  // Si le modal n'est pas ouvert, ne rien rendre
  if (!open) return null;

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Formatters
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    if (typeof price === 'object' && price.minPrice !== undefined) {
      return `$${price.minPrice.toFixed(2)} - $${price.maxPrice.toFixed(2)}`;
    }
    return `$${Number(price).toFixed(2)}`;
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location === 'object') {
      if (location.latitude && location.longitude) {
        return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
      }
      if (location.address) {
        return location.address;
      }
    }
    return String(location);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatBoolean = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return value ? 'Yes' : 'No';
  };

  const getFieldValue = (field, entity) => {
    if (typeof field.value === 'function') {
      try {
        return field.value(entity);
      } catch (error) {
        console.error('Error getting field value:', error);
        return null;
      }
    }
    if (typeof field.value === 'string') {
      // Support nested paths like "location.latitude"
      const keys = field.value.split('.');
      let value = entity;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined || value === null) break;
      }
      return value;
    }
    return entity?.[field.value];
  };

  const renderField = (field, entity) => {
    const value = getFieldValue(field, entity);
    const type = field.type || 'text';
    const gridSize = field.gridSize || 12;

    let content = null;

    switch (type) {
      case 'price':
        content = (
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatPrice(value)}
          </Typography>
        );
        break;

      case 'number':
        content = (
          <Typography variant="h5" fontWeight="bold">
            {value ?? 0}
          </Typography>
        );
        break;

      case 'date':
        content = (
          <Typography variant="body1" fontWeight="500">
            {formatDateTime(value)}
          </Typography>
        );
        break;

      case 'location':
        content = (
          <>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {formatLocation(value)}
            </Typography>
            {value?.valid && (
              <Chip
                label="Valid Location"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </>
        );
        break;

      case 'boolean':
        content = (
          <Chip
            label={formatBoolean(value)}
            color={value ? 'success' : 'default'}
            size="small"
          />
        );
        break;

      case 'chip':
        content = (
          <Chip
            label={value || 'N/A'}
            color="primary"
            variant="outlined"
            size="small"
          />
        );
        break;

      case 'images':
        if (!value || !Array.isArray(value) || value.length === 0) {
          content = <Typography variant="body2" color="text.secondary">No images</Typography>;
        } else {
          content = (
            <Grid container spacing={2}>
              {value.map((imageUrl, index) => {
                const fullImageUrl = typeof imageUrl === 'string'
                  ? (imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`)
                  : (imageUrl.url || imageUrl);
                
                // Placeholder SVG inline pour les images qui ne se chargent pas
                const placeholderSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                  <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="300" height="200" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
                      Image Not Found
                    </text>
                  </svg>
                `)}`;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      component="img"
                      src={fullImageUrl}
                      alt={`Image ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                      onError={(e) => {
                        // Empêcher la boucle infinie en vérifiant si on n'a pas déjà l'image placeholder
                        if (e.target.src !== placeholderSvg) {
                          e.target.src = placeholderSvg;
                        }
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          );
        }
        break;

      case 'tags':
        if (!value || !Array.isArray(value) || value.length === 0) {
          content = <Typography variant="body2" color="text.secondary">No tags</Typography>;
        } else {
          content = (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {value.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="medium"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          );
        }
        break;

      case 'text':
      default:
        if (field.multiline) {
          content = (
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
              {value || 'N/A'}
            </Typography>
          );
        } else {
          content = (
            <Typography variant="body1" sx={{ fontFamily: field.monospace ? 'monospace' : 'inherit', fontSize: field.monospace ? '0.875rem' : 'inherit', wordBreak: 'break-all' }}>
              {value || 'N/A'}
            </Typography>
          );
        }
        break;
    }

    return (
      <Grid item xs={12} sm={gridSize} key={field.label}>
        <Box>
          {field.label && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              {field.icon && React.cloneElement(field.icon, { color: 'primary', fontSize: 'small' })}
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                {field.label}
              </Typography>
            </Box>
          )}
          {content}
        </Box>
      </Grid>
    );
  };

  const title = typeof config.title === 'function' 
    ? config.title(entity) 
    : (config.title || entity.name || entity.title || entity.fullName || 'Details');
  const subtitle = typeof config.subtitle === 'function'
    ? config.subtitle(entity)
    : (config.subtitle || `ID: ${entity.id || 'N/A'}`);
  const icon = config.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && (
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
              {icon}
            </Avatar>
          )}
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close dialog"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {config.sections && config.sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {section.title && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mb: section.fields ? 1.5 : 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {section.icon && React.cloneElement(section.icon, { color: 'primary' })}
                    {section.title}
                  </Typography>
                  {section.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {section.description}
                    </Typography>
                  )}
                </Grid>
              )}

              {section.fields && (
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {section.fields.map((field) => renderField(field, entity))}
                  </Grid>
                </Grid>
              )}

              {sectionIndex < config.sections.length - 1 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, px: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ minWidth: 120 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntityDetailModal;

