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
  Public as PublicIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { getVisaCountry, getVisaNationality } from './index';

const VisasTable = ({
  visas,
  selectedVisas,
  onSelectAll,
  onSelectVisa,
  onMenuClick
}) => {
  const getStatusColor = (isRequired) => {
    return isRequired ? 'error' : 'success';
  };

  const getStatusLabel = (isRequired) => {
    return isRequired ? 'Required' : 'Not Required';
  };

  const formatProcessingTime = (processingTime) => {
    if (!processingTime) return 'N/A';
    return `${processingTime} days`;
  };

  return (
    <TableContainer component={Paper} className="modern-table visas-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedVisas.length > 0 && selectedVisas.length < visas.length}
                checked={selectedVisas.length === visas.length && visas.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">Country</TableCell>
            <TableCell align="center" className="table-header-cell">Nationality</TableCell>
            <TableCell align="center" className="table-header-cell">Requirement</TableCell>
            <TableCell align="center" className="table-header-cell">Processing Time</TableCell>
            <TableCell align="center" className="table-header-cell">Image</TableCell>
            <TableCell align="center" className="table-header-cell">Updated</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visas.map((visa) => (
            <TableRow 
              key={visa.id} 
              className="table-data-row"
              hover
              selected={selectedVisas.includes(visa.id)}
            >
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  checked={selectedVisas.includes(visa.id)}
                  onChange={() => onSelectVisa(visa.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <PublicIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {getVisaCountry(visa)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="500">
                    {getVisaNationality(visa)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Chip
                  label={getStatusLabel(visa.isRequired)}
                  color={getStatusColor(visa.isRequired)}
                  size="small"
                  className="status-chip"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" fontWeight="500">
                    {formatProcessingTime(visa.processingTime)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                {visa.imageUrl ? (
                  <Avatar 
                    src={visa.imageUrl} 
                    className="table-avatar"
                    variant="rounded"
                  />
                ) : (
                  <Avatar className="table-avatar">
                    <PublicIcon fontSize="small" />
                  </Avatar>
                )}
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" className="date-display">
                  {visa.updatedAt ? new Date(visa.updatedAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={() => onMenuClick(visa.id, visa)}
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

export default VisasTable;