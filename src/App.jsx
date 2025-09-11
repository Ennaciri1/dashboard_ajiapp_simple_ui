import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from './components/Drawer/Drawer';
import AppBar from './components/AppBar/AppBar';
import { Outlet } from 'react-router-dom';
import './App.css';

export default function PermanentDrawerLeft() {
  return (
    <Box className="app-container">
      <AppBar />
      <Drawer />
      <Box component="main" className="app-main-content">
        <Toolbar /> {/* Espace pour l'AppBar fixe */}
        <Outlet />
      </Box>
    </Box>
  );
}
