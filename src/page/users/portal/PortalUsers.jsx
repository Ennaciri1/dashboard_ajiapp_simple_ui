import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import PortalUsersTable from '../../../features/portalUsers/PortalUsersTable';
import ActivityUserDetailModal from '../../../features/portalUsers/ActivityUserDetailModal';
import { FilterToolbar } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { usePortalUsers } from '../../../presentation/hooks/usePortalUsers';
import './PortalUsers.css';

const PortalUsers = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { users, loading, error, loadActivityUsers, suspendUser, setUsers } = usePortalUsers();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '' });

  // Load users on mount
  useEffect(() => {
    loadActivityUsers();
  }, [loadActivityUsers]);



  // Handle add user
  const handleAddUser = () => {
    navigate('/users/portal/activities/add-user');
  };


  // Handle user menu click
  const handleMenuClick = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  // Handle user menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  // Handle view user
  const handleViewUser = (userId) => {
    const user = users.find(u => (u.userId || u.id) === userId);
    if (user) {
      setSelectedUser(user);
      setDetailModalOpen(true);
    }
  };

  // Handle close detail modal
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedUser(null);
  };

  // Handle edit user
  const handleEditUser = (userId) => {
    const user = users.find(u => (u.userId || u.id) === userId);
    if (user) {
      console.log('Edit user:', user);
      // Navigate to edit page if needed
      // navigate(`/users/portal/edit/${userId}`);
      showSuccess(`Editing user: ${user.email || userId}`);
    }
  };

  // Handle suspend user
  const handleSuspendUser = async (userId) => {
    const user = users.find(u => (u.userId || u.id) === userId);
    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to suspend user ${user.email || userId}?`
    );
    
    if (!confirmed) return;

    try {
      await suspendUser(userId);
      showSuccess('User suspended successfully');
    } catch (err) {
      showError(`Error suspending user: ${err.message}`);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    
    if (!filters.search) {
      return users;
    }
    
    const searchLower = filters.search.toLowerCase();
    return users.filter(user => {
      const userName = user?.fullName || '';
      const userEmail = user?.email || '';
      return userName.toLowerCase().includes(searchLower) || userEmail.toLowerCase().includes(searchLower);
    });
  }, [users, filters.search]);

  return (
    <div className="global-container">
      <FilterToolbar
        title="Activities Users Management"
        search={{
          placeholder: 'Search users...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        primaryAction={{
          label: 'Add User',
          icon: <AddIcon />,
          onClick: handleAddUser
        }}
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
          {users.length > 0 && (
            <Box className="results-indicator">
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                {filteredUsers.length !== users.length && ` out of ${users.length} total`}
              </Typography>
            </Box>
          )}

          <Card className="portal-users-card">
            <CardContent>
              <PortalUsersTable
                users={filteredUsers}
                selectedUserId={selectedUserId}
                anchorEl={anchorEl}
                onMenuClick={handleMenuClick}
                onMenuClose={handleMenuClose}
                onEdit={handleEditUser}
                onView={handleViewUser}
                onSuspend={handleSuspendUser}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* User Detail Modal */}
      <ActivityUserDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        user={selectedUser}
      />
    </div>
  );
};

export default PortalUsers;

