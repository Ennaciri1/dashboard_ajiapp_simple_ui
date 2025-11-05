import React, { useState } from 'react';
import { PageHeader, SearchBar, FilterSelect, DataTable } from '../../components/common';
import { filterData, SEARCH_FIELDS, formatDate, truncateText, FILTER_OPTIONS } from '../../utils/common';
import { useNotification } from '../../contexts/NotificationContext';
import './Features.css';

// Real features data (can be replaced with API call later)
const featuresData = [
  {
    id: 1,
    name: "Performance Optimization",
    icon: "🚀",
    category: "Performance",
    status: "Active",
    description: "Fast and optimized interface for a smooth user experience.",
    priority: "High",
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    name: "Modern Design",
    icon: "🎨",
    category: "UI/UX",
    status: "Active",
    description: "Modern and intuitive user interface with dark theme support.",
    priority: "High",
    lastUpdated: "2024-01-14"
  },
  {
    id: 3,
    name: "Responsive Layout",
    icon: "📱",
    category: "UI/UX",
    status: "Active",
    description: "Compatible with all devices: desktop, tablet and mobile.",
    priority: "Medium",
    lastUpdated: "2024-01-13"
  },
  {
    id: 4,
    name: "Customization",
    icon: "🔧",
    category: "Configuration",
    status: "Active",
    description: "Easily customizable according to your needs and preferences.",
    priority: "Medium",
    lastUpdated: "2024-01-12"
  },
  {
    id: 5,
    name: "Security System",
    icon: "🔒",
    category: "Security",
    status: "Active",
    description: "Robust security system to protect your data.",
    priority: "High",
    lastUpdated: "2024-01-11"
  }
];

const Features = () => {
  const { showSuccess } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Filter data using common utility
  const filteredData = filterData(featuresData, searchTerm, {
    category: categoryFilter,
    status: statusFilter,
    priority: priorityFilter
  }, SEARCH_FIELDS.FEATURES);

  // Define table columns
  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (feature) => (
        <div className="feature-icon">
          {feature.icon}
        </div>
      )
    },
    {
      key: 'name',
      label: 'Feature Name',
      render: (feature) => <span className="name-cell">{feature.name}</span>
    },
    {
      key: 'category',
      label: 'Category',
      render: (feature) => (
        <span className={`category-chip category-${feature.category.toLowerCase().replace('/', '-')}`}>
          {feature.category}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (feature) => (
        <span className={`status-chip status-${feature.status.toLowerCase()}`}>
          {feature.status}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (feature) => (
        <span className={`priority-chip priority-${feature.priority.toLowerCase()}`}>
          {feature.priority}
        </span>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (feature) => <span className="description-cell">{truncateText(feature.description, 60)}</span>
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      render: (feature) => formatDate(feature.lastUpdated)
    }
  ];

  // Filter options
  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Performance', label: 'Performance' },
    { value: 'UI/UX', label: 'UI/UX' },
    { value: 'Configuration', label: 'Configuration' },
    { value: 'Security', label: 'Security' },
    { value: 'Analytics', label: 'Analytics' }
  ];

  return (
    <div className="features-container">
      <PageHeader
        title="Features"
        subtitle="Discover all available features"
        className="features-header"
      />

      <div className="search-filters">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search features..."
          className="search-input"
        />
        
        <FilterSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
          className="filter-select"
        />

        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={FILTER_OPTIONS.STATUS}
          className="filter-select"
        />

        <FilterSelect
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={FILTER_OPTIONS.PRIORITY}
          className="filter-select"
        />

        <button className="add-button" onClick={() => showSuccess('Add new feature')}>
          + Add Feature
        </button>
      </div>

      <div className="results-info">
        <span>{filteredData.length} features found</span>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        className="features-table"
      />
    </div>
  );
};

export default Features;
