import React, { useState } from 'react';
import { PageHeader, SearchBar, FilterSelect, DataTable } from '../../components/common';
import { sampleDashboardData } from './sampleData';
import { filterData, SEARCH_FIELDS, formatCurrency, formatDate, truncateText, FILTER_OPTIONS } from '../../utils/common';
import './Dashboard.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter data using common utility
  const filteredData = filterData(sampleDashboardData, searchTerm, {
    type: typeFilter,
    status: statusFilter
  }, SEARCH_FIELDS.DASHBOARD);

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => <span className="name-cell">{item.name}</span>
    },
    {
      key: 'type',
      label: 'Type',
      render: (item) => (
        <span className={`type-chip type-${item.type.toLowerCase()}`}>
          {item.type}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className={`status-chip status-${item.status.toLowerCase()}`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'value',
      label: 'Value',
      render: (item) => <span className="value-cell">{formatCurrency(item.value)}</span>
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      render: (item) => formatDate(item.lastUpdated)
    },
    {
      key: 'description',
      label: 'Description',
      render: (item) => <span className="description-cell">{truncateText(item.description, 40)}</span>
    }
  ];

  // Filter options
  const typeOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Monitoring', label: 'Monitoring' },
    { value: 'Support', label: 'Support' },
    { value: 'Marketing', label: 'Marketing' }
  ];

  return (
    <div className="dashboard-container">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of system metrics and analytics"
        className="dashboard-header"
      />

      <div className="search-filters">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search dashboard items..."
          className="search-input"
        />
        
        <FilterSelect
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeOptions}
          className="filter-select"
        />

        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={FILTER_OPTIONS.STATUS}
          className="filter-select"
        />

        <button className="add-button" onClick={() => alert('Add new dashboard item')}>
          + Add Item
        </button>
      </div>

      <div className="results-info">
        <span>{filteredData.length} items found</span>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        className="dashboard-table"
      />
    </div>
  );
};

export default Dashboard;