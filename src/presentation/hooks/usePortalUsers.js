import { useState, useCallback } from 'react';
import { portalUserService } from '../../infrastructure/api/portalUserService';

/**
 * Custom hook for portal users management
 */
export const usePortalUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Expose setUsers for external reset
  const resetUsers = useCallback(() => {
    setUsers([]);
  }, []);

  /**
   * Load all activity users
   */
  const loadActivityUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const usersData = await portalUserService.getAllActivityUsers();
      
      // Ensure we have an array
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError(err.message);
      setUsers([]);
      console.error('Error loading activity users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Suspend a user
   */
  const suspendUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      await portalUserService.suspendUser(userId);
      // Update the user in the list
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, suspended: true } : user
        )
      );
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a user
   */
  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await portalUserService.updateUser(userId, userData);
      // Update the user in the list
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    loadActivityUsers,
    suspendUser,
    updateUser,
    resetUsers,
    setUsers
  };
};

