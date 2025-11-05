import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useTranslations } from '../../presentation/hooks/useTranslations';
import { useLanguages } from '../../presentation/hooks/useLanguages';
import { useNotification } from '../../contexts/NotificationContext';
import TranslationCell from './TranslationCell';
import './TranslationsTable.css';

const TranslationsTable = ({
  translationsData,
  getEntityName,
  getEntityTypeLabel
}) => {
  const { languages } = useLanguages();
  const { updateTranslation, refresh } = useTranslations();
  const { showSuccess, showError } = useNotification();
  
  const [editingCell, setEditingCell] = useState(null);
  const [saving, setSaving] = useState(false);
  const [visibleRows, setVisibleRows] = useState(50); // Initial visible rows

  // Flatten translations data into rows
  const tableRows = useMemo(() => {
    console.log('🔄 Recalculating tableRows with translationsData:', translationsData);
    const rows = [];
    
    Object.keys(translationsData).forEach(entityType => {
      const entities = translationsData[entityType];
      
      Object.keys(entities).forEach(entityId => {
        const fields = entities[entityId];
        
        Object.keys(fields).forEach(fieldName => {
          const translations = fields[fieldName] || {};
          rows.push({
            entityType,
            entityId,
            fieldName,
            translations
          });
          console.log(`📋 Row: ${entityType}/${entityId}/${fieldName}`, translations);
        });
      });
    });
    
    console.log(`✅ Generated ${rows.length} rows`);
    return rows;
  }, [translationsData]);

  // Paginate rows for better performance
  const displayedRows = useMemo(() => {
    return tableRows.slice(0, visibleRows);
  }, [tableRows, visibleRows]);

  const handleCellClick = useCallback((row, languageCode) => {
    const cellKey = `${row.entityType}_${row.entityId}_${row.fieldName}_${languageCode}`;
    setEditingCell(cellKey);
  }, []);

  const handleSave = useCallback(async (row, languageCode, newValue) => {
    const cellKey = `${row.entityType}_${row.entityId}_${row.fieldName}_${languageCode}`;
    
    // Get all translations for this field, updating the edited language
    // Keep existing translations and update the edited one
    const updatedTranslations = {
      ...row.translations,
      [languageCode]: newValue || ''
    };
    
    setSaving(true);
    try {
      await updateTranslation(row.entityType, row.entityId, row.fieldName, updatedTranslations);
      setEditingCell(null);
      // Refresh happens automatically in updateTranslation
      showSuccess('Translation updated successfully');
      // Force a small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error updating translation:', error);
      // Show more detailed error message
      const errorMsg = error.message || 'Error updating translation';
      showError(errorMsg);
    } finally {
      setSaving(false);
    }
  }, [updateTranslation, refresh, showSuccess, showError]);

  const handleCancel = useCallback((cellKey) => {
    setEditingCell(null);
  }, []);

  const formatFieldName = useCallback((fieldName) => {
    return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  if (!languages || languages.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="body1" color="textSecondary">
          No supported languages found. Please add languages first.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} className="modern-table translations-table">
      <Table stickyHeader>
        <TableHead>
          <TableRow className="table-header-row">
            <TableCell className="table-header-cell sticky-column" align="left">
              Entity Type
            </TableCell>
            <TableCell className="table-header-cell sticky-column" align="left">
              Entity Name
            </TableCell>
            <TableCell className="table-header-cell sticky-column" align="left">
              Field Name
            </TableCell>
            {languages.map(language => (
              <TableCell 
                key={language.code} 
                className="table-header-cell language-column"
                align="center"
              >
                <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                  <Typography variant="body2" fontWeight="600">
                    {language.name}
                  </Typography>
                  <Chip 
                    label={language.code.toUpperCase()} 
                    size="small" 
                    variant="outlined"
                    sx={{ height: '20px', fontSize: '0.7rem' }}
                  />
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedRows.map((row) => {
            const rowKey = `${row.entityType}_${row.entityId}_${row.fieldName}`;
            const entityName = getEntityName(row.entityType, row.entityId);
            const entityTypeLabel = getEntityTypeLabel(row.entityType);
            const formattedFieldName = formatFieldName(row.fieldName);
            
            return (
              <TableRow key={rowKey} className="table-data-row">
                <TableCell className="table-data-cell sticky-column" align="left">
                  <Chip 
                    label={entityTypeLabel} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell className="table-data-cell sticky-column" align="left">
                  <Typography variant="body2" fontWeight="500">
                    {entityName}
                  </Typography>
                </TableCell>
                <TableCell className="table-data-cell sticky-column" align="left">
                  <Typography variant="body2">
                    {formattedFieldName}
                  </Typography>
                </TableCell>
                {languages.map(language => {
                  const cellKey = `${row.entityType}_${row.entityId}_${row.fieldName}_${language.code}`;
                  const isEditing = editingCell === cellKey;
                  const currentValue = row.translations[language.code] || '';
                  
                  // Debug log
                  if (isEditing || currentValue) {
                    console.log(`📝 Cell ${cellKey}:`, {
                      currentValue,
                      translations: row.translations,
                      isEditing
                    });
                  }
                  
                  return (
                    <TranslationCell
                      key={`${row.entityType}-${row.entityId}-${row.fieldName}-${language.code}-${currentValue || 'empty'}`}
                      row={row}
                      language={language}
                      currentValue={currentValue}
                      isEditing={isEditing}
                      saving={saving}
                      onCellClick={handleCellClick}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {tableRows.length > visibleRows && (
        <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Showing {displayedRows.length} of {tableRows.length} rows
          </Typography>
          <button
            onClick={() => setVisibleRows(prev => Math.min(prev + 50, tableRows.length))}
            className="load-more-btn"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Load More ({Math.min(50, tableRows.length - visibleRows)} more)
          </button>
        </Box>
      )}
    </TableContainer>
  );
};

export default TranslationsTable;

