// localStorage utility functions for user data management
// Data persists across sessions and logout/login cycles

const USER_DATA_PREFIX = 'shiftly_';
const SESSION_PREFIX = 'session_';
const USER_SESSION_KEY = 'shiftly_user_session';

/**
 * Get user-specific localStorage key that persists across sessions
 * @param {string} key - The base key name
 * @param {string} userId - User identifier (username, email, or session ID)
 * @returns {string} - User-specific persistent key
 */
export const getUserKey = (key, userId = 'default') => {
  return `${USER_DATA_PREFIX}${userId}_${key}`;
};

/**
 * Get current user identifier that persists across browser sessions and logouts
 * @returns {string} - Persistent user identifier
 */
export const getCurrentUserId = () => {
  try {
    // First try to get existing user session from localStorage (persists across sessions)
    let userId = localStorage.getItem(USER_SESSION_KEY);
    
    if (!userId) {
      // Try to get from session storage (temporary session)
      userId = sessionStorage.getItem('shiftly_user_id');
      
      if (!userId) {
        // Create a new persistent user ID
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Save to both localStorage (persistent) and sessionStorage (current session)
        localStorage.setItem(USER_SESSION_KEY, userId);
        sessionStorage.setItem('shiftly_user_id', userId);
      } else {
        // Migrate from sessionStorage to localStorage for persistence
        localStorage.setItem(USER_SESSION_KEY, userId);
      }
    } else {
      // Ensure sessionStorage is in sync
      sessionStorage.setItem('shiftly_user_id', userId);
    }
    
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return 'default';
  }
};

/**
 * Set user identifier when user logs in (for multi-user scenarios)
 * @param {string} userId - User identifier (email, username, etc.)
 */
export const setUserIdentifier = (userId) => {
  try {
    // Save to both localStorage (persistent) and sessionStorage (current session)
    localStorage.setItem(USER_SESSION_KEY, userId);
    sessionStorage.setItem('shiftly_user_id', userId);
  } catch (error) {
    console.error('Error setting user identifier:', error);
  }
};

/**
 * Clear user session (logout) - removes user session but keeps data
 * @param {string} userId - Optional user identifier
 */
