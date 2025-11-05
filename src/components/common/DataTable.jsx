import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const DataTable = ({ 
  data = [], 
  columns = [], 
  className = "data-table",
  selectedItems = [],
  onSelectAll,
  onSelectItem,
  onMenuClick,
  showCheckbox = true,
  showActions = true
}) => {
  const isAllSelected = selectedItems.length === data.length && data.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <TableContainer component={Paper} className={`modern-table ${className}`} elevation={0}>
      <Table>
        <TableHead>
          <TableRow className="table-header-row">
            {showCheckbox && (
              <TableCell padding="checkbox" align="center" className="checkbox-cell">
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  color="primary"
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell 
                key={column.key} 
                align={column.align || 'center'} 
                className="table-header-cell"
                style={{ 
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  borderBottom: '2px solid var(--border-color)'
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {showActions && (
              <TableCell align="center" className="actions-header-cell">
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={item.id || index} 
              className="table-data-row"
              hover
              selected={selectedItems.includes(item.id)}
            >
              {showCheckbox && (
                <TableCell padding="checkbox" align="center" className="checkbox-cell">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onSelectItem && onSelectItem(item.id)}
                    color="primary"
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell 
                  key={column.key} 
                  align={column.align || 'center'} 
                  className={`table-data-cell ${column.className || ''}`}
                style={{ 
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </TableCell>
              ))}
              {showActions && (
                <TableCell align="center" className="actions-cell">
                  <Tooltip title="More actions">
                    <IconButton
                      size="small"
                      onClick={() => onMenuClick && onMenuClick(item.id, item)}
                      className="action-button"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
