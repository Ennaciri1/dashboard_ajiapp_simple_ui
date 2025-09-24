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
            <TableCell>Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Entry</TableCell>
            <TableCell>Hours</TableCell>
            <TableCell>Status</TableCell>
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
                <Typography
                  variant="body2"
                  className="spot-name"
                  sx={{ fontWeight: 'bold' }}
                >
                  {spot.nameTranslations?.en || spot.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="city-cell">
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{spot.cityName}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="description-cell">
                  {(() => {
                    const description = spot.descriptionTranslations?.en || spot.description || '';
                    return description.length > 50
                      ? `${description.substring(0, 50)}...`
                      : description;
                  })()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="address-cell">
                  {spot.addressTranslations?.en || spot.address || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {spot.paidEntry ? 'Paid' : 'Free'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {spot.openingTime} - {spot.closingTime}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={spot.active ? 'Active' : 'Inactive'}
                  color={spot.active ? 'success' : 'default'}
                  size="small"
                />
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
