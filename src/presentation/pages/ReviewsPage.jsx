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
 * Page de gestion des avis - Utilise l'API réelle
 */
const ReviewsPage = () => {
  const { showSuccess, showError } = useNotification();
  
  // État local pour l'UI
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Hook personnalisé pour la gestion des avis
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

  // Filtrage côté client
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const statusMatch = statusFilter === 'ALL' || review.status === statusFilter;
      const entityMatch = entityTypeFilter === 'ALL' || review.entityType === entityTypeFilter.toLowerCase();
      return statusMatch && entityMatch;
    });
  }, [reviews, statusFilter, entityTypeFilter]);

  // Statistiques
  const stats = getReviewsStats();

  // Handlers d'événements
  const handleMenuOpen = (event, reviewId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReviewId(reviewId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Ne pas remettre selectedReviewId à null si un dialog est ouvert
    if (!rejectDialogOpen) {
      setSelectedReviewId(null);
    }
  };

  const handleApprove = async (reviewId) => {
    const targetId = reviewId || selectedReviewId;
    
    if (!targetId) {
      showError('Aucun avis sélectionné');
      handleMenuClose();
      return;
    }

    try {
      const currentReview = reviews.find(r => r.id === targetId);
      const previousStatus = currentReview?.status;
      await approveReview(targetId);
      
      let message = 'Avis approuvé avec succès';
      if (previousStatus === 'REJECTED') {
        message = 'Avis rejeté → approuvé avec succès';
      } else if (previousStatus === 'PENDING') {
        message = 'Avis en attente → approuvé avec succès';
      }
      
      showSuccess(message);
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation de l\'avis:', error);
      showError(`Erreur lors de l'approbation: ${error.message || 'Une erreur inattendue s\'est produite'}`);
    }
    handleMenuClose();
  };

  const handleRejectClick = (reviewId) => {
    console.log('handleRejectClick called with:', { reviewId, selectedReviewId });
    const targetId = reviewId || selectedReviewId;
    console.log('targetId determined as:', targetId);
    
    if (!targetId) {
      console.error('No targetId found for rejection');
      showError('Aucun avis sélectionné');
      handleMenuClose();
      return;
    }
    
    // Ne pas fermer le menu avant de définir l'ID
    console.log('Setting selectedReviewId to:', targetId);
    setSelectedReviewId(targetId);
    setRejectDialogOpen(true);
    // Fermer le menu après avoir défini l'ID
    setAnchorEl(null);
  };

  const handleRejectConfirm = async () => {
    console.log('handleRejectConfirm called with:', { selectedReviewId, rejectionReason });
    
    if (!rejectionReason.trim()) {
      showError('Une raison de rejet est requise');
      return;
    }

    if (!selectedReviewId) {
      console.error('No selectedReviewId found:', selectedReviewId);
      showError('Aucun avis sélectionné pour le rejet');
      setRejectDialogOpen(false);
      setRejectionReason('');
      return;
    }

    try {
      console.log('Attempting to reject review:', selectedReviewId, 'with reason:', rejectionReason.trim());
      const currentReview = reviews.find(r => r.id === selectedReviewId);
      const previousStatus = currentReview?.status;
      
      await rejectReview(selectedReviewId, rejectionReason.trim());
      
      let message = `Avis rejeté avec succès. Raison: ${rejectionReason.trim()}`;
      if (previousStatus === 'APPROVED') {
        message = `Avis approuvé → rejeté avec succès. Raison: ${rejectionReason.trim()}`;
      } else if (previousStatus === 'PENDING') {
        message = `Avis en attente → rejeté avec succès. Raison: ${rejectionReason.trim()}`;
      }
      
      showSuccess(message);
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Erreur lors du rejet de l\'avis:', error);
      showError(`Erreur lors du rejet: ${error.message || 'Une erreur inattendue s\'est produite'}`);
    }
  };

  const handleDelete = async (reviewId) => {
    const targetId = reviewId || selectedReviewId;
    
    if (!targetId) {
      showError('Aucun avis sélectionné');
      handleMenuClose();
      return;
    }

    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.');
    if (!confirmed) {
      handleMenuClose();
      return;
    }

    try {
      await deleteReview(targetId);
      showSuccess('Avis supprimé avec succès');
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      showError(`Erreur lors de la suppression: ${error.message || 'Une erreur inattendue s\'est produite'}`);
    }
    handleMenuClose();
  };

  const handleRetry = () => {
    clearError();
    refresh();
  };

  const getEntityTypeLabel = (entityType) => {
    const labels = {
      hotel: 'Hôtel',
      touristspot: 'Site touristique', 
      activity: 'Activité'
    };
    return labels[entityType.toLowerCase()] || entityType;
  };

  // Configuration des statuts pour StatusChip
  const statusConfig = {
    PENDING: {
      label: 'En attente',
      color: 'warning',
      icon: <MoreVertIcon />
    },
    APPROVED: {
      label: 'Approuvé',
      color: 'success',
      icon: <ApproveIcon />
    },
    REJECTED: {
      label: 'Rejeté',
      color: 'error',
      icon: <RejectIcon />
    }
  };

  // Rendu conditionnel pour les erreurs
  if (error) {
    return (
      <Box className="reviews-page">
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Réessayer
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
          Gestion des Avis
        </Typography>
        <Typography variant="body1" color="textSecondary" className="page-subtitle">
          Gérez et modérez les avis des utilisateurs
        </Typography>
      </div>
      
      {/* Indicateur de mode test */}
      {isTestMode && (
        <Alert severity="info" className="test-mode-alert">
          🧪 Mode test activé - API non disponible (192.168.11.127:8080). Les données affichées sont des exemples et les actions sont simulées.
        </Alert>
      )}

      {/* Statistiques */}
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
                En attente
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
                Approuvés
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
                Note moyenne
              </Typography>
              <Typography variant="h4" className="stat-value">
                {stats.averageRating.toFixed(1)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="filter-group">
          <Typography variant="subtitle1" className="filter-label">
            Statut
          </Typography>
          <div className="filter-chips">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
              <Chip
                key={status}
                label={status === 'ALL' ? 'Tous' : statusConfig[status]?.label || status}
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
            Type d'entité
          </Typography>
          <div className="filter-chips">
            {['ALL', 'HOTEL', 'TOURISTSPOT', 'ACTIVITY'].map(type => (
              <Chip
                key={type}
                label={type === 'ALL' ? 'Tous' : getEntityTypeLabel(type)}
                variant={entityTypeFilter === type ? 'filled' : 'outlined'}
                onClick={() => setEntityTypeFilter(type)}
                color={entityTypeFilter === type ? 'primary' : 'default'}
                className="filter-chip"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tableau des avis */}
      <Card className="data-card">
        <CardContent>
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Chargement des avis...
              </Typography>
            </div>
          ) : (
            <>
              <div className="table-header">
                <Typography variant="h6" className="table-title">
                  {filteredReviews.length} avis trouvé{filteredReviews.length > 1 ? 's' : ''}
                  {filteredReviews.length !== total && ` sur ${total} total`}
                </Typography>
              </div>

              <div className="table-container">
                <Table className="reviews-table">
                  <TableHead>
                    <TableRow className="table-header-row">
                      <TableCell className="table-header-cell">Utilisateur</TableCell>
                      <TableCell className="table-header-cell">Message</TableCell>
                      <TableCell className="table-header-cell">Note</TableCell>
                      <TableCell className="table-header-cell">Type</TableCell>
                      <TableCell className="table-header-cell">Statut</TableCell>
                      <TableCell className="table-header-cell">Date</TableCell>
                      <TableCell className="table-header-cell">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id} className="table-row">
                        <TableCell className="table-cell">
                          <div className="user-info">
                            <Typography variant="body2" className="user-name">
                              {review.userName}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell className="table-cell">
                          <div className="message-cell">
                            <Typography variant="body2" className="message-text">
                              {review.message.length > 100 
                                ? `${review.message.substring(0, 100)}...`
                                : review.message
                              }
                            </Typography>
                            {review.rejectionReason && (
                              <Typography variant="caption" className="rejection-reason">
                                Raison: {review.rejectionReason}
                              </Typography>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="table-cell">
                          <RatingDisplay 
                            value={review.rating} 
                            size="small" 
                            showValue={false}
                          />
                        </TableCell>
                        <TableCell className="table-cell">
                          <Typography variant="body2" className="entity-type">
                            {getEntityTypeLabel(review.entityType)}
                          </Typography>
                        </TableCell>
                        <TableCell className="table-cell">
                          <StatusChip 
                            status={review.status}
                            statusConfig={statusConfig}
                          />
                        </TableCell>
                        <TableCell className="table-cell">
                          <Typography variant="body2" className="date-text">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                        </TableCell>
                        <TableCell className="table-cell">
                          <Box className="action-buttons">
                            <IconButton
                              onClick={() => handleApprove(review.id)}
                              className={`action-button approve-button ${review.status === 'APPROVED' ? 'disabled' : ''}`}
                              size="small"
                              title={review.status === 'APPROVED' ? 'Déjà approuvé' : 'Approuver cet avis'}
                              disabled={review.status === 'APPROVED'}
                            >
                              <ApproveIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleRejectClick(review.id)}
                              className={`action-button reject-button ${review.status === 'REJECTED' ? 'disabled' : ''}`}
                              size="small"
                              title={review.status === 'REJECTED' ? 'Déjà rejeté' : 'Rejeter cet avis'}
                              disabled={review.status === 'REJECTED'}
                            >
                              <RejectIcon />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, review.id)}
                              className="action-button menu-button"
                              size="small"
                              title="Plus d'actions"
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

      {/* Menu contextuel */}
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
          Approuver
        </MenuItem>
        <MenuItem 
          onClick={() => handleRejectClick(selectedReviewId)}
        >
          <RejectIcon sx={{ mr: 1 }} />
          Rejeter
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedReviewId)} 
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog de rejet */}
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
            Rejeter l'avis
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Veuillez indiquer la raison du rejet de cet avis. Cette information sera visible par l'utilisateur.
          </Typography>
          {selectedReviewId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Avis sélectionné: ID {selectedReviewId}
                </Typography>
                {(() => {
                  const review = reviews.find(r => r.id === selectedReviewId);
                  return review ? (
                    <Typography variant="caption" color="textSecondary">
                      Statut actuel: {statusConfig[review.status]?.label || review.status}
                    </Typography>
                  ) : null;
                })()}
              </Box>
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Raison du rejet *"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Ex: Contenu inapproprié, informations erronées, spam..."
            error={!rejectionReason.trim() && rejectDialogOpen}
            helperText={!rejectionReason.trim() && rejectDialogOpen ? "Une raison de rejet est requise" : ""}
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
            Annuler
          </Button>
          <Button 
            onClick={handleRejectConfirm} 
            variant="contained" 
            color="error"
            disabled={!rejectionReason.trim()}
            startIcon={<RejectIcon />}
          >
            Rejeter l'avis
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReviewsPage;
