import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/useTheme';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
      <IconButton 
        onClick={toggleTheme} 
        color="inherit"
        sx={{ 
          ml: 1,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
