import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, CheckCircle as SuccessIcon, Error as ErrorIcon } from '@mui/icons-material';
import './Notification.css';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4caf50',
          borderLeft: '4px solid #2e7d32'
        };
      case 'error':
        return {
          backgroundColor: '#f44336',
          borderLeft: '4px solid #c62828'
        };
      default:
        return {
          backgroundColor: '#2196f3',
          borderLeft: '4px solid #1565c0'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: 'white', fontSize: 20 }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'white', fontSize: 20 }} />;
      default:
        return <SuccessIcon sx={{ color: 'white', fontSize: 20 }} />;
    }
  };

  if (!isVisible) return null;

  return (
    <Box
      className={`notification notification-${isVisible ? 'show' : 'hide'}`}
      sx={{
        ...getNotificationStyles(),
        position: 'fixed',
        top: '20px',
        right: '20px',
        minWidth: '300px',
        maxWidth: '400px',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        color: 'white'
      }}
    >
      {getIcon()}
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          color: 'white',
          fontWeight: 500,
          lineHeight: 1.4
        }}
      >
        {message}
      </Typography>
      <IconButton
        onClick={handleClose}
        size="small"
        sx={{
          color: 'white',
          padding: '4px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};

export default Notification;
