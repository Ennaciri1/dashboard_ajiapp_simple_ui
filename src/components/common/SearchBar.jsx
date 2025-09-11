import React from 'react';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "search-input" 
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
};

export default SearchBar;
