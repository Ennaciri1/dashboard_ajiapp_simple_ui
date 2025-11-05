import { useState, useCallback, useEffect } from 'react';
import { ActivityRepository } from '../../infrastructure/api/ActivityRepository.js';
import { GetActivitiesUseCase } from '../../core/usecases/activities/GetActivitiesUseCase.js';

/**
 * Custom hook for activities management
 */
export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize repository and use case
  const activityRepository = new ActivityRepository();
  const getActivitiesUseCase = new GetActivitiesUseCase(activityRepository);

  /**
   * Load activities
   * @param {Object} params - Search parameters
   */
  const loadActivities = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getActivitiesUseCase.execute({
        filters: params.filters || {},
        searchTerm: params.searchTerm || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc'
      });

      setActivities(result.activities || []);
      setUsers(result.users || []);
    } catch (err) {
      setError(err.message);
      setActivities([]);
      setUsers([]);
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activities,
    users,
    loading,
    error,
    loadActivities
  };
};

