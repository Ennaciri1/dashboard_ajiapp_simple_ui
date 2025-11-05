import React, { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

import { useReviews } from '../hooks/useReviews';
import { StatusChip, RatingDisplay } from '../components/ui';
import { useNotification } from '../../contexts/NotificationContext';
import './ReviewsPage.css';

/**
 * Reviews Management Page - Uses real API
 */
const ReviewsPage = () => {
  const { showSuccess, showError } = useNotification();
  
  // Local state for UI
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Custom hook for reviews management
  const {
    reviews,
    loading,
    error,
    total,
    isTestMode,
    approveReview,
    rejectReview,
    deleteReview,
    clearError,
    refresh,
    getReviewsStats
  } = useReviews();

  // Client-side filtering
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const statusMatch = statusFilter === 'ALL' || review.status === statusFilter;
      const entityMatch = entityTypeFilter === 'ALL' || review.entityType === entityTypeFilter.toLowerCase();
      return statusMatch && entityMatch;
    });
  }, [reviews, statusFilter, entityTypeFilter]);

  // Statistics
  const stats = getReviewsStats();

  // Event handlers
  const handleMenuOpen = (event, reviewId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReviewId(reviewId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't reset selectedReviewId to null if a dialog is open
    if (!rejectDialogOpen) {
      setSelectedReviewId(null);
    }
  };

  const handleApprove = async (reviewId) => {
    const targetId = reviewId || selectedReviewId;
    
    if (!targetId) {
      showError('No review selected');
      handleMenuClose();
      return;
    }

    try {
      const currentReview = reviews.find(r => r.id === targetId);
      const previousStatus = currentReview?.status;
      await approveReview(targetId);
      
      let message = 'Review approved successfully';
      if (previousStatus === 'REJECTED') {
        message = 'Review rejected → approved successfully';
      } else if (previousStatus === 'PENDING') {
        message = 'Review pending → approved successfully';
      }
      
      showSuccess(message);
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Error approving review:', error);
      showError(`Error approving review: ${error.message || 'An unexpected error occurred'}`);
    }
    handleMenuClose();
  };

  const handleRejectClick = (reviewId) => {
    console.log('handleRejectClick called with:', { reviewId, selectedReviewId });
    const targetId = reviewId || selectedReviewId;
    console.log('targetId determined as:', targetId);
    
    if (!targetId) {
      console.error('No targetId found for rejection');
      showError('No review selected');
      handleMenuClose();
      return;
    }
    
    // Don't close menu before setting ID
    console.log('Setting selectedReviewId to:', targetId);
    setSelectedReviewId(targetId);
    setRejectDialogOpen(true);
    // Close menu after setting ID
    setAnchorEl(null);
  };

  const handleRejectConfirm = async () => {
    console.log('handleRejectConfirm called with:', { selectedReviewId, rejectionReason });
    
    if (!rejectionReason.trim()) {
      showError('A rejection reason is required');
      return;
    }

    if (!selectedReviewId) {
      console.error('No selectedReviewId found:', selectedReviewId);
      showError('No review selected for rejection');
      setRejectDialogOpen(false);
      setRejectionReason('');
      return;
    }

    try {
      console.log('Attempting to reject review:', selectedReviewId, 'with reason:', rejectionReason.trim());
      const currentReview = reviews.find(r => r.id === selectedReviewId);
      const previousStatus = currentReview?.status;
      
      await rejectReview(selectedReviewId, rejectionReason.trim());
      
      let message = `Review rejected successfully. Reason: ${rejectionReason.trim()}`;
      if (previousStatus === 'APPROVED') {
        message = `Review approved → rejected successfully. Reason: ${rejectionReason.trim()}`;
      } else if (previousStatus === 'PENDING') {
        message = `Review pending → rejected successfully. Reason: ${rejectionReason.trim()}`;
      }
      
      showSuccess(message);
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Error rejecting review:', error);
      showError(`Error rejecting review: ${error.message || 'An unexpected error occurred'}`);
    }
  };

  const handleDelete = async (reviewId) => {
    const targetId = reviewId || selectedReviewId;
    
    if (!targetId) {
      showError('No review selected');
      handleMenuClose();
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this review? This action is irreversible.');
    if (!confirmed) {
      handleMenuClose();
      return;
    }

    try {
      await deleteReview(targetId);
      showSuccess('Review deleted successfully');
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      showError(`Error deleting review: ${error.message || 'An unexpected error occurred'}`);
    }
    handleMenuClose();
  };

  const handleRetry = () => {
    clearError();
    refresh();
  };

  const getEntityTypeLabel = (entityType) => {
    const labels = {
      hotel: 'Hotel',
      touristspot: 'Tourist Spot', 
      activity: 'Activity'
    };
    return labels[entityType.toLowerCase()] || entityType;
  };

  // Status configuration for StatusChip
  const statusConfig = {
    PENDING: {
      label: 'Pending',
      color: 'warning',
      icon: <MoreVertIcon />
    },
    APPROVED: {
      label: 'Approved',
      color: 'success',
      icon: <ApproveIcon />
    },
    REJECTED: {
      label: 'Rejected',
      color: 'error',
      icon: <RejectIcon />
    }
  };

  // Conditional rendering for errors
  if (error) {
    return (
      <Box className="reviews-page">
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <div className="global-container">
      <div className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Reviews Management
        </Typography>
        <Typography variant="body1" color="textSecondary" className="page-subtitle">
          Manage and moderate user reviews
        </Typography>
      </div>
      
      {/* Test mode indicator */}
      {isTestMode && (
        <Alert severity="info" className="test-mode-alert">
          🧪 Test mode enabled - API unavailable (192.168.11.127:8080). Displayed data is sample and actions are simulated.
        </Alert>
      )}

      {/* Statistics */}
      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <Typography color="textSecondary" className="stat-label">
                Total
              </Typography>
              <Typography variant="h4" className="stat-value">
                {stats.total}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <Typography color="textSecondary" className="stat-label">
                Pending
              </Typography>
              <Typography variant="h4" className="stat-value warning">
                {stats.pending}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <Typography color="textSecondary" className="stat-label">
                Approved
              </Typography>
              <Typography variant="h4" className="stat-value success">
                {stats.approved}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <Typography color="textSecondary" className="stat-label">
                Average Rating
              </Typography>
              <Typography variant="h4" className="stat-value">
                {stats.averageRating.toFixed(1)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <Typography variant="subtitle1" className="filter-label">
            Status
          </Typography>
          <div className="filter-chips">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
              <Chip
                key={status}
                label={status === 'ALL' ? 'All' : statusConfig[status]?.label || status}
                variant={statusFilter === status ? 'filled' : 'outlined'}
                onClick={() => setStatusFilter(status)}
                color={statusFilter === status ? 'primary' : 'default'}
                className="filter-chip"
              />
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <Typography variant="subtitle1" className="filter-label">
            Entity Type
          </Typography>
          <div className="filter-chips">
            {['ALL', 'HOTEL', 'TOURISTSPOT', 'ACTIVITY'].map(type => (
              <Chip
                key={type}
                label={type === 'ALL' ? 'All' : getEntityTypeLabel(type)}
                variant={entityTypeFilter === type ? 'filled' : 'outlined'}
                onClick={() => setEntityTypeFilter(type)}
                color={entityTypeFilter === type ? 'primary' : 'default'}
                className="filter-chip"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <Card className="data-card">
        <CardContent>
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Loading reviews...
              </Typography>
            </div>
          ) : (
            <>
              <div className="table-container">
                <Table className="reviews-table">
                  <TableHead>
                    <TableRow className="table-header-row">
                      <TableCell className="table-header-cell" align="center">User</TableCell>
                      <TableCell className="table-header-cell" align="center">Message</TableCell>
                      <TableCell className="table-header-cell" align="center">Rating</TableCell>
                      <TableCell className="table-header-cell" align="center">Type</TableCell>
                      <TableCell className="table-header-cell" align="center">Status</TableCell>
                      <TableCell className="table-header-cell" align="center">Date</TableCell>
                      <TableCell className="table-header-cell" align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id} className="table-row">
                        <TableCell className="table-cell" align="center">
                          <div className="user-info">
                            <Typography variant="body2" className="user-name">
                              {review.userName}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell className="table-cell" align="center">
                          <div className="message-cell">
                            <Typography variant="body2" className="message-text">
                              {review.message.length > 100 
                                ? `${review.message.substring(0, 100)}...`
                                : review.message
                              }
                            </Typography>
                            {review.rejectionReason && (
                              <Typography variant="caption" className="rejection-reason">
                                Reason: {review.rejectionReason}
                              </Typography>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="table-cell" align="center">
                          <RatingDisplay 
                            value={review.rating} 
                            size="small" 
                            showValue={false}
                          />
                        </TableCell>
                        <TableCell className="table-cell" align="center">
                          <Typography variant="body2" className="entity-type">
                            {getEntityTypeLabel(review.entityType)}
                          </Typography>
                        </TableCell>
                        <TableCell className="table-cell" align="center">
                          <StatusChip 
                            status={review.status}
                            statusConfig={statusConfig}
                          />
                        </TableCell>
                        <TableCell className="table-cell" align="center">
                          <Typography variant="body2" className="date-text">
                            {new Date(review.createdAt).toLocaleDateString('en-US')}
                          </Typography>
                        </TableCell>
                        <TableCell className="table-cell" align="center">
                          <Box className="action-buttons">
                            <IconButton
                              onClick={() => handleApprove(review.id)}
                              className={`action-button approve-button ${review.status === 'APPROVED' ? 'disabled' : ''}`}
                              size="small"
                              title={review.status === 'APPROVED' ? 'Already approved' : 'Approve this review'}
                              disabled={review.status === 'APPROVED'}
                            >
                              <ApproveIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleRejectClick(review.id)}
                              className={`action-button reject-button ${review.status === 'REJECTED' ? 'disabled' : ''}`}
                              size="small"
                              title={review.status === 'REJECTED' ? 'Already rejected' : 'Reject this review'}
                              disabled={review.status === 'REJECTED'}
                            >
                              <RejectIcon />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, review.id)}
                              className="action-button menu-button"
                              size="small"
                              title="More actions"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => handleApprove(selectedReviewId)}
        >
          <ApproveIcon sx={{ mr: 1 }} />
          Approve
        </MenuItem>
        <MenuItem 
          onClick={() => handleRejectClick(selectedReviewId)}
        >
          <RejectIcon sx={{ mr: 1 }} />
          Reject
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedReviewId)} 
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Rejection Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => {
          setRejectDialogOpen(false);
          setRejectionReason('');
          setSelectedReviewId(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <RejectIcon color="error" />
            Reject Review
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this review. This information will be visible to the user.
          </Typography>
          {selectedReviewId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Selected review: ID {selectedReviewId}
                </Typography>
                {(() => {
                  const review = reviews.find(r => r.id === selectedReviewId);
                  return review ? (
                    <Typography variant="caption" color="textSecondary">
                      Current status: {statusConfig[review.status]?.label || review.status}
                    </Typography>
                  ) : null;
                })()}
              </Box>
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason *"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Ex: Inappropriate content, incorrect information, spam..."
            error={!rejectionReason.trim() && rejectDialogOpen}
            helperText={!rejectionReason.trim() && rejectDialogOpen ? "A rejection reason is required" : ""}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => {
              setRejectDialogOpen(false);
              setRejectionReason('');
              setSelectedReviewId(null);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejectConfirm} 
            variant="contained" 
            color="error"
            disabled={!rejectionReason.trim()}
            startIcon={<RejectIcon />}
          >
            Reject Review
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReviewsPage;
