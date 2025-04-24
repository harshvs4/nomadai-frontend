/**
 * Format a date to a readable string
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted date string (e.g. "Apr 24, 2025")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format a time string to a readable format
 * @param {string} timeString - Time string (e.g. "14:30" or "2023-04-24T14:30:00")
 * @returns {string} Formatted time string (e.g. "2:30 PM")
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // Handle ISO datetime strings
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Handle time-only strings (HH:MM)
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  return timeString;
};

/**
 * Format a number as currency (SGD)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string (e.g. "SGD 1,234.56")
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a duration in days with proper pluralization
 * @param {number} days - Number of days
 * @returns {string} Formatted duration string (e.g. "5 days" or "1 day")
 */
export const formatDuration = (days) => {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
};

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};