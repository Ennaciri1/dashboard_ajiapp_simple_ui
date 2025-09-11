import React from 'react';

const FilterSelect = ({ 
  value, 
  onChange, 
  options = [], 
  className = "filter-select" 
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FilterSelect;
