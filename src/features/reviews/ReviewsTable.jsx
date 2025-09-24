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
  Rating
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const ReviewsTable = ({
  reviews,
  selectedReviews,
  onSelectAll,
  onSelectReview,
  onMenuClick
}) => {
  return (
    <TableContainer component={Paper} className="reviews-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedReviews.length > 0 && selectedReviews.length < reviews.length}
                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Entity</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id} className="review-row">
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedReviews.includes(review.id)}
                  onChange={() => onSelectReview(review.id)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="description-cell">
                  {review.message.length > 70 ? `${review.message.substring(0, 70)}…` : review.message}
                </Typography>
              </TableCell>
              <TableCell>
                <Rating value={review.rating} precision={0.5} readOnly size="small" />
              </TableCell>
              <TableCell>
                <Chip label={review.status} size="small" color="primary" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{review.userName}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {review.entityName}
                  <br />
                  <Typography component="span" variant="caption" color="text.secondary">
                    {review.entityType.toUpperCase()} #{review.entityId}
                  </Typography>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{review.createdAt}</Typography>
              </TableCell>
              <TableCell>
                <IconButton onClick={(event) => onMenuClick(event, review.id)}>
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

export default ReviewsTable;
