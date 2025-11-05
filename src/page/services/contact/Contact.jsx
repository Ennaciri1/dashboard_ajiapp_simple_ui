import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';
import ContactsTable from '../../../features/contacts/ContactsTable';
import {
  filterContacts,
  CONTACT_FILTER_DEFAULTS,
  CONTACT_FILTERS
} from '../../../features/contacts';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import { contactService } from '../../../infrastructure/api/contactService';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [filters, setFilters] = useState(CONTACT_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredContacts = useMemo(() => filterContacts(contacts, filters), [contacts, filters]);

  // Load contacts from API
  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllContacts();
      if (response.data) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      showError('Error loading contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Reload contacts when returning to page (after add/modify)
  useEffect(() => {
    const handleFocus = () => {
      loadContacts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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

  const handleEditContact = () => {
    if (selectedContactId) {
      navigate(`/services/contact/formContact/${selectedContactId}`);
      handleMenuClose();
    }
  };

  const handleDeleteContact = async () => {
    if (selectedContactId) {
      const confirmed = window.confirm('Are you sure you want to delete this contact?');
      if (!confirmed) {
        handleMenuClose();
        return;
      }

      try {
        await contactService.deleteContact(selectedContactId);
        showSuccess('Contact deleted successfully!');
        loadContacts();
        handleMenuClose();
      } catch (error) {
        console.error('Error deleting contact:', error);
        showError('Error deleting contact');
      }
    }
  };

  const actionItems = [
    {
      key: 'view',
      label: 'View Details',
      onClick: () => showSuccess(`Viewing contact ${selectedContactId}`)
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: handleEditContact
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: handleDeleteContact
    }
  ];

  const handleDeleteAllContacts = async () => {
    if (selectedContacts.length === 0) {
      showError('Please select contacts to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedContacts.length} selected contact(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Delete each contact via API
      await Promise.all(
        selectedContacts.map(contactId => contactService.deleteContact(contactId))
      );
      
      // Reload contacts list
      await loadContacts();
      setSelectedContacts([]);
      
      showSuccess(`${selectedContacts.length} contact(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting contacts:', error);
      showError('Error deleting contacts');
    }
  };

  if (loading) {
    return (
      <div className="global-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="global-container">
      <FilterToolbar
        title="Contacts Management"
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
            label: 'Delete Selected',
            onClick: handleDeleteAllContacts,
            disabled: selectedContacts.length === 0,
            color: 'error'
          }
        ]}
      />

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
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
