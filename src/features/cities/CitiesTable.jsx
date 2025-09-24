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
  IconButton,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getCityName } from './index';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return '-';
  }
};

const CitiesTable = ({
  cities,
  selectedCities,
  onSelectAll,
  onSelectCity,
  onDeleteClick
}) => {
  return (
    <TableContainer component={Paper} className="cities-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedCities.length > 0 && selectedCities.length < cities.length}
                checked={selectedCities.length === cities.length && cities.length > 0}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Updated By</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cities.map((city) => (
            <TableRow key={city.id} className="city-row">
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCities.includes(city.id)}
                  onChange={() => onSelectCity(city.id)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {getCityName(city)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={city.active ? 'Active' : 'Inactive'}
                  color={city.active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontSize="0.875rem">
                  {formatDate(city.createdAt)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontSize="0.875rem">
                  {city.createdBy || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontSize="0.875rem">
                  {formatDate(city.updatedAt)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontSize="0.875rem">
                  {city.updatedBy || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton 
                  onClick={() => onDeleteClick(city.id)}
                  color="error"
                  title="Delete city"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CitiesTable;
