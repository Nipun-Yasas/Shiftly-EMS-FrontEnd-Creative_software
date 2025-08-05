/**
 * Utility functions for claim management
 */

// Event keys for localStorage notifications
export const CLAIM_EVENTS = {
  CLAIM_SUBMITTED: 'claimSubmitted',
  CLAIM_UPDATED: 'claimUpdated',
  CLAIM_DELETED: 'claimDeleted',
};

/**
 * Notify other tabs/windows about claim changes
 * @param {string} eventType - Type of event from CLAIM_EVENTS
 * @param {Object} data - Optional data to include
 */
export const notifyClaimChange = (eventType, data = {}) => {
  const event = {
    timestamp: Date.now(),
    type: eventType,
    data
  };
  localStorage.setItem(eventType, JSON.stringify(event));
  
  // Clean up after a short delay to prevent storage bloat
  setTimeout(() => {
    localStorage.removeItem(eventType);
  }, 1000);
};

/**
 * Listen for claim change notifications
 * @param {Function} callback - Function to call when a claim event occurs
 * @returns {Function} Cleanup function to remove the listener
 */
export const listenForClaimChanges = (callback) => {
  const handleStorageChange = (e) => {
    if (Object.values(CLAIM_EVENTS).includes(e.key) && e.newValue) {
      try {
        const event = JSON.parse(e.newValue);
        callback(event);
      } catch (error) {
        console.error('Error parsing claim event:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
