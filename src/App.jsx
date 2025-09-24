import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from './components/Drawer/Drawer';
import AppBar from './components/AppBar/AppBar';
import { Outlet } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

export default function PermanentDrawerLeft() {
  return (
    <NotificationProvider>
      <Box className="app-container">
        <Drawer />
        <Box component="main" className="app-main-content">
          <AppBar />
          <Box className="app-content">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </NotificationProvider>
  );
}
