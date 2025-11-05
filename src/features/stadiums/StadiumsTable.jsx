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
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  SportsSoccer as StadiumIcon
} from '@mui/icons-material';
import { formatDate, formatNumber } from '../../utils/formatters';

const StadiumsTable = ({ 
  stadiums, 
  selectedStadiums, 
  onSelectAll, 
  onSelectStadium, 
  onMenuClick 
}) => {
  const getStatusColor = (active) => {
    return active ? 'success' : 'error';
  };

  const getStatusLabel = (active) => {
    return active ? 'Active' : 'Inactive';
  };

  const formatCapacity = (capacity) => {
    if (!capacity) return 'N/A';
    return formatNumber(capacity);
  };

  const formatInauguration = (inaugurationDate) => {
    if (!inaugurationDate) return 'N/A';
    return formatDate(inaugurationDate);
  };

  return (
    <TableContainer component={Paper} className="modern-table stadiums-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedStadiums.length > 0 && selectedStadiums.length < stadiums.length}
                checked={selectedStadiums.length === stadiums.length && stadiums.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">Name</TableCell>
            <TableCell align="center" className="table-header-cell">City</TableCell>
            <TableCell align="center" className="table-header-cell">Description</TableCell>
            <TableCell align="center" className="table-header-cell">Capacity</TableCell>
            <TableCell align="center" className="table-header-cell">Inauguration</TableCell>
            <TableCell align="center" className="table-header-cell">Home Ground</TableCell>
            <TableCell align="center" className="table-header-cell">Status</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stadiums.map((stadium) => (
            <TableRow 
              key={stadium.id} 
              className="table-data-row"
              hover
              selected={selectedStadiums.includes(stadium.id)}
            >
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  checked={selectedStadiums.includes(stadium.id)}
                  onChange={() => onSelectStadium(stadium.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <StadiumIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {stadium.name || 'Unnamed Stadium'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" fontWeight="500">
                    {stadium.cityName || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Tooltip title={stadium.description || 'No description'}>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {stadium.description ? stadium.description.substring(0, 50) + '...' : 'N/A'}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <PeopleIcon fontSize="small" color="action" />
                  <Typography variant="body2" fontWeight="500">
                    {formatCapacity(stadium.capacity)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" className="date-display">
                    {formatInauguration(stadium.inaugurationDate)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" fontWeight="500">
                  {stadium.homeGround || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Chip
                  label={getStatusLabel(stadium.active)}
                  color={getStatusColor(stadium.active)}
                  size="small"
                  className="status-chip"
                />
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={() => onMenuClick(stadium.id, stadium)}
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

export default StadiumsTable;