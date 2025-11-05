import React, { useState } from 'react';
import { PageHeader, SearchBar, FilterSelect, DataTable } from '../../components/common';
import { filterData, SEARCH_FIELDS, formatCurrency, formatDate, truncateText, FILTER_OPTIONS } from '../../utils/common';
import { useNotification } from '../../contexts/NotificationContext';
import './Dashboard.css';

// Real dashboard data (can be replaced with API call later)
const dashboardData = [
  {
    id: 1,
    name: "User Analytics",
    type: "Analytics",
    status: "Active",
    lastUpdated: "2024-01-15",
    value: 1250,
    description: "User engagement and activity metrics"
  },
  {
    id: 2,
    name: "Revenue Report",
    type: "Finance",
    status: "Active",
    lastUpdated: "2024-01-14",
    value: 45000,
    description: "Monthly revenue and financial performance"
  },
  {
    id: 3,
    name: "System Health",
    type: "Monitoring",
    status: "Warning",
    lastUpdated: "2024-01-15",
    value: 85,
    description: "System performance and health monitoring"
  },
  {
    id: 4,
    name: "Customer Support",
    type: "Support",
    status: "Active",
    lastUpdated: "2024-01-13",
    value: 23,
    description: "Customer support tickets and resolution"
  }
];

const Dashboard = () => {
  const { showSuccess } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter data using common utility
  const filteredData = filterData(dashboardData, searchTerm, {
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

        <button className="add-button" onClick={() => showSuccess('Add new dashboard item')}>
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