import React from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';

const noop = () => {};

const FilterToolbar = ({
  title,
  subtitle,
  search,
  filters = [],
  primaryAction,
  secondaryActions = [],
  containerProps = {},
  sx = {}
}) => {
  const {
    placeholder = 'Search...',
    value: searchValue = '',
    onChange: handleSearchChange = noop,
    size = 'small',
    minWidth = 200,
    inputProps = {},
    sx: searchSx = {},
    variant = 'outlined',
    label: searchLabel,
    InputProps,
  } = search || {};

  const { elevation = 1, sx: containerSx = {}, ...paperProps } = containerProps;

  const renderFilters = () =>
    filters.map((filter) => (
      <FormControl
        key={filter.key || filter.label}
        size={filter.size || 'small'}
        sx={{ minWidth: filter.minWidth || 140, ...filter.sx }}
      >
        {filter.label && <InputLabel>{filter.label}</InputLabel>}
        <Select
          label={filter.label}
          value={filter.value}
          onChange={(event) => filter.onChange?.(event.target.value)}
        >
          {(filter.options || []).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ));

  const renderActionButton = (action, index, extraProps = {}) => (
    <Button
      key={action.key || action.label || index}
      variant={action.variant || 'contained'}
      color={action.color || 'primary'}
      startIcon={action.icon}
      onClick={action.onClick}
      disabled={action.disabled}
      {...extraProps}
    >
      {action.label}
    </Button>
  );

  return (
    <Paper elevation={elevation} sx={{ p: 2, mb: 2, ...containerSx }} {...paperProps}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          ...sx
        }}
      >
        {(title || subtitle) && (
          <Box sx={{ mr: 2 }}>
            {title && <Typography variant="h6">{title}</Typography>}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {search && (
          <TextField
            label={searchLabel}
            placeholder={placeholder}
            variant={variant}
            size={size}
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            sx={{ minWidth, ...searchSx }}
            InputProps={InputProps}
            inputProps={inputProps}
          />
        )}

        {renderFilters()}

        {secondaryActions.map((action, index) =>
          renderActionButton(action, index, { variant: action.variant || 'outlined' })
        )}

        {primaryAction && (
          <Box sx={{ ml: 'auto' }}>
            {renderActionButton(primaryAction, 'primary')}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default FilterToolbar;
