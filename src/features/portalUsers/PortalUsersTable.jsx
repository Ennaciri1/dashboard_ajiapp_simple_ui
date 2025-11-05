import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { ActionMenu } from '../../components/common';
import './PortalUsersTable.css';

const PortalUsersTable = ({
  users,
  selectedUserId,
  anchorEl,
  onMenuClick,
  onMenuClose,
  onEdit,
  onView,
  onSuspend
}) => {
  // Validate users data
  if (!users || !Array.isArray(users)) {
    return (
      <TableContainer component={Paper} className="modern-table portal-users-table">
        <Table>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell align="center" className="table-header-cell">Full Name</TableCell>
              <TableCell align="center" className="table-header-cell">Email</TableCell>
              <TableCell align="center" className="actions-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No data available
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} className="modern-table portal-users-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell align="center" className="table-header-cell">Full Name</TableCell>
            <TableCell align="center" className="table-header-cell">Email</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => {
              // Extract data from API response
              const userId = user.userId || user.id;
              const fullName = user.fullName || 'N/A';
              const email = user.email || 'N/A';
              
              return (
                <TableRow
                  key={userId}
                  className="table-data-row"
                  hover
                >
                  <TableCell align="center" className="table-data-cell">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Avatar className="table-avatar">
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2" fontWeight="600">
                        {fullName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" className="table-data-cell">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" className="actions-cell">
                    <Tooltip title="More actions">
                      <IconButton
                        size="small"
                        onClick={(e) => onMenuClick(e, userId)}
                        className="action-button"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No users found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        items={[
          {
            label: 'View',
            icon: <ViewIcon fontSize="small" />,
            onClick: () => {
              if (selectedUserId) {
                onView(selectedUserId);
              }
              onMenuClose();
            }
          },
          {
            label: 'Edit',
            icon: <EditIcon fontSize="small" />,
            onClick: () => {
              if (selectedUserId) {
                onEdit(selectedUserId);
              }
              onMenuClose();
            }
          },
          {
            label: 'Suspend',
            icon: <BlockIcon fontSize="small" />,
            onClick: () => {
              if (selectedUserId) {
                onSuspend(selectedUserId);
              }
              onMenuClose();
            }
          }
        ]}
      />
    </TableContainer>
  );
};

export default PortalUsersTable;

