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
  Rating,
  Avatar,
  Box
} from '@mui/material';
import { MoreVert as MoreVertIcon, Person as PersonIcon } from '@mui/icons-material';
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
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="reviews-table-container">
      <TableContainer component={Paper} className="reviews-table">
        <Table>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell padding="checkbox" className="table-header-cell">
                <Checkbox
                  indeterminate={selectedReviews.length > 0 && selectedReviews.length < reviews.length}
                  checked={selectedReviews.length === reviews.length && reviews.length > 0}
                  onChange={onSelectAll}
                  className="select-all-checkbox"
                />
              </TableCell>
              <TableCell className="table-header-cell">Utilisateur</TableCell>
              <TableCell className="table-header-cell">Message</TableCell>
              <TableCell className="table-header-cell">Note</TableCell>
              <TableCell className="table-header-cell">Statut</TableCell>
              <TableCell className="table-header-cell">Entité</TableCell>
              <TableCell className="table-header-cell">Date</TableCell>
              <TableCell className="table-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id} className="review-row">
                <TableCell padding="checkbox" className="table-cell">
                  <Checkbox
                    checked={selectedReviews.includes(review.id)}
                    onChange={() => onSelectReview(review.id)}
                    className="row-checkbox"
                  />
                </TableCell>
                <TableCell className="table-cell">
                  <Box className="user-cell">
                    <Avatar className="user-avatar">
                      <PersonIcon />
                    </Avatar>
                    <Box className="user-info">
                      <Typography variant="body2" className="user-name">
                        {review.userName || 'Utilisateur anonyme'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="table-cell">
                  <Box className="message-cell">
                    <Typography variant="body2" className="message-text">
                      {review.message && review.message.length > 80 
                        ? `${review.message.substring(0, 80)}…` 
                        : review.message || 'Aucun message'
                      }
                    </Typography>
                    {review.rejectionReason && (
                      <Typography variant="caption" className="rejection-reason">
                        Raison: {review.rejectionReason}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell className="table-cell">
                  <Box className="rating-cell">
                    <Rating 
                      value={review.rating || 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                      className="rating-stars"
                    />
                    <Typography variant="caption" className="rating-value">
                      {review.rating || 0}/5
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className="table-cell">
                  <Chip 
                    label={getStatusLabel(review.status)} 
                    size="small" 
                    color={getStatusColor(review.status)}
                    variant="outlined"
                    className="status-chip"
                  />
                </TableCell>
                <TableCell className="table-cell">
                  <Box className="entity-cell">
                    <Typography variant="body2" className="entity-name">
                      {review.entityName || 'Entité inconnue'}
                    </Typography>
                    <Typography variant="caption" className="entity-type">
                      {review.entityType?.toUpperCase()} #{review.entityId}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className="table-cell">
                  <Typography variant="body2" className="date-text">
                    {formatDate(review.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell className="table-cell">
                  <IconButton 
                    onClick={(event) => onMenuClick(event, review.id)}
                    className="action-button"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReviewsTable;
