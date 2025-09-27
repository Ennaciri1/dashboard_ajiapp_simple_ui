import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

/**
 * Composant UI pur pour afficher une note avec des étoiles
 */
const RatingDisplay = ({ 
  value, 
  max = 5, 
  showValue = true, 
  showLabel = false,
  label = 'Note',
  size = 'medium',
  precision = 0.5,
  readOnly = true,
  color = 'primary'
}) => {
  if (value === null || value === undefined) {
    return (
      <Typography variant="body2" color="textSecondary">
        Pas de note
      </Typography>
    );
  }

  const sizeMap = {
    small: { fontSize: '1rem', spacing: 1 },
    medium: { fontSize: '1.2rem', spacing: 1.5 },
    large: { fontSize: '1.5rem', spacing: 2 }
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  return (
    <Box display="flex" alignItems="center" gap={currentSize.spacing}>
      {showLabel && (
        <Typography variant="body2" color="textSecondary">
          {label}:
        </Typography>
      )}
      
      <Rating
        value={value}
        max={max}
        precision={precision}
        readOnly={readOnly}
        size={size}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" />}
        sx={{
          color: `${color}.main`,
          '& .MuiRating-iconEmpty': {
            color: 'action.disabled'
          }
        }}
      />
      
      {showValue && (
        <Typography 
          variant="body2" 
          color="textPrimary"
          sx={{ 
            fontWeight: 'medium',
            fontSize: currentSize.fontSize 
          }}
        >
          {value.toFixed(1)}/{max}
        </Typography>
      )}
    </Box>
  );
};

export default RatingDisplay;
