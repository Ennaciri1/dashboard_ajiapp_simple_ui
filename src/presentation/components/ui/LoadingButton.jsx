import React from 'react';
import { Button, CircularProgress } from '@mui/material';

/**
 * Composant UI pur pour un bouton avec état de chargement
 */
const LoadingButton = ({
  loading = false,
  disabled = false,
  children,
  loadingText = 'Chargement...',
  startIcon,
  endIcon,
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  onClick,
  ...props
}) => {
  const isDisabled = disabled || loading;
  
  const loadingIcon = (
    <CircularProgress 
      size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
      color="inherit" 
    />
  );

  return (
    <Button
      disabled={isDisabled}
      startIcon={loading ? loadingIcon : startIcon}
      endIcon={!loading ? endIcon : undefined}
      size={size}
      variant={variant}
      color={color}
      onClick={onClick}
      {...props}
    >
      {loading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
