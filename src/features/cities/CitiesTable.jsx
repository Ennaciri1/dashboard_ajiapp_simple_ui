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
  LocationCity as LocationCityIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { getCityName } from './index';
import { formatDateTime } from '../../utils/formatters';

const CitiesTable = ({
  cities,
  selectedCities,
  onSelectAll,
  onSelectCity,
  onMenuClick
}) => {
  const getStatusColor = (active) => {
    return active ? 'success' : 'error';
  };

  const getStatusLabel = (active) => {
    return active ? 'Active' : 'Inactive';
  };

  return (
    <TableContainer component={Paper} className="modern-table cities-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedCities.length > 0 && selectedCities.length < cities.length}
                checked={selectedCities.length === cities.length && cities.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">Name</TableCell>
            <TableCell align="center" className="table-header-cell">Status</TableCell>
            <TableCell align="center" className="table-header-cell">Created At</TableCell>
            <TableCell align="center" className="table-header-cell">Created By</TableCell>
            <TableCell align="center" className="table-header-cell">Updated At</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cities.map((city) => (
            <TableRow 
              key={city.id} 
              className="table-data-row"
              hover
              selected={selectedCities.includes(city.id)}
            >
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  checked={selectedCities.includes(city.id)}
                  onChange={() => onSelectCity(city.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <LocationCityIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {getCityName(city)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Chip
                  label={getStatusLabel(city.active)}
                  color={getStatusColor(city.active)}
                  size="small"
                  className="status-chip"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" className="date-display">
                    {formatDateTime(city.createdAt)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="500">
                    {city.createdBy || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" className="date-display">
                  {formatDateTime(city.updatedAt)}
                </Typography>
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={() => onMenuClick(city.id, city)}
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

export default CitiesTable;