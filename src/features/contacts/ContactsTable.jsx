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
  IconButton,
  Chip,
  Link
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { getContactName } from './index';

const ContactsTable = ({
  contacts,
  selectedContacts,
  onSelectAll,
  onSelectContact,
  onMenuClick
}) => {
  return (
    <TableContainer component={Paper} className="contacts-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedContacts.length > 0 && selectedContacts.length < contacts.length}
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Icon</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="contact-row">
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => onSelectContact(contact.id)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {getContactName(contact)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" textTransform="capitalize">
                  {contact.icon}
                </Typography>
              </TableCell>
              <TableCell>
                <Link href={contact.link} target="_blank" rel="noopener noreferrer">
                  {contact.link}
                </Link>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{contact.category}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={contact.active ? 'Active' : 'Inactive'}
                  color={contact.active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={(event) => onMenuClick(event, contact.id)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContactsTable;
