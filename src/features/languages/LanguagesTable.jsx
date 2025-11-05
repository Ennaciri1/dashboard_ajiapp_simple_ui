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
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatters';

const LanguagesTable = ({
  languages,
  selectedLanguages,
  onSelectAll,
  onSelectLanguage,
  onMenuClick
}) => {
  return (
    <TableContainer component={Paper} className="modern-table languages-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedLanguages.length > 0 && selectedLanguages.length < languages.length}
                checked={selectedLanguages.length === languages.length && languages.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">Code</TableCell>
            <TableCell align="center" className="table-header-cell">Name</TableCell>
            <TableCell align="center" className="table-header-cell">Created At</TableCell>
            <TableCell align="center" className="table-header-cell">Created By</TableCell>
            <TableCell align="center" className="table-header-cell">Updated At</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {languages.map((language) => (
            <TableRow 
              key={language.id} 
              className="table-data-row"
              hover
              selected={selectedLanguages.includes(language.id)}
            >
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  checked={selectedLanguages.includes(language.id)}
                  onChange={() => onSelectLanguage(language.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <LanguageIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600" color="primary" sx={{ textTransform: 'uppercase' }}>
                    {language.code || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" fontWeight="500">
                  {language.name || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" className="date-display">
                    {formatDateTime(language.createdAt)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="500">
                    {language.createdBy || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" className="date-display">
                  {formatDateTime(language.updatedAt)}
                </Typography>
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={(event) => onMenuClick(event, language.id)}
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

export default LanguagesTable;

