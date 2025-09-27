import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './router';
import { RouterProvider } from "react-router-dom";
import { CustomThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
