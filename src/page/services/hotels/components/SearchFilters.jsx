import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { RATING_FILTERS, PRICE_RANGES } from '../constants.js';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  priceFilter,
  onPriceFilterChange,
  onAddHotel
}) => {
  const getRatingFilterLabel = (filter) => {
    switch (filter) {
      case RATING_FILTERS.HIGH: return 'High (4.5+)';
      case RATING_FILTERS.MEDIUM: return 'Medium (3.5-4.4)';
      case RATING_FILTERS.LOW: return 'Low (<3.5)';
      default: return 'All Ratings';
    }
  };

  const getPriceFilterLabel = (filter) => {
    switch (filter) {
      case PRICE_RANGES.BUDGET: return 'Budget (0-100$)';
      case PRICE_RANGES.MID_RANGE: return 'Mid-range (100-250$)';
      case PRICE_RANGES.LUXURY: return 'Luxury (250$+)';
      default: return 'All Prices';
    }
  };

  return (
    <Box className="search-filters-section">
      <TextField
        placeholder="Search hotels..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-field"
        InputProps={{
          startAdornment: <SearchIcon color="action" />
        }}
        variant="outlined"
        size="small"
      />
      
      <FormControl size="small" className="filter-select">
        <InputLabel>Rating</InputLabel>
        <Select
          value={ratingFilter}
          onChange={(e) => onRatingFilterChange(e.target.value)}
          label="Rating"
        >
          <MenuItem value={RATING_FILTERS.ALL}>All Ratings</MenuItem>
          <MenuItem value={RATING_FILTERS.HIGH}>High (4.5+)</MenuItem>
          <MenuItem value={RATING_FILTERS.MEDIUM}>Medium (3.5-4.4)</MenuItem>
          <MenuItem value={RATING_FILTERS.LOW}>Low (&lt;3.5)</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" className="filter-select">
        <InputLabel>Price</InputLabel>
        <Select
          value={priceFilter}
          onChange={(e) => onPriceFilterChange(e.target.value)}
          label="Price"
        >
          <MenuItem value={PRICE_RANGES.ALL}>All Prices</MenuItem>
          <MenuItem value={PRICE_RANGES.BUDGET}>Budget (0-100$)</MenuItem>
          <MenuItem value={PRICE_RANGES.MID_RANGE}>Mid-range (100-250$)</MenuItem>
          <MenuItem value={PRICE_RANGES.LUXURY}>Luxury (250$+)</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={onAddHotel}
        className="add-hotel-button"
        startIcon={<span>+</span>}
      >
        Add Hotel
      </Button>
    </Box>
  );
};

export default SearchFilters;
