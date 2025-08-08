/**
 * Utility functions for referral management
 */

// Event keys for localStorage notifications
export const REFERRAL_EVENTS = {
  REFERRAL_SUBMITTED: 'referralSubmitted',
  REFERRAL_UPDATED: 'referralUpdated',
  REFERRAL_DELETED: 'referralDeleted',
};

/**
 * Notify other tabs/windows about referral changes
 * @param {string} eventType - Type of event from REFERRAL_EVENTS
 * @param {Object} data - Optional data to include
 */
export const notifyReferralChange = (eventType, data = {}) => {
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
 * Listen for referral change notifications
 * @param {Function} callback - Function to call when a referral event occurs
 * @returns {Function} Cleanup function to remove the listener
 */
export const listenForReferralChanges = (callback) => {
  const handleStorageChange = (e) => {
    if (Object.values(REFERRAL_EVENTS).includes(e.key) && e.newValue) {
      try {
        const event = JSON.parse(e.newValue);
        callback(event);
      } catch (error) {
        console.error('Error parsing referral event:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
