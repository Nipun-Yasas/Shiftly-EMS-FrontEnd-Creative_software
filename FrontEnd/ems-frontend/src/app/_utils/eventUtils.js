/**
 * Utility functions for event management
 */

// Event keys for localStorage notifications
export const EVENT_EVENTS = {
  EVENT_SUBMITTED: 'eventSubmitted',
  EVENT_UPDATED: 'eventUpdated',
  EVENT_DELETED: 'eventDeleted',
};

/**
 * Notify other tabs/windows about event changes
 * @param {string} eventType - Type of event from EVENT_EVENTS
 * @param {Object} data - Optional data to include
 */
export const notifyEventChange = (eventType, data = {}) => {
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
 * Listen for event change notifications
 * @param {Function} callback - Function to call when an event occurs
 * @returns {Function} Cleanup function to remove the listener
 */
export const listenForEventChanges = (callback) => {
  const handleStorageChange = (e) => {
    if (Object.values(EVENT_EVENTS).includes(e.key) && e.newValue) {
      try {
        const event = JSON.parse(e.newValue);
        callback(event);
      } catch (error) {
        console.error('Error parsing event:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
