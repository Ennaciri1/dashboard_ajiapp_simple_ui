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

const SpotsTable = ({ 
  spots, 
  selectedSpots, 
  onSelectAll, 
  onSelectSpot, 
  onMenuClick 
}) => {
  return (
    <TableContainer component={Paper} className="spots-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedSpots.length > 0 && selectedSpots.length < spots.length}
                checked={selectedSpots.length === spots.length && spots.length > 0}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {spots.map((spot) => (
            <TableRow key={spot.id} className="spot-row">
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedSpots.includes(spot.id)}
                  onChange={() => onSelectSpot(spot.id)}
                />
              </TableCell>
              <TableCell>
                <Avatar
                  src={spot.image}
                  alt={spot.name}
                  className="spot-image"
                  variant="rounded"
                  sx={{ width: 60, height: 40 }}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  className="spot-name"
                  sx={{ fontWeight: 'bold' }}
                >
                  {spot.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="city-cell">
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{spot.city}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="description-cell">
                  {spot.description.length > 50
                    ? `${spot.description.substring(0, 50)}...`
                    : spot.description
                  }
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="rating-cell">
                  <StarIcon fontSize="small" color="warning" />
                  <Typography variant="body2">
                    {spot.rating} ({spot.ratingCount})
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {spot.entryFee}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => onMenuClick(e, spot.id)}
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

export default SpotsTable;
