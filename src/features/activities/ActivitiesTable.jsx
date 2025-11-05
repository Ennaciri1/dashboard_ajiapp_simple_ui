import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  SportsSoccer as SportsSoccerIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Favorite as FavoriteIcon,
  Visibility as ViewIcon,
  LocationCity as CityIcon
} from '@mui/icons-material';
import { ActionMenu } from '../../components/common';
import { formatDateTime } from '../../utils/formatters';
import './ActivitiesTable.css';

const ActivitiesTable = ({
  activities,
  selectedActivityId,
  anchorEl,
  onMenuClick,
  onMenuClose,
  onView
}) => {
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const formatLocation = (location) => {
    if (!location || !location.latitude || !location.longitude) {
      return 'N/A';
    }
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  };

  if (!activities || activities.length === 0) {
    return (
      <TableContainer component={Paper} className="modern-table activities-table">
        <Box p={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No activities found
          </Typography>
        </Box>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} className="modern-table activities-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell align="center" className="table-header-cell">Title</TableCell>
            <TableCell align="center" className="table-header-cell">Description</TableCell>
            <TableCell align="center" className="table-header-cell">Price</TableCell>
            <TableCell align="center" className="table-header-cell">City</TableCell>
            <TableCell align="center" className="table-header-cell">Likes</TableCell>
            <TableCell align="center" className="table-header-cell">Created By</TableCell>
            <TableCell align="center" className="table-header-cell">Created At</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity) => (
            <TableRow
              key={activity.id}
              className="table-data-row"
              hover
            >
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <SportsSoccerIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {activity.title || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activity.description || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <MoneyIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatPrice(activity.price)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <CityIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {activity.cityName || activity.city || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  <FavoriteIcon fontSize="small" color="error" />
                  <Typography variant="body2">
                    {activity.likesCount || 0}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2">
                  {activity.createdByName || activity.userFullName || activity.createdBy || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" className="date-display">
                  {activity.createdAt ? formatDateTime(activity.createdAt) : 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuClick(e, activity.id)}
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

      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        items={[
          {
            label: 'View',
            icon: <ViewIcon fontSize="small" />,
            onClick: () => {
              if (selectedActivityId) {
                onView(selectedActivityId);
              }
              onMenuClose();
            }
          }
        ]}
      />
    </TableContainer>
  );
};

export default ActivitiesTable;
