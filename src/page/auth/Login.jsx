import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../contexts/AuthContext';
import { login as loginService } from '../../infrastructure/api/authService';
import { isRoleAllowed } from '../../constants/auth';
import './Login.css';

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await loginService({ email, password });
      login(result);
      navigate('/', { replace: true });
    } catch (requestError) {
      if (requestError?.code === 'FORBIDDEN_ROLE' || !isRoleAllowed(requestError?.payload?.data?.roles?.[0])) {
        setError('You must have ADMIN or SUPERADMIN role to access the dashboard.');
      } else {
        const message = requestError?.response?.data?.message || requestError?.message || 'Connection failed.';
        setError(message);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="login-container">
      <Paper elevation={3} className="login-card">
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" paragraph>
          Only users with ADMIN or SUPERADMIN roles can access the dashboard.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
