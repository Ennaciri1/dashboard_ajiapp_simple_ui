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
  Chip,
  Avatar
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { getVisaCountry, getVisaNationality } from './index';

const VisasTable = ({
  visas,
  selectedVisas,
  onSelectAll,
  onSelectVisa,
  onMenuClick
}) => {
  return (
    <TableContainer component={Paper} className="visas-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedVisas.length > 0 && selectedVisas.length < visas.length}
                checked={selectedVisas.length === visas.length && visas.length > 0}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Nationality</TableCell>
            <TableCell>Requirement</TableCell>
            <TableCell>Processing</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visas.map((visa) => (
            <TableRow key={visa.id} className="visa-row">
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedVisas.includes(visa.id)}
                  onChange={() => onSelectVisa(visa.id)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {getVisaCountry(visa)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{getVisaNationality(visa)}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={visa.isRequired ? 'Required' : 'Not required'}
                  color={visa.isRequired ? 'error' : 'success'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{visa.processingTime}</Typography>
              </TableCell>
              <TableCell>
                <Avatar
                  variant="rounded"
                  src={visa.imageUrl}
                  alt={getVisaCountry(visa)}
                  sx={{ width: 56, height: 36 }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{visa.updatedAt}</Typography>
              </TableCell>
              <TableCell>
                <IconButton onClick={(event) => onMenuClick(event, visa.id)}>
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

export default VisasTable;
