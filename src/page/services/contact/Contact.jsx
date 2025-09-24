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
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const [contacts] = useState(sampleContacts);
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
      onClick: () => alert(`Opening contact ${selectedContactId}`)
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => navigate('/services/contact/formContact')
    },
    {
      key: 'toggle',
      label: 'Toggle active',
      onClick: () => alert('Updating contact status')
    }
  ];

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
