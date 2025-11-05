import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import ActivitiesTable from '../../../features/activities/ActivitiesTable';
import ActivityDetailModal from '../../../features/activities/ActivityDetailModal';
import { FilterToolbar } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { useActivities } from '../../../presentation/hooks/useActivities';
import './Activities.css';

const Activities = () => {
  const { showSuccess, showError } = useNotification();
  const { activities, users, loading, error, loadActivities } = useActivities();
  const [filters, setFilters] = useState({ search: '', userId: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [userFilter, setUserFilter] = useState(''); // For filtering by user

  // Load activities on mount
  useEffect(() => {
    loadActivities({ filters: { userId: filters.userId || undefined } });
  }, []);

  // Filter activities based on search
  const filteredActivities = useMemo(() => {
    if (!activities || !Array.isArray(activities)) {
      return [];
    }
    
    let filtered = activities;
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(activity => {
        const title = (activity.title || '').toLowerCase();
        const description = (activity.description || '').toLowerCase();
        return title.includes(searchLower) || description.includes(searchLower);
      });
    }
    
    return filtered;
  }, [activities, filters.search]);

  const handleMenuClick = (event, activityId) => {
    setAnchorEl(event.currentTarget);
    setSelectedActivityId(activityId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActivityId(null);
  };

  const handleView = async (activityId) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      // If we need to fetch full details, we can do it here
      // For now, use the activity from the list
      setSelectedActivity(activity);
      setDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleUserFilterChange = (event) => {
    const userId = event.target.value;
    setUserFilter(userId);
    setFilters(prev => ({ ...prev, userId: userId || undefined }));
    // Reload activities with new filter
    loadActivities({ filters: { userId: userId || undefined } });
  };

  return (
    <div className="global-container">
      <FilterToolbar
        title="Activities Management"
        search={{
          placeholder: 'Search activities...',
          value: filters.search,
          onChange: handleSearchChange
        }}
        filters={[
          {
            key: 'userId',
            label: 'Filter by User',
            value: userFilter,
            onChange: handleUserFilterChange,
            options: [
              { value: '', label: 'All Users' },
              ...users.map(user => ({
                value: user.userId,
                label: `${user.fullName} (${user.email}) - ${user.totalActivities} activities`
              }))
            ]
          }
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredActivities.length > 0 && (
            <Box className="results-indicator">
              <Typography variant="body2" color="text.secondary">
                {filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'} found
                {filteredActivities.length !== activities.length && ` out of ${activities.length} total`}
              </Typography>
            </Box>
          )}

          <Card className="activities-card">
            <CardContent>
              <ActivitiesTable
                activities={filteredActivities}
                selectedActivityId={selectedActivityId}
                anchorEl={anchorEl}
                onMenuClick={handleMenuClick}
                onMenuClose={handleMenuClose}
                onView={handleView}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        activity={selectedActivity}
      />
    </div>
  );
};

export default Activities;

