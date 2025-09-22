import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

const ActionMenu = ({
  anchorEl,
  open,
  onClose,
  items = [],
  menuProps = {}
}) => {
  const handleItemClick = (item) => {
    item.onClick?.();
    if (item.closeOnSelect !== false) {
      onClose?.();
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right', ...menuProps.anchorOrigin }}
      transformOrigin={{ vertical: 'top', horizontal: 'right', ...menuProps.transformOrigin }}
      {...menuProps}
    >
      {items.map((item) => (
        <MenuItem
          key={item.key || item.label}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText>{item.label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ActionMenu;
