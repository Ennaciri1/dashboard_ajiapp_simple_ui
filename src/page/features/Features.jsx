import React, { useState } from 'react';
import { PageHeader, SearchBar, FilterSelect, DataTable } from '../../components/common';
import { sampleFeaturesData } from './sampleData';
import { filterData, SEARCH_FIELDS, formatDate, truncateText, FILTER_OPTIONS } from '../../utils/common';
import './Features.css';

const Features = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Filter data using common utility
  const filteredData = filterData(sampleFeaturesData, searchTerm, {
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
        subtitle="Découvrez toutes les fonctionnalités disponibles"
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
          onChange={setStatu sFilter}
          options={FILTER_OPTIONS.STATUS}
          className="filter-select"
        />

        <FilterSelect
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={FILTER_OPTIONS.PRIORITY}
          className="filter-select"
        />

        <button className="add-button" onClick={() => alert('Add new feature')}>
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
