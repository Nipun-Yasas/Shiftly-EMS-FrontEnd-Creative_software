export const BASE_URL = 'http://localhost:8080';

export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    GET_CURRENT_USER: '/api/auth/currentuser',
  },
  SUPER_ADMIN: {
    GET_ALL_EMPLOYEES: '/superadmin/employees',
    VERIFY_EMPLOYEE: (id) => `/superadmin/employee/${id}/verify`,
    VERIFY_ALL_EMPLOYEES: '/superadmin/verify-all',
  },
  ADMIN_USER: {
    ADD_USER: '/api/v1/shiftly/ems/admin/user/add',
    GET_ALL_USERS: '/users/all',
    GET_USER_BY_ID: (id) => `/users/${id}`,
    UPDATE_USER: (id) => `/users/update/${id}`,
    DELETE_USER: (id) => `/users/delete/${id}`,
    GET_UNASSIGNED_USERS: '/api/v1/shiftly/ems/admin/user/unassigned',
    ASSIGN_USER: '/api/v1/shiftly/ems/admin/user/assign',
    UPDATE_USER_ROLE: (id) => `/api/v1/shiftly/ems/admin/user/role/${id}`,
  },
  CANDIDATES: {
    GET_ALL_SUBMISSIONS: '/api/v1/shiftly/ems/admin/candidates/submissions',
    GET_SUBMISSION_BY_ID: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}`,
    MARK_AS_READ: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/mark-read`,
    MARK_AS_UNREAD: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/mark-unread`,
    GET_READ_HISTORY: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/read-history`,
    DOWNLOAD_RESUME: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/resume`,
  },
  SAMPLE: {
    ADMIN_DASHBOARD: '/api/admin/dashboard',
    USER_PROFILE: '/api/user/profile',
  },
  CALENDAR: {
    GET_EVENTS: '/api/calendar/events',
    GET_MONTH_EVENTS: '/api/calendar/month',
    GET_UPCOMING_EVENTS: '/api/calendar/upcoming',
    ADD_EVENT: '/api/calendar/events',
    UPDATE_EVENT: '/api/calendar/events',
    DELETE_EVENT: '/api/calendar/events',
  },
};