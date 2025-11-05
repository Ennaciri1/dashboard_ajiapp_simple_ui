import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import './AppBar.css';

const AppBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/features':
        return 'Features';
      case '/services/tourist-spots':
        return 'Tourist Spots Management';
      case '/services/tourist-spots/formSpots':
        return 'Add Tourist Spot';
      case '/services/cities':
        return 'Cities Management';
      case '/services/cities/formCity':
        return 'Add City';
      case '/services/reviews':
        return 'Reviews Management';
      case '/services/reviews/formReview':
        return 'Review Details';
      case '/services/events':
        return 'Events Management';
      case '/services/activities':
        return 'Activities Management';
      case '/services/contact':
        return 'Contact Management';
      case '/services/contact/formContact':
        return 'Add Contact';
      case '/services/hotels':
        return 'Hotels Management';
      case '/services/stadiums':
        return 'Stadiums Management';
      case '/services/visa':
        return 'Visa Management';
      case '/services/visa/formVisa':
        return 'Add Visa Requirement';
      case '/users/admin':
        return 'Admin Panel';
      case '/users/portal/activities':
        return 'Activities Users Management';
      case '/users/portal/activities/add-user':
        return 'Add Activity User';
      case '/users/portal/hotels':
        return 'Hotels Users Management';
      case '/users/user':
        return 'User Management';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      default:
        return 'Simple UI';
    }
  };

  return (
    <MuiAppBar
      position="fixed"
      className="app-bar"
      sx={{
        width: { xs: '100%', sm: 'calc(100% - 240px)' },
        ml: { xs: 0, sm: '240px' },
        backgroundColor: 'var(--background-paper)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-light)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 1100,
      }}
    >
      <Toolbar className="app-bar-toolbar">
        <Typography variant="h14" component="div" className="app-bar-title">
          {getPageTitle()}
        </Typography>
        
        <Box className="app-bar-actions">
          <IconButton className="search-button">
            <SearchIcon />
          </IconButton>
          
          <IconButton 
            className="notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <NotificationsIcon />
          </IconButton>
          
          <Box className="user-profile-section">
            <Avatar 
              src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
              alt={user?.fullName || user?.email || 'User profile'}
              className="user-avatar"
            />
            <Typography variant="body2" className="user-name">
              {user?.fullName || user?.email || 'User'}
            </Typography>
            <IconButton
              className="user-menu-button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <ArrowDownIcon />
            </IconButton>
            {isMenuOpen && (
              <Box className="user-menu">
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    navigate('/login', { replace: true });
                  }}
                >
                  Sign Out
                </button>
              </Box>
            )}
          </Box>
          
          <ThemeToggle />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
