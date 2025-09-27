import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Schedule as PendingIcon,
  Cancel as RejectedIcon,
  Error as ErrorIcon,
  CheckCircle
} from '@mui/icons-material';

/**
 * Composant UI pur pour afficher un statut sous forme de chip
 * Réutilisable pour différents types de statuts
 */
const StatusChip = ({ 
  status, 
  variant = 'outlined', 
  size = 'small',
  showIcon = true,
  statusConfig = {}
}) => {
  // Configuration par défaut des statuts
  const defaultStatusConfig = {
    APPROVED: {
      label: 'Approuvé',
      color: 'success',
      icon: <ApprovedIcon />
    },
    PENDING: {
      label: 'En attente',
      color: 'warning',
      icon: <PendingIcon />
    },
    REJECTED: {
      label: 'Rejeté',
      color: 'error',
      icon: <RejectedIcon />
    },
    ACTIVE: {
      label: 'Actif',
      color: 'success',
      icon: <CheckCircle />
    },
    INACTIVE: {
      label: 'Inactif',
      color: 'default',
      icon: <ErrorIcon />
    }
  };

  // Fusion de la configuration par défaut avec celle fournie
  const config = { ...defaultStatusConfig, ...statusConfig };
  const statusInfo = config[status] || {
    label: status,
    color: 'default',
    icon: <ErrorIcon />
  };

  return (
    <Chip
      label={statusInfo.label}
      color={statusInfo.color}
      variant={variant}
      size={size}
      icon={showIcon ? statusInfo.icon : undefined}
    />
  );
};

export default StatusChip;
