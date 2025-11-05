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
  Rating,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  Person as PersonIcon,
  Star as StarIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatters';
import './ReviewsTable.css';

const ReviewsTable = ({
  reviews,
  selectedReviews,
  onSelectAll,
  onSelectReview,
  onMenuClick
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getUserName = (review) => {
    return review.userName || 'Anonymous User';
  };

  const getMessage = (review) => {
    return review.message || 'No message';
  };

  return (
    <TableContainer component={Paper} className="modern-table reviews-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedReviews.length > 0 && selectedReviews.length < reviews.length}
                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">User</TableCell>
            <TableCell align="center" className="table-header-cell">Rating</TableCell>
            <TableCell align="center" className="table-header-cell">Message</TableCell>
            <TableCell align="center" className="table-header-cell">Entity</TableCell>
            <TableCell align="center" className="table-header-cell">Status</TableCell>
            <TableCell align="center" className="table-header-cell">Date</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => (
            <TableRow 
              key={review.id} 
              className="table-data-row"
              hover
              selected={selectedReviews.includes(review.id)}
            >
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  checked={selectedReviews.includes(review.id)}
                  onChange={() => onSelectReview(review.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {getUserName(review)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box className="table-rating">
                  <Rating
                    value={review.rating || 0}
                    readOnly
                    size="small"
                    precision={0.5}
                  />
                  <Typography variant="body2" fontWeight="500" color="text.secondary">
                    ({review.rating || 0})
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Tooltip title={getMessage(review)}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <MessageIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getMessage(review).length > 30 ? getMessage(review).substring(0, 30) + '...' : getMessage(review)}
                    </Typography>
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" fontWeight="500">
                  {review.entityType || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Chip
                  label={getStatusLabel(review.status)}
                  color={getStatusColor(review.status)}
                  size="small"
                  className="status-chip"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Typography variant="body2" className="date-display">
                  {formatDate(review.createdAt)}
                </Typography>
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={() => onMenuClick(review.id, review)}
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

export default ReviewsTable;