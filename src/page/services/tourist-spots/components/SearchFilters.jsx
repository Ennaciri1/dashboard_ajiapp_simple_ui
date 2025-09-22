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
import { INTEREST_TYPES, RATING_FILTERS } from '../constants';

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
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Tourist Spots Management
        </Typography>
        
        <TextField
          label="Search spots..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            label="Type"
          >
            <MenuItem value={RATING_FILTERS.ALL}>All Types</MenuItem>
            {Object.values(INTEREST_TYPES).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddSpot}
          sx={{ ml: 'auto' }}
        >
          Add Tourist Spot
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchFilters;
