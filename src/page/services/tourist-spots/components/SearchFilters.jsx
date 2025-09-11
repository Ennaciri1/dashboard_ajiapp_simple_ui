import React from 'react';
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { INTEREST_TYPES, RATING_FILTERS } from '../constants.js';
import { getRatingFilterLabel } from '../utils';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  ratingFilter,
  onRatingFilterChange,
  onAddSpot
}) => {
  return (
    <Box className="search-filters-section">
      <TextField
        className="search-field"
        placeholder="Search Name, City, Description, Type"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Box className="filters-container">
        <FormControl className="filter-select">
          <InputLabel>Interest Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            label="Interest Type"
          >
            <MenuItem value={RATING_FILTERS.ALL}>All Types</MenuItem>
            {INTEREST_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="filter-select">
          <InputLabel>Rating</InputLabel>
          <Select
            value={ratingFilter}
            onChange={(e) => onRatingFilterChange(e.target.value)}
            label="Rating"
          >
            <MenuItem value={RATING_FILTERS.ALL}>All Ratings</MenuItem>
            <MenuItem value={RATING_FILTERS.HIGH}>{getRatingFilterLabel(RATING_FILTERS.HIGH)}</MenuItem>
            <MenuItem value={RATING_FILTERS.MEDIUM}>{getRatingFilterLabel(RATING_FILTERS.MEDIUM)}</MenuItem>
            <MenuItem value={RATING_FILTERS.LOW}>{getRatingFilterLabel(RATING_FILTERS.LOW)}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddSpot}
        className="add-spot-button"
      >
        + Add Spot
      </Button>
    </Box>
  );
};

export default SearchFilters;
