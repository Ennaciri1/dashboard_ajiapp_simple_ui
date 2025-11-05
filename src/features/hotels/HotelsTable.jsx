import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
  Hotel as HotelIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

const HotelsTable = ({ 
  hotels, 
  selectedHotels, 
  onSelectAll, 
  onSelectHotel, 
  onMenuClick 
}) => {
  const getStatusColor = (active) => {
    return active ? 'success' : 'error';
  };

  const getStatusLabel = (active) => {
    return active ? 'Active' : 'Inactive';
  };

  const formatPriceRange = (priceRange) => {
    console.log('HotelsTable - formatPriceRange - priceRange:', priceRange);
    if (!priceRange) {
      return 'N/A';
    }
    // Handle both object format { minPrice, maxPrice } and direct values
    const minPrice = priceRange.minPrice || priceRange.min || 0;
    const maxPrice = priceRange.maxPrice || priceRange.max || 0;
    if (!minPrice && !maxPrice) {
      return 'N/A';
    }
    return `$${minPrice} - $${maxPrice}`;
  };

  const formatLocation = (location) => {
    console.log('HotelsTable - formatLocation - location:', location);
    if (!location) {
      return 'N/A';
    }
    // Handle both object format { latitude, longitude } and direct values
    const lat = location.latitude || location.lat;
    const lng = location.longitude || location.lng || location.lon;
    if (!lat || !lng) {
      return 'N/A';
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  if (!hotels || hotels.length === 0) {
    return (
      <TableContainer component={Paper} className="modern-table hotels-table">
        <Box p={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No hotels found
          </Typography>
        </Box>
      </TableContainer>
    );
  }

  console.log('HotelsTable - Rendering hotels:', hotels);
  console.log('HotelsTable - First hotel:', hotels[0]);

  return (
    <TableContainer component={Paper} className="modern-table hotels-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedHotels.length > 0 && selectedHotels.length < hotels.length}
                checked={selectedHotels.length === hotels.length && hotels.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">Name</TableCell>
            <TableCell align="center" className="table-header-cell">City</TableCell>
            <TableCell align="center" className="table-header-cell">Description</TableCell>
            <TableCell align="center" className="table-header-cell">Location</TableCell>
            <TableCell align="center" className="table-header-cell">Price Range</TableCell>
            <TableCell align="center" className="table-header-cell">Likes</TableCell>
            <TableCell align="center" className="table-header-cell">Status</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hotels && hotels.length > 0 ? (
            hotels.map((hotel) => {
              console.log('HotelsTable - Rendering hotel row:', hotel);
              return (
                <TableRow 
                  key={hotel.id} 
                  className="table-data-row"
                  hover
                  selected={selectedHotels.includes(hotel.id)}
                >
                  <TableCell padding="checkbox" align="center" className="checkbox-cell">
                    <Checkbox
                      checked={selectedHotels.includes(hotel.id)}
                      onChange={() => onSelectHotel(hotel.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Avatar className="table-avatar">
                        <HotelIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2" fontWeight="600">
                        {hotel.name || 'Unnamed Hotel'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Typography variant="body2" fontWeight="500">
                      {hotel.cityName || hotel.city || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Tooltip title={hotel.description || 'No description'}>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {hotel.description ? hotel.description.substring(0, 50) + '...' : 'N/A'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Box className="location-display">
                      <LocationIcon fontSize="small" />
                      <Typography variant="body2">
                        {formatLocation(hotel.location)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Typography variant="body2" className="price-display">
                      {formatPriceRange(hotel.priceRange)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <FavoriteIcon fontSize="small" color="error" />
                      <Typography variant="body2" fontWeight="500">
                        {hotel.likesCount || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Chip
                      label={getStatusLabel(hotel.active !== undefined ? hotel.active : false)}
                      color={getStatusColor(hotel.active !== undefined ? hotel.active : false)}
                      size="small"
                      className="status-chip"
                    />
                  </TableCell>
                  <TableCell align="center" className="actions-cell">
                    <Tooltip title="More actions">
                      <IconButton
                        size="small"
                        onClick={(e) => onMenuClick(e, hotel.id)}
                        className="action-button"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography variant="body2" color="text.secondary">
                  No hotels found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HotelsTable;