import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent } from '@mui/material';
import VisasTable from '../../../features/visas/VisasTable';
import {
  sampleVisas,
  filterVisas,
  VISA_FILTER_DEFAULTS,
  VISA_FILTERS
} from '../../../features/visas';
import { FilterToolbar, ActionMenu } from '../../../components/common';
import { useNotification } from '../../../contexts/NotificationContext';
import './Visa.css';

const Visa = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [visas, setVisas] = useState(sampleVisas);
  const [selectedVisas, setSelectedVisas] = useState([]);
  const [filters, setFilters] = useState(VISA_FILTER_DEFAULTS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisaId, setSelectedVisaId] = useState(null);

  const filteredVisas = useMemo(() => filterVisas(visas, filters), [visas, filters]);

  const handleAddVisa = () => {
    navigate('/services/visa/formVisa');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedVisas(filteredVisas.map((visa) => visa.id));
    } else {
      setSelectedVisas([]);
    }
  };

  const handleSelectVisa = (visaId) => {
    setSelectedVisas((prev) =>
      prev.includes(visaId) ? prev.filter((id) => id !== visaId) : [...prev, visaId]
    );
  };

  const handleMenuClick = (event, visaId) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisaId(visaId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVisaId(null);
  };

  const handleFilterChange = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toolbarFilters = VISA_FILTERS.map((filter) => ({
    ...filter,
    value: filters[filter.key],
    onChange: handleFilterChange(filter.key)
  }));

  const actionItems = [
    {
      key: 'view',
      label: 'View details',
      onClick: () => showSuccess(`Viewing visa ${selectedVisaId}`)
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => navigate('/services/visa/formVisa')
    },
    {
      key: 'duplicate',
      label: 'Duplicate',
      onClick: () => showSuccess('Duplicating visa entry')
    }
  ];

  const handleDeleteAllVisas = async () => {
    if (selectedVisas.length === 0) {
      showError('Please select visas to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedVisas.length} selected visas? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Update state to remove selected visas
      setVisas(prev => prev.filter(visa => !selectedVisas.includes(visa.id)));
      setSelectedVisas([]);
      
      showSuccess(`${selectedVisas.length} visas deleted successfully`);
    } catch (error) {
      console.error('Error deleting visas:', error);
      showError('Error deleting visas');
    }
  };

  return (
    <div className="global-container">
      <FilterToolbar
        title="Visa Requirements"
        search={{
          placeholder: 'Search countries or nationalities...',
          value: filters.search,
          onChange: (value) => setFilters((prev) => ({ ...prev, search: value }))
        }}
        filters={toolbarFilters}
        primaryAction={{
          label: 'Add Visa',
          onClick: handleAddVisa
        }}
        secondaryActions={[
          {
            label: 'Delete All',
            onClick: handleDeleteAllVisas,
            disabled: selectedVisas.length === 0,
            color: 'error'
          }
        ]}
      />

      <Box className="results-indicator">
        <Typography variant="body2" color="textSecondary">
          {filteredVisas.length} visa{filteredVisas.length === 1 ? '' : 's'} found
          {filteredVisas.length !== visas.length && ` out of ${visas.length} total`}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <VisasTable
            visas={filteredVisas}
            selectedVisas={selectedVisas}
            onSelectAll={handleSelectAll}
            onSelectVisa={handleSelectVisa}
            onMenuClick={handleMenuClick}
          />
        </CardContent>
      </Card>

      <ActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} items={actionItems} />
    </div>
  );
};

export default Visa;
