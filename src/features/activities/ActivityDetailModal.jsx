import React from 'react';
import EntityDetailModal from '../../components/common/EntityDetailModal';
import { activityDetailConfig } from '../../components/common/configs/activityDetailConfig.jsx';

const ActivityDetailModal = ({ open, onClose, activity }) => {
  // Si activity est null ou undefined, ne pas rendre le modal
  if (!activity) return null;

  // Préparer la configuration avec les valeurs dynamiques
  const config = {
    ...activityDetailConfig,
    title: typeof activityDetailConfig.title === 'function' 
      ? activityDetailConfig.title(activity) 
      : activityDetailConfig.title,
    subtitle: typeof activityDetailConfig.subtitle === 'function'
      ? activityDetailConfig.subtitle(activity)
      : activityDetailConfig.subtitle
  };

  return (
    <EntityDetailModal
      open={open}
      onClose={onClose}
      entity={activity}
      config={config}
    />
  );
};

export default ActivityDetailModal;
