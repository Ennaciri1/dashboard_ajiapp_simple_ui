import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HotelIcon from '@mui/icons-material/Hotel';
import StadiumIcon from '@mui/icons-material/Stadium';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonIcon from '@mui/icons-material/Person';
import List from '@mui/material/List';
import { useState } from 'react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/useTheme';
import './Drawer.css';
const drawerWidth = 240;

// Main menu
const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Features', icon: <StarIcon />, path: '/features' }
];

// Services menu with submenus
const servicesMenu = {
    text: 'Services',
    icon: <BusinessIcon />,
    submenu: [
        { text: 'Events', icon: <EventIcon />, path: '/services/events' },
        { text: 'Cities', icon: <LocationCityIcon />, path: '/services/cities' },
        { text: 'Tourist Spots', icon: <PlaceIcon />, path: '/services/tourist-spots' },
        { text: 'Reviews', icon: <RateReviewIcon />, path: '/services/reviews' },
        { text: 'Activities', icon: <SportsSoccerIcon />, path: '/services/activities' },
        { text: 'Contact', icon: <ContactMailIcon />, path: '/services/contact' },
        { text: 'Hotels', icon: <HotelIcon />, path: '/services/hotels' },
        { text: 'Stadiums', icon: <StadiumIcon />, path: '/services/stadiums' },
        { text: 'Visa', icon: <CardTravelIcon />, path: '/services/visa' },
        { text: 'Languages', icon: <LanguageIcon />, path: '/services/languages' },
        { text: 'Translations', icon: <TranslateIcon />, path: '/services/translations' }
    ]
};

// Portal submenu with nested submenus
const portalSubmenu = {
    text: 'Portal',
    icon: <AccountBoxIcon />,
    submenu: [
        { text: 'Activities Users', icon: <SportsSoccerIcon />, path: '/users/portal/activities' },
        { text: 'Hotels Users', icon: <HotelIcon />, path: '/users/portal/hotels' }
    ]
};

// Users menu with submenus
const usersMenu = {
    text: 'Users',
    icon: <PeopleIcon />,
    submenu: [
        { text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/users/admin' },
        portalSubmenu,
        { text: 'User', icon: <PersonIcon />, path: '/users/user' }
    ]
};


const Drawer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode } = useTheme();

    const drawerPaperStyles = {
        width: drawerWidth,
        boxSizing: 'border-box',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 1200,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    };
    
    // States to manage opening/closing of submenus
    const [servicesOpen, setServicesOpen] = useState(false);
    const [usersOpen, setUsersOpen] = useState(false);
    const [portalOpen, setPortalOpen] = useState(false);

    // Function to render a simple menu item
    const renderMenuItem = (item) => (
        <ListItem key={item.path} disablePadding className="menu-item">
            <ListItemButton
                onClick={() => navigate(item.path)}
                className={`menu-item-button ${location.pathname === item.path ? 'active' : ''}`}
            >
                <ListItemIcon className="menu-item-icon">
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} className="menu-item-text" />
            </ListItemButton>
        </ListItem>
    );

    // Function to render a menu with submenus
    const renderMenuWithSubmenu = (menu, isOpen, setIsOpen) => (
        <>
            <ListItem disablePadding className="menu-item">
                <ListItemButton
                    onClick={() => setIsOpen(!isOpen)}
                    className="menu-item-button menu-item-with-submenu"
                >
                    <ListItemIcon className="menu-item-icon">
                        {menu.icon}
                    </ListItemIcon>
                    <ListItemText primary={menu.text} className="menu-item-text" />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className="submenu-list">
                    {menu.submenu.map((subItem) => {
                        // Check if this submenu item has its own submenu (nested)
                        if (subItem.submenu && Array.isArray(subItem.submenu)) {
                            return (
                                <React.Fragment key={subItem.text}>
                                    {renderNestedSubmenu(subItem, portalOpen, setPortalOpen)}
                                </React.Fragment>
                            );
                        }
                        // Regular submenu item
                        return (
                            <ListItem key={subItem.path || subItem.text} disablePadding className="submenu-item">
                                <ListItemButton
                                    onClick={() => navigate(subItem.path)}
                                    className={`submenu-button ${location.pathname === subItem.path ? 'active' : ''}`}
                                >
                                    <ListItemIcon className="submenu-icon">
                                        {subItem.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={subItem.text} className="submenu-text" />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Collapse>
        </>
    );

    // Function to render nested submenu (for Portal submenu)
    const renderNestedSubmenu = (menu, isOpen, setIsOpen) => (
        <>
            <ListItem disablePadding className="submenu-item">
                <ListItemButton
                    onClick={() => setIsOpen(!isOpen)}
                    className="submenu-button submenu-with-nested"
                >
                    <ListItemIcon className="submenu-icon">
                        {menu.icon}
                    </ListItemIcon>
                    <ListItemText primary={menu.text} className="submenu-text" />
                    {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemButton>
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className="nested-submenu-list">
                    {menu.submenu.map((nestedItem) => (
                        <ListItem key={nestedItem.path} disablePadding className="nested-submenu-item">
                            <ListItemButton
                                onClick={() => navigate(nestedItem.path)}
                                className={`nested-submenu-button ${location.pathname === nestedItem.path ? 'active' : ''}`}
                            >
                                <ListItemIcon className="nested-submenu-icon">
                                    {nestedItem.icon}
                                </ListItemIcon>
                                <ListItemText primary={nestedItem.text} className="nested-submenu-text" />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </>
    );
    
    return (
        
        <MuiDrawer
            className="drawer"
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': drawerPaperStyles,
            }}
        >
            <Box className="drawer-content">
                {/* Header */}
                <Box className="drawer-header">
                    <Typography className="drawer-logo">
                        Simple UI
                    </Typography>
                    <Typography className="drawer-subtitle">
                        Management System
                    </Typography>
                </Box>
                <Divider className="drawer-divider" />

            {/* Main menu */}
            <List className="menu-list">
                {mainMenuItems.map(renderMenuItem)}
            </List>

                <Divider className="drawer-divider" />

                {/* Services menu with submenus */}
                <List className="menu-list">
                    {renderMenuWithSubmenu(servicesMenu, servicesOpen, setServicesOpen)}
                </List>

                <Divider className="drawer-divider" />

                {/* Users menu with submenus */}
                <List className="menu-list">
                    {renderMenuWithSubmenu(usersMenu, usersOpen, setUsersOpen)}
                </List>
            </Box>
        </MuiDrawer>
    );
};

export default Drawer;
