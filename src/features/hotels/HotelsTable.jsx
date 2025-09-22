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
  Avatar,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Star as StarIcon,
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
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Price/Night</TableCell>
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
                <Avatar
                  src={hotel.image}
                  alt={hotel.name}
                  className="hotel-image"
                  variant="rounded"
                  sx={{ width: 60, height: 40 }}
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
                <Box className="location-cell">
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{hotel.location}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="description-cell">
                  {hotel.description.length > 50
                    ? `${hotel.description.substring(0, 50)}...`
                    : hotel.description
                  }
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="rating-cell">
                  <StarIcon fontSize="small" color="warning" />
                  <Typography variant="body2">
                    {hotel.rating} ({hotel.ratingCount})
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  ${hotel.pricePerNight}
                </Typography>
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
