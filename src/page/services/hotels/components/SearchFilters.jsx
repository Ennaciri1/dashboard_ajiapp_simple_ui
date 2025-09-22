import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RATING_FILTERS, PRICE_RANGES } from '../constants';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  priceFilter,
  onPriceFilterChange,
  onAddHotel
}) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Hotels Management
        </Typography>
        
        <TextField
          label="Search hotels..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={ratingFilter}
            onChange={(e) => onRatingFilterChange(e.target.value)}
            label="Rating"
          >
            <MenuItem value={RATING_FILTERS.ALL}>All Ratings</MenuItem>
            <MenuItem value={RATING_FILTERS.EXCELLENT}>Excellent (4.5+)</MenuItem>
            <MenuItem value={RATING_FILTERS.VERY_GOOD}>Very Good (4.0+)</MenuItem>
            <MenuItem value={RATING_FILTERS.GOOD}>Good (3.5+)</MenuItem>
            <MenuItem value={RATING_FILTERS.FAIR}>Fair (3.0+)</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Price Range</InputLabel>
          <Select
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(e.target.value)}
            label="Price Range"
          >
            <MenuItem value={PRICE_RANGES.ALL}>All Prices</MenuItem>
            <MenuItem value={PRICE_RANGES.BUDGET}>Budget (0-50€)</MenuItem>
            <MenuItem value={PRICE_RANGES.MID_RANGE}>Mid-range (50-150€)</MenuItem>
            <MenuItem value={PRICE_RANGES.LUXURY}>Luxury (150€+)</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddHotel}
          sx={{ ml: 'auto' }}
        >
          Add Hotel
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchFilters;
