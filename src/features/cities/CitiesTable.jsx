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
import { Place as PlaceIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { getCityName } from './index';

const CitiesTable = ({
  cities,
  selectedCities,
  onSelectAll,
  onSelectCity,
  onMenuClick
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
            <TableCell>City</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Coordinates</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Updated</TableCell>
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
                <Typography variant="body2">{city.code}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="description-cell">
                  {city.description || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <PlaceIcon fontSize="small" />
                  <Typography variant="body2">
                    {city.location?.latitude?.toFixed(4)}, {city.location?.longitude?.toFixed(4)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={city.active ? 'Active' : 'Inactive'}
                  color={city.active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {city.updatedAt || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton onClick={(event) => onMenuClick(event, city.id)}>
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

export default CitiesTable;