export const clearUserSession = (userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    
    // Clear session storage but keep localStorage data
    sessionStorage.removeItem('shiftly_user_id');
    
    // Optionally clear localStorage session key but keep user data
    // localStorage.removeItem(USER_SESSION_KEY);
    
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

/**
 * Save data to localStorage with user-specific persistent key
 * @param {string} key - The base key name
 * @param {any} data - Data to save
 * @param {string} userId - Optional user identifier
 */
export const saveUserData = (key, data, userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    const userKey = getUserKey(key, currentUserId);
    localStorage.setItem(userKey, JSON.stringify(data));
    
    // Also save a timestamp for data freshness
    localStorage.setItem(`${userKey}_timestamp`, Date.now().toString());
    
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Get data from localStorage with user-specific persistent key
 * @param {string} key - The base key name
 * @param {any} defaultValue - Default value if data doesn't exist
 * @param {string} userId - Optional user identifier
 * @returns {any} - Retrieved data or default value
 */
export const getUserData = (key, defaultValue = null, userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    const userKey = getUserKey(key, currentUserId);
    const data = localStorage.getItem(userKey);
    
    if (data) {
      const parsedData = JSON.parse(data);
      return parsedData;
    }
    
    return defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Remove specific user data from localStorage
 * @param {string} key - The base key name
 * @param {string} userId - Optional user identifier
 */
export const removeUserData = (key, userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    const userKey = getUserKey(key, currentUserId);
    localStorage.removeItem(userKey);
    localStorage.removeItem(`${userKey}_timestamp`);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Get all data for current user
 * @returns {Object} - All user data with keys
 */
export const getAllUserData = () => {
  try {
    const currentUserId = getCurrentUserId();
    const userData = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${USER_DATA_PREFIX}${currentUserId}_`)) {
        const dataKey = key.replace(`${USER_DATA_PREFIX}${currentUserId}_`, '');
        if (!dataKey.endsWith('_timestamp')) {
          const data = localStorage.getItem(key);
          if (data) {
            userData[dataKey] = JSON.parse(data);
          }
        }
      }
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting all user data:', error);
    return {};
  }
};

/**
 * Check if user has any saved data
 * @param {string} userId - Optional user identifier
 * @returns {boolean} - True if user has saved data
 */
export const hasUserData = (userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${USER_DATA_PREFIX}${currentUserId}_`)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking user data:', error);
    return false;
  }
};

/**
 * Get all user data keys for current user
 * @param {string} userId - Optional user identifier
 * @returns {string[]} - Array of user data keys
 */
export const getUserDataKeys = (userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    const userKeys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${USER_DATA_PREFIX}${currentUserId}_`)) {
        const dataKey = key.replace(`${USER_DATA_PREFIX}${currentUserId}_`, '');
        if (!dataKey.endsWith('_timestamp')) {
          userKeys.push(dataKey);
        }
      }
    }
    
    return userKeys;
  } catch (error) {
    console.error('Error getting user data keys:', error);
    return [];
  }
};

/**
 * Backup user data with timestamp
 * @param {string} userId - Optional user identifier
 * @returns {Object} - Backup data object with metadata
 */
export const backupUserData = (userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    const backup = {
      userId: currentUserId,
      timestamp: Date.now(),
      data: getAllUserData(),
      keys: getUserDataKeys(currentUserId)
    };
    
    // Save backup with timestamp
    const backupKey = `dataBackup_${currentUserId}_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(backup));
    return backup;
  } catch (error) {
    console.error('Error backing up user data:', error);
    return {};
  }
};

/**
 * Get data freshness timestamp
 * @param {string} key - The base key name
 * @param {string} userId - Optional user identifier
 * @returns {number|null} - Timestamp when data was last saved
 */
export const getDataTimestamp = (key, userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    const userKey = getUserKey(key, currentUserId);
    const timestamp = localStorage.getItem(`${userKey}_timestamp`);
    return timestamp ? parseInt(timestamp) : null;
  } catch (error) {
    console.error('Error getting data timestamp:', error);
    return null;
  }
};

/**
 * Check if data is fresh (within specified time)
 * @param {string} key - The base key name
 * @param {number} maxAge - Maximum age in milliseconds
 * @param {string} userId - Optional user identifier
 * @returns {boolean} - True if data is fresh
 */
export const isDataFresh = (key, maxAge = 24 * 60 * 60 * 1000, userId = null) => {
  const timestamp = getDataTimestamp(key, userId);
  if (!timestamp) return false;
  
  const age = Date.now() - timestamp;
  return age < maxAge;
};

/**
 * Clean up old backup data (keep only last 5 backups per user)
 */
export const cleanupOldBackups = () => {
  try {
    const currentUserId = getCurrentUserId();
    const backupKeys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`dataBackup_${currentUserId}_`)) {
        backupKeys.push(key);
      }
    }
    
    if (backupKeys.length > 5) {
      backupKeys.sort().slice(0, backupKeys.length - 5).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
  }
};

/**
 * Migrate data from old format to new user-specific format
 * @param {string} key - The base key name
 * @param {any} defaultValue - Default value if migration fails
 */
