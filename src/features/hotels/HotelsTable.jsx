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
  Chip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const HotelsTable = ({ 
  hotels, 
  selectedHotels, 
  onSelectAll, 
  onSelectHotel, 
  onMenuClick 
}) => {
  return (
    <TableContainer component={Paper} className="hotels-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedHotels.length > 0 && selectedHotels.length < hotels.length}
                checked={selectedHotels.length === hotels.length && hotels.length > 0}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Price Range</TableCell>
            <TableCell>Likes</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.id} className="hotel-row">
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedHotels.includes(hotel.id)}
                  onChange={() => onSelectHotel(hotel.id)}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  className="hotel-name"
                  sx={{ fontWeight: 'bold' }}
                >
                  {hotel.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="city-cell">
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{hotel.cityName || '—'}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="description-cell">
                  {(() => {
                    const description = hotel.description || '';
                    return description.length > 50
                      ? `${description.substring(0, 50)}...`
                      : description || '—';
                  })()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="location-cell">
                  {hotel.location?.latitude && hotel.location?.longitude 
                    ? `${hotel.location.latitude.toFixed(4)}, ${hotel.location.longitude.toFixed(4)}`
                    : '—'
                  }
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {hotel.priceRange?.minPrice && hotel.priceRange?.maxPrice
                    ? `$${hotel.priceRange.minPrice} - $${hotel.priceRange.maxPrice}`
                    : '—'
                  }
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {hotel.likesCount || 0}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={(hotel.active !== undefined ? hotel.active : hotel.isActive) ? 'Active' : 'Inactive'}
                  color={(hotel.active !== undefined ? hotel.active : hotel.isActive) ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => onMenuClick(e, hotel.id)}
                  className="actions-button"
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HotelsTable;
