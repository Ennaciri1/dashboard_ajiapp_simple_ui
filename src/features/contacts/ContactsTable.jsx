import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Link
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  ContactPhone as ContactPhoneIcon,
  Link as LinkIcon,
  Public as PublicIcon
} from '@mui/icons-material';

const ContactsTable = ({
  contacts,
  selectedContacts,
  onSelectAll,
  onSelectContact,
  onMenuClick
}) => {
  const getContactName = (contact) => {
    if (!contact) return '';
    
    // Use name directly or extract from nameTranslations.en
    return contact.name || (contact.nameTranslations && contact.nameTranslations.en) || '';
  };

  const getStatusColor = (active) => {
    return active ? 'success' : 'error';
  };

  const getStatusLabel = (active) => {
    return active ? 'Active' : 'Inactive';
  };

  return (
    <TableContainer component={Paper} className="modern-table contacts-table">
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell padding="checkbox" align="center" className="checkbox-cell">
              <Checkbox
                indeterminate={selectedContacts.length > 0 && selectedContacts.length < contacts.length}
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align="center" className="table-header-cell">Name</TableCell>
            <TableCell align="center" className="table-header-cell">Icon</TableCell>
            <TableCell align="center" className="table-header-cell">Link</TableCell>
            <TableCell align="center" className="table-header-cell">Status</TableCell>
            <TableCell align="center" className="actions-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow 
              key={contact.id} 
              className="table-data-row"
              hover
              selected={selectedContacts.includes(contact.id)}
            >
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => onSelectContact(contact.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Avatar className="table-avatar">
                    <ContactPhoneIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {getContactName(contact)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                {contact.icon ? (
                  <Avatar className="table-avatar">
                    <PublicIcon fontSize="small" />
                  </Avatar>
                ) : (
                  <Avatar className="table-avatar">
                    <ContactPhoneIcon fontSize="small" />
                  </Avatar>
                )}
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                {contact.link ? (
                  <Link 
                    href={contact.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-display"
                  >
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <LinkIcon fontSize="small" />
                      <Typography variant="body2">
                        Visit Link
                      </Typography>
                    </Box>
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    N/A
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center" className="table-data-cell">
                <Chip
                  label={getStatusLabel(contact.active)}
                  color={getStatusColor(contact.active)}
                  size="small"
                  className="status-chip"
                />
              </TableCell>
              <TableCell align="center" className="actions-cell">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={() => onMenuClick(contact.id, contact)}
                    className="action-button"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContactsTable;