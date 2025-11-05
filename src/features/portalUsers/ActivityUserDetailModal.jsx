import React from 'react';
import EntityDetailModal from '../../components/common/EntityDetailModal';
import { activityUserDetailConfig } from '../../components/common/configs/activityUserDetailConfig.jsx';

const ActivityUserDetailModal = ({ open, onClose, user }) => {
  // Préparer la configuration avec les valeurs dynamiques
  const config = {
    ...activityUserDetailConfig,
    title: typeof activityUserDetailConfig.title === 'function' 
      ? activityUserDetailConfig.title(user) 
      : activityUserDetailConfig.title,
    subtitle: typeof activityUserDetailConfig.subtitle === 'function'
      ? activityUserDetailConfig.subtitle(user)
      : activityUserDetailConfig.subtitle
  };

  return (
    <EntityDetailModal
      open={open}
      onClose={onClose}
      entity={user}
      config={config}
    />
  );
};

export default ActivityUserDetailModal;
