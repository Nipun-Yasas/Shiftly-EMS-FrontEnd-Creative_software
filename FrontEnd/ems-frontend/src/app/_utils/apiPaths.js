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
  },
  ADMIN_USER: {
    GET_ALL_USERS: '/users/all',
    GET_USER_BY_ID: (id) => `/users/${id}`,
    UPDATE_USER: (id) => `/users/update/${id}`,
    DELETE_USER: (id) => `/users/delete/${id}`,
  },
  CANDIDATES: {
    GET_ALL_SUBMISSIONS: '/api/v1/shiftly/ems/admin/candidates/submissions',
    GET_SUBMISSION_BY_ID: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}`,
    MARK_AS_READ: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/mark-read`,
    MARK_AS_UNREAD: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/mark-unread`,
    GET_READ_HISTORY: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/read-history`,
    DOWNLOAD_RESUME: (id) => `/api/v1/shiftly/ems/admin/candidates/submission/${id}/resume`,
  },
  PROJECTS: {
    ADD_PROJECT: '/api/v1/shiftly/ems/projects/add',
    UPDATE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/update/${id}`,
    DELETE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/delete/${id}`,
    GET_ALL_PROJECTS: '/api/v1/shiftly/ems/projects/all',
    GET_MY_PROJECTS: '/api/v1/shiftly/ems/projects/my',
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
  EVENTS: {
    // Admin endpoints
    GET_ALL_EVENTS: '/api/v1/shiftly/ems/events/all',
    APPROVE_EVENT: (id) => `/api/v1/shiftly/ems/events/approve/${id}`,
    REJECT_EVENT: (id) => `/api/v1/shiftly/ems/events/reject/${id}`,
    GET_EVENT_BY_ID: (id) => `/api/v1/shiftly/ems/events/${id}`,
    
    // Employee endpoints
    ADD_EVENT: '/api/v1/shiftly/ems/events/add',
    UPDATE_EVENT: (id) => `/api/v1/shiftly/ems/events/update/${id}`,
    DELETE_EVENT: (id) => `/api/v1/shiftly/ems/events/delete/${id}`,
    GET_MY_EVENTS: (employeeId) => `/api/v1/shiftly/ems/events/my/${employeeId}`,
  },
  DEPARTMENTS: {
    GET_ALL_DEPARTMENTS: '/api/v1/shiftly/ems/departments/all',
  },
  TEAMS: {
    GET_ALL_TEAMS: '/api/v1/shiftly/ems/teams/all',
  },
  EMPLOYEE: {
    ADD_EMPLOYEE: '/api/v1/shiftly/ems/employee/add',
    GET_ALL_EMPLOYEES: '/api/v1/shiftly/ems/employee/all',
    GET_EMPLOYEE_BY_ID: (id) => `/api/v1/shiftly/ems/employee/${id}`,
    DELETE_EMPLOYEE: (id) => `/api/v1/shiftly/ems/employee/delete/${id}`,
    UPDATE_EMPLOYEE: (id) => `/api/v1/shiftly/ems/employee/update/${id}`,
    GET_PROFILE: '/api/v1/shiftly/ems/employee/profile',
    UPDATE_PROFILE: '/api/v1/shiftly/ems/employee/profile',
    SELF_UPDATE: '/api/v1/shiftly/ems/employee/self-update',
  },
  CLAIMS: {
    GET_CLAIMS_BY_USER_ID: (userId) => `/api/v1/shiftly/ems/claims/user/${userId}`,
    CREATE_CLAIM: '/api/v1/shiftly/ems/claims/add',
    UPDATE_CLAIM: (id) => `/api/v1/shiftly/ems/claims/update/${id}`,
    DELETE_CLAIM: (id) => `/api/v1/shiftly/ems/claims/delete/${id}`,
  },
  VACANCIES: {
    GET_ALL_VACANCIES: '/api/v1/shiftly/ems/vacancies/all',
  },

  REFERRALS: {
    ADD: '/api/v1/shiftly/ems/referrals/add',
    MY_REFERRALS: '/api/v1/shiftly/ems/referrals/my',
    ALL_REFERRALS: '/api/v1/shiftly/ems/referrals/all',
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/referrals/status/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/referrals/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/referrals/delete/${id}`,
    GET_BY_USER_ID: (userId) => `/api/v1/shiftly/ems/referrals/user/${userId}`,
  },
  LEAVES: {
    
    GET_MY_LEAVES: '/api/v1/shiftly/ems/leaves/my',
    UPDATE_MY_LEAVE: (id) => `/api/v1/shiftly/ems/leaves/update/${id}`,
    DELETE_MY_LEAVE: (id) => `/api/v1/shiftly/ems/leaves/delete/${id}`,
    ADD_MY_LEAVE: '/api/v1/shiftly/ems/leaves/apply',
  },
};
