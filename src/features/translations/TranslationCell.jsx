import React, { memo, useState, useEffect } from 'react';
import {
  TableCell,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const TranslationCell = memo(({
  row,
  language,
  currentValue,
  isEditing,
  saving,
  onCellClick,
  onSave,
  onCancel
}) => {
  const cellKey = `${row.entityType}_${row.entityId}_${row.fieldName}_${language.code}`;
  const isMultiline = row.fieldName === 'description' || row.fieldName === 'address';
  
  // Local state for edited value - prevents parent re-renders on every keystroke
  const [localEditedValue, setLocalEditedValue] = useState(currentValue);

  // Sync local value when editing starts or currentValue changes
  useEffect(() => {
    if (isEditing) {
      setLocalEditedValue(currentValue);
    } else {
      // Always sync when not editing (especially after save)
      setLocalEditedValue(currentValue);
    }
  }, [isEditing, currentValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isMultiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSave = () => {
    onSave(row, language.code, localEditedValue);
  };

  const handleCancel = () => {
    setLocalEditedValue(currentValue);
    onCancel(cellKey);
  };

  if (isEditing) {
    return (
      <TableCell 
        className="table-data-cell language-cell"
        align="left"
        sx={{ 
          cursor: 'default',
          position: 'relative'
        }}
      >
        <Box className="translation-cell-editor">
          <TextField
            fullWidth
            multiline={isMultiline}
            rows={isMultiline ? 3 : 1}
            value={localEditedValue}
            onChange={(e) => setLocalEditedValue(e.target.value)}
            variant="outlined"
            size="small"
            autoFocus
            disabled={saving}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          />
          <Box className="translation-cell-actions" onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={handleSave}
                disabled={saving}
                color="primary"
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={handleCancel}
                disabled={saving}
                color="default"
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </TableCell>
    );
  }

  return (
    <TableCell 
      className="table-data-cell language-cell"
      align="left"
      onClick={() => onCellClick(row, language.code)}
      sx={{ 
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    >
      <Box className="translation-cell-content">
        <Typography 
          variant="body2" 
          className={currentValue ? 'translation-text' : 'translation-empty'}
          title={currentValue || 'Click to add translation'}
        >
          {currentValue || (
            <span className="translation-placeholder">—</span>
          )}
        </Typography>
        <IconButton
          size="small"
          className="translation-edit-icon"
          onClick={(e) => {
            e.stopPropagation();
            onCellClick(row, language.code);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
    </TableCell>
  );
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render), false if different (re-render)
  // Compare currentValue first as it's the most important prop
  if (prevProps.currentValue !== nextProps.currentValue) {
    console.log('🔄 TranslationCell will re-render (currentValue changed):', {
      prev: prevProps.currentValue,
      next: nextProps.currentValue,
      cellKey: `${prevProps.row.entityType}_${prevProps.row.entityId}_${prevProps.row.fieldName}_${prevProps.language.code}`
    });
    return false; // Re-render
  }
  
  // Compare other important props
  if (
    prevProps.isEditing !== nextProps.isEditing ||
    prevProps.saving !== nextProps.saving ||
    prevProps.row.entityType !== nextProps.row.entityType ||
    prevProps.row.entityId !== nextProps.row.entityId ||
    prevProps.row.fieldName !== nextProps.row.fieldName ||
    prevProps.language.code !== nextProps.language.code
  ) {
    return false; // Re-render
  }
  
  // Also check translations object to catch any missed updates
  const prevTranslations = prevProps.row.translations || {};
  const nextTranslations = nextProps.row.translations || {};
  const prevTranslationValue = prevTranslations[prevProps.language.code] || '';
  const nextTranslationValue = nextTranslations[nextProps.language.code] || '';
  
  if (prevTranslationValue !== nextTranslationValue) {
    console.log('🔄 TranslationCell will re-render (translation object changed):', {
      prev: prevTranslationValue,
      next: nextTranslationValue,
      cellKey: `${prevProps.row.entityType}_${prevProps.row.entityId}_${prevProps.row.fieldName}_${prevProps.language.code}`
    });
    return false; // Re-render
  }
  
  return true; // Skip re-render, props are equal
});

TranslationCell.displayName = 'TranslationCell';

export default TranslationCell;

