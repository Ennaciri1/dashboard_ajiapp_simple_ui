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
  Attractions as AttractionsIcon,
  Paid as PaidIcon,
  MoneyOff as FreeIcon
} from '@mui/icons-material';

const SpotsTable = ({
  spots,
  selectedSpots,
  onSelectAll,
  onSelectSpot,
  onMenuClick
}) => {
  const getSpotName = (spot) => {
    // API returns name directly in the selected language
    return spot.name || spot.nameTranslations?.en || 'Unnamed Spot';
  };

  const getSpotDescription = (spot) => {
    // API returns description directly in the selected language
    return spot.description || spot.descriptionTranslations?.en || '';
  };

  const getSpotAddress = (spot) => {
    // API returns address directly in the selected language
    return spot.address || spot.addressTranslations?.en || '';
  };

  const getStatusColor = (active) => {
    return active ? 'success' : 'error';
  };

  const getStatusLabel = (active) => {
    return active ? 'Active' : 'Inactive';
  };

  const getEntryTypeColor = (paidEntry) => {
    return paidEntry ? 'warning' : 'success';
  };

  const getEntryTypeLabel = (paidEntry) => {
    return paidEntry ? 'Paid' : 'Free';
  };

  const getEntryTypeIcon = (paidEntry) => {
    if (paidEntry) {
      return <PaidIcon fontSize="small" />;
    } else {
      return <FreeIcon fontSize="small" />;
    }
  };

  if (!spots || spots.length === 0) {
    return (
      <TableContainer component={Paper} className="modern-table spots-table">
        <Box p={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No tourist spots found
          </Typography>
        </Box>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} className="modern-table spots-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedSpots.length > 0 && selectedSpots.length < spots.length}
                checked={selectedSpots.length === spots.length && spots.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">Name</TableCell>
            <TableCell align="center" className="table-header-cell">City</TableCell>
            <TableCell align="center" className="table-header-cell">Description</TableCell>
            <TableCell align="center" className="table-header-cell">Address</TableCell>
            <TableCell align="center" className="table-header-cell">Entry Type</TableCell>
            <TableCell align="center" className="table-header-cell">Status</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {spots.map((spot) => (
            <TableRow 
              key={spot.id} 
              className="table-data-row"
              hover
              selected={selectedSpots.includes(spot.id)}
            >
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  checked={selectedSpots.includes(spot.id)}
                  onChange={() => onSelectSpot(spot.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <AttractionsIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {getSpotName(spot)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" fontWeight="500">
                    {spot.cityName || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Tooltip title={getSpotDescription(spot) || 'No description'}>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getSpotDescription(spot) ? getSpotDescription(spot).substring(0, 50) + '...' : 'N/A'}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Tooltip title={getSpotAddress(spot) || 'No address'}>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getSpotAddress(spot) ? getSpotAddress(spot).substring(0, 30) + '...' : 'N/A'}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Chip
                  icon={getEntryTypeIcon(spot.paidEntry !== undefined ? spot.paidEntry : false)}
                  label={getEntryTypeLabel(spot.paidEntry !== undefined ? spot.paidEntry : false)}
                  color={getEntryTypeColor(spot.paidEntry !== undefined ? spot.paidEntry : false)}
                  size="small"
                  className="status-chip"
                  sx={{
                    '& .MuiChip-icon': {
                      opacity: 1,
                      fontSize: '18px !important',
                      marginLeft: '8px',
                      marginRight: '-4px'
                    }
                  }}
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Chip
                  label={getStatusLabel(spot.active !== undefined ? spot.active : false)}
                  color={getStatusColor(spot.active !== undefined ? spot.active : false)}
                  size="small"
                  className="status-chip"
                />
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuClick(e, spot.id)}
                    className="action-button"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpotsTable;