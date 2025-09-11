import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './router';
import { RouterProvider } from "react-router-dom";
import { CustomThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <RouterProvider router={router} />
    </CustomThemeProvider>
  </React.StrictMode>
);
