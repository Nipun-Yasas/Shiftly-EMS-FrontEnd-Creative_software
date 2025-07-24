/**
 * Utility functions for managing employee profile status cache
 */

const EMPLOYEE_PROFILE_CACHE_KEY = "hasEmployeeProfile";

export const employeeProfileCache = {
  /**
   * Set employee profile status in cache
   * @param {boolean} hasProfile - Whether the user has an employee profile
   */
  setStatus: (hasProfile) => {
    sessionStorage.setItem(EMPLOYEE_PROFILE_CACHE_KEY, hasProfile.toString());
  },

  /**
   * Get employee profile status from cache
   * @returns {boolean|null} - True if has profile, false if doesn't have, null if not cached
   */
  getStatus: () => {
    const cached = sessionStorage.getItem(EMPLOYEE_PROFILE_CACHE_KEY);
    if (cached === null) return null;
    return cached === "true";
  },

  /**
   * Clear employee profile status from cache
   */
  clear: () => {
    sessionStorage.removeItem(EMPLOYEE_PROFILE_CACHE_KEY);
  },

  /**
   * Check if status is cached
   * @returns {boolean} - Whether the status is cached
   */
  isCached: () => {
    return sessionStorage.getItem(EMPLOYEE_PROFILE_CACHE_KEY) !== null;
  }
};
