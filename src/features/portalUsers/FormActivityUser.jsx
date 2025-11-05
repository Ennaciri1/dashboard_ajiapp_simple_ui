import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useNotification } from '../../contexts/NotificationContext';
import { portalUserService } from '../../infrastructure/api/portalUserService';
import './FormActivityUser.css';

const FormActivityUser = () => {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleBack = () => {
    if (activityId) {
      navigate(`/users/portal/activities`);
    } else {
      navigate('/users/portal/activities');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await portalUserService.createActivityUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      showSuccess('Activity user created successfully!');
      handleBack();
    } catch (error) {
      console.error('Error creating activity user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create activity user';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="global-container">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Activity User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a new user for activities
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="activity-user-form">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName}
                placeholder="John Doe"
              />

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="john.doe@example.com"
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password || 'Minimum 6 characters'}
                placeholder="Enter password"
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormActivityUser;


