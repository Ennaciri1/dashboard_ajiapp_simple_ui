import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent } from '@mui/material';
import ContactsTable from '../../../features/contacts/ContactsTable';
import {
  sampleContacts,
  filterContacts,
  CONTACT_FILTER_DEFAULTS,
  CONTACT_FILTERS
} from '../../../features/contacts';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [contacts, setContacts] = useState(sampleContacts);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [filters, setFilters] = useState(CONTACT_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);

  const filteredContacts = useMemo(() => filterContacts(contacts, filters), [contacts, filters]);

  const handleAddContact = () => {
    navigate('/services/contact/formContact');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedContacts(filteredContacts.map((contact) => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleMenuClick = (event, contactId) => {
    setAnchorEl(event.currentTarget);
    setSelectedContactId(contactId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContactId(null);
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = CONTACT_FILTERS.map((filter) => ({
    ...filter,
    value: filters[filter.key],
    onChange: handleFilterChange(filter.key)
  }));

  const actionItems = [
    {
      key: 'view',
      label: 'Preview',
      onClick: () => showSuccess(`Opening contact ${selectedContactId}`)
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => navigate('/services/contact/formContact')
    },
    {
      key: 'toggle',
      label: 'Toggle active',
      onClick: () => showSuccess('Updating contact status')
    }
  ];

  const handleDeleteAllContacts = async () => {
    if (selectedContacts.length === 0) {
      showError('Please select contacts to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedContacts.length} selected contacts? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Update state to remove selected contacts
      setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
      
      showSuccess(`${selectedContacts.length} contacts deleted successfully`);
    } catch (error) {
      console.error('Error deleting contacts:', error);
      showError('Error deleting contacts');
    }
  };

  return (
    <div className="global-container">
      <FilterToolbar
        title="Contact Management"
        search={{
          placeholder: 'Search contacts...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add Contact',
          onClick: handleAddContact
        }}
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllContacts,
            disabled: selectedContacts.length === 0,
            color: 'error'
          }
        ]}
      />

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredContacts.length} contact{filteredContacts.length === 1 ? '' : 's'} found
          {filteredContacts.length !== contacts.length && ` out of ${contacts.length} total`}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <ContactsTable
            contacts={filteredContacts}
            selectedContacts={selectedContacts}
            onSelectAll={handleSelectAll}
            onSelectContact={handleSelectContact}
            onMenuClick={handleMenuClick}
          />
        </CardContent>
      </Card>

      <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} items={actionItems} />
    </div>
  );
};

export default Contact;
