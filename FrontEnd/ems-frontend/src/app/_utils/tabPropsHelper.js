/**
 * Common tab props helper for admin portal pages
 * Creates standardized props object for tab components
 */

/**
 * Creates common tab props for leaves management
 * @param {Object} params - Parameters object
 * @param {Array} params.data - Array of data items (leaves, users, candidates, etc.)
 * @param {boolean} params.loading - Loading state
 * @param {Function} params.onViewDetails - View details handler
 * @param {Function} params.onApprovalAction - Approval action handler
 * @param {string} params.filterStatus - Current filter status
 * @param {Function} params.setFilterStatus - Filter status setter
 * @returns {Object} Tab props object
 */
export const createLeavesTabProps = ({
  data,
  loading,
  onViewDetails,
  onApprovalAction,
  filterStatus,
  setFilterStatus
}) => ({
  leaves: data,
  loading,
  onViewDetails,
  onApprovalAction,
  filterStatus,
  setFilterStatus
});

/**
 * Creates common tab props for user management
 * @param {Object} params - Parameters object
 * @param {Array} params.data - Array of users
 * @param {boolean} params.loading - Loading state
 * @param {Function} params.onEdit - Edit handler
 * @param {Function} params.onDelete - Delete handler
 * @param {Function} params.onAssign - Assign handler
 * @returns {Object} Tab props object
 */
export const createUserTabProps = ({
  data,
  loading,
  onEdit,
  onDelete,
  onAssign
}) => ({
  users: data,
  loading,
  handleEdit: onEdit,
  setUserToDelete: onDelete,
  setDeleteConfirmOpen: onDelete,
  handleAssignUser: onAssign
});

/**
 * Creates common tab props for candidates management
 * @param {Object} params - Parameters object
 * @param {Array} params.data - Array of candidates
 * @param {boolean} params.loading - Loading state
 * @param {Function} params.onViewDetails - View details handler
 * @param {Function} params.onApprove - Approve handler
 * @param {Function} params.onReject - Reject handler
 * @param {string} params.searchQuery - Search query
 * @param {Function} params.setSearchQuery - Search query setter
 * @param {string} params.filterStatus - Filter status
 * @param {Function} params.setFilterStatus - Filter status setter
 * @returns {Object} Tab props object
 */
export const createCandidatesTabProps = ({
  data,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus
}) => ({
  candidates: data,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus
});

/**
 * Generic tab props creator for any data type
 * @param {Object} params - Parameters object
 * @param {Array} params.data - Array of data items
 * @param {boolean} params.loading - Loading state
 * @param {Object} params.handlers - Object containing handler functions
 * @param {Object} params.filters - Object containing filter states and setters
 * @param {string} params.dataKey - Key name for the data in props (e.g., 'users', 'leaves', 'candidates')
 * @returns {Object} Tab props object
 */
export const createGenericTabProps = ({
  data,
  loading,
  handlers = {},
  filters = {},
  dataKey = 'data'
}) => ({
  [dataKey]: data,
  loading,
  ...handlers,
  ...filters
});
