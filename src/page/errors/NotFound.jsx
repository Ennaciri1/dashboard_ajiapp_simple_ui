import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" className="not-found-container">
      <Paper elevation={3} className="not-found-paper">
        <Box className="not-found-content">
          <ErrorIcon className="not-found-icon" />
          
          <Typography variant="h1" className="not-found-title">
            404
          </Typography>
          
          <Typography variant="h4" className="not-found-subtitle" gutterBottom>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" className="not-found-message" paragraph>
            The page you are looking for does not exist or has been moved.
          </Typography>
          
          {location.pathname && (
            <Box className="not-found-path">
              <Typography variant="body2" color="text.secondary">
                Requested path: <code>{location.pathname}</code>
              </Typography>
            </Box>
          )}
          
          <Box className="not-found-actions">
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              size="large"
              sx={{ mr: 2 }}
            >
              Go to Home
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              size="large"
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;


