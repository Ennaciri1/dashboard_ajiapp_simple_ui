/**
 * Formatters - Utility functions for consistent data formatting
 */

/**
 * Format a date string to localized date
 * @param {string|Date} dateString - Date to format
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '-';
  }
};

/**
 * Format a date string to localized date and time
 * @param {string|Date} dateString - Date to format
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (dateString, locale = 'en-US') => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
};

/**
 * Format a number with locale-specific thousand separators
 * @param {number} value - Number to format
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted number
 */
export const formatNumber = (value, locale = 'en-US') => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return Number(value).toLocaleString(locale);
};

/**
 * Format currency value
 * @param {number} value - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