export const migrateUserData = (key, defaultValue = null) => {
  try {
    const currentUserId = getCurrentUserId();
    const oldKey = `${USER_DATA_PREFIX}${key}`;
    const newKey = getUserKey(key, currentUserId);
    
    // Check if old format data exists
    const oldData = localStorage.getItem(oldKey);
    if (oldData) {
      // Migrate to new format
      localStorage.setItem(newKey, oldData);
      localStorage.setItem(`${newKey}_timestamp`, Date.now().toString());
      
      // Remove old format data
      localStorage.removeItem(oldKey);
      return JSON.parse(oldData);
    }
    
    return defaultValue;
  } catch (error) {
    console.error(`Error migrating data for ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Handle user logout - preserve data but clear session
 */
export const handleUserLogout = () => {
  try {
    // Backup current user data before clearing session
    const currentUserId = getCurrentUserId();
    if (currentUserId !== 'default') {
      backupUserData(currentUserId);
    }
    
    // Clear session storage but keep localStorage data
    clearUserSession(currentUserId);
  } catch (error) {
    console.error('Error handling user logout:', error);
  }
};

/**
 * Initialize user session (called on app startup)
 */
export const initializeUserSession = () => {
  try {
    const userId = getCurrentUserId();
    return userId;
  } catch (error) {
    console.error('Error initializing user session:', error);
    return 'default';
  }
};

/**
 * Clear all user data (use with caution - for account deletion)
 * @param {string} userId - Optional user identifier
 */
export const clearAllUserData = (userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${USER_DATA_PREFIX}${currentUserId}_`)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Also remove user session
    localStorage.removeItem(USER_SESSION_KEY);
    sessionStorage.removeItem('shiftly_user_id');
  } catch (error) {
    console.error('Error clearing all user data:', error);
  }
}; 

/**
 * Debug function to log all localStorage data for current user
 * @param {string} userId - Optional user identifier
 */
export const debugUserData = (userId = null) => {
  try {
    const currentUserId = userId || getCurrentUserId();
    
    const allData = getAllUserData(currentUserId);
    const keys = getUserDataKeys(currentUserId);
    const hasData = hasUserData(currentUserId);
    
    // Log all localStorage keys for this user
    const userKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${USER_DATA_PREFIX}${currentUserId}_`)) {
        userKeys.push(key);
      }
    }
    
    return {
      userId: currentUserId,
      hasData,
      keys,
      data: allData,
      localStorageKeys: userKeys
    };
  } catch (error) {
    console.error('Error debugging user data:', error);
    return null;
  }
};

/**
 * Test function to verify localStorage persistence
 */
export const testLocalStoragePersistence = () => {
  try {
    
    // Test 1: Check if user session persists
    const userId1 = getCurrentUserId();
    
    // Test 2: Save some test data
    const testData = {
      testTodos: [
        { id: 1, text: 'Test todo 1', completed: false },
        { id: 2, text: 'Test todo 2', completed: true }
      ],
      testGoals: [
        { id: 1, title: 'Test goal 1', completed: false, priority: 'high', category: 'work' },
        { id: 2, title: 'Test goal 2', completed: true, priority: 'medium', category: 'personal' }
      ],
      testSettings: { theme: 'dark', notifications: true }
    };
  
    
    // Test 3: Verify data was saved
    const savedTodos = getUserData('testTodos', null, userId1);
    const savedGoals = getUserData('testGoals', null, userId1);
    const savedSettings = getUserData('testSettings', null, userId1);
    
    // Test 4: Simulate logout (clear session storage)
    sessionStorage.removeItem('shiftly_user_id');
    
    // Test 5: Get user ID again (should be same)
    const userId2 = getCurrentUserId();
    
    // Test 6: Retrieve data after logout simulation
    const retrievedTodos = getUserData('testTodos', null, userId2);
    const retrievedGoals = getUserData('testGoals', null, userId2);
    const retrievedSettings = getUserData('testSettings', null, userId2)
    
    const todosPersisted = JSON.stringify(savedTodos) === JSON.stringify(retrievedTodos);
    const goalsPersisted = JSON.stringify(savedGoals) === JSON.stringify(retrievedGoals);
    const settingsPersisted = JSON.stringify(savedSettings) === JSON.stringify(retrievedSettings);
    
    // Clean up test data
    removeUserData('testTodos', userId2);
    removeUserData('testGoals', userId2);
    removeUserData('testSettings', userId2);
    
    return {
      success: true,
      userId1,
      userId2,
      todosPersisted,
      goalsPersisted,
      settingsPersisted,
      allPersisted: todosPersisted && goalsPersisted && settingsPersisted
    };
  } catch (error) {
    console.error('Error testing localStorage persistence:', error);
    return { success: false, error: error.message };
  }
}; 