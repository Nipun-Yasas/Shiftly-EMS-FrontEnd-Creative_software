export const BASE_URL = "http://localhost:8080";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    GET_CURRENT_USER: "/api/auth/currentuser",
  },
  SUPER_ADMIN: {
    VERIFY_EMPLOYEE: (id) => `/superadmin/employee/${id}/verify`,
    GET_ALL_UNVERIFIED: "/superadmin/unverified",
    GET_ALL_VERIFIED : "/superadmin/verified",
    GET_ADMIN_WITHOUT_DEPARTMENTS: "/superadmin/admins/without-department",
    DELETE_USER: (id) => `/users/delete/${id}`
  },
  ADMIN_USER: {
    GET_ALL: "/users/all",
    GET_ALL_ADMINS: "/users/admins/all",
    GET_ALL_USERS: "/users/all-users",
    DELETE_USER: (id) => `/users/delete/${id}`,
  },
  EMPLOYEE: {
    ADD: (userId) => `/api/v1/shiftly/ems/employee/add/${userId}`,
    DELETE: (id) => `/api/v1/shiftly/ems/employee/delete/${id}`,
  },
  DEPARTMENTS: {
    ADD: "/api/v1/shiftly/ems/departments/add",
    GET_ALL: "/api/v1/shiftly/ems/departments/all",
    DEPARTMENT_ADMIN_ASSIGN: (departmentid, userid) => `/api/v1/shiftly/ems/departments/assign/${userid}/department/${departmentid}`,
    DELETE : (departmentId) => `/api/v1/shiftly/ems/departments/delete/${departmentId}`,
    GET_DEPARTMENT_BY_ADMINID: (id) => `/api/v1/shiftly/ems/departments/by-admin/${id}`,
  },
  DESIGNATIONS:{
   ADD:(id) => `/api/v1/shiftly/ems/designations/add/${id}`,
   GET_ALL: "/api/v1/shiftly/ems/designations/all",
   GET_ALL_BY_DEPARTMENT: (departmentId) => `/api/v1/shiftly/ems/designations/by-department/${departmentId}`,
   DELETE: (id) => `/api/v1/shiftly/ems/designations/delete/${id}`,
   UPDATE: (id) => `/api/v1/shiftly/ems/designations/update/${id}`,
  },
  VACANCIES: {
    ADD: (id) => `/api/v1/shiftly/ems/vacancies/add/${id}`,
    GET_ALL: "/api/v1/shiftly/ems/vacancies/all",
    GET_ALL_BY_DEPARTMENT: (departmentId) => `/api/v1/shiftly/ems/vacancies/by-department/${departmentId}`,
    DELETE: (id) => `/api/v1/shiftly/ems/vacancies/delete/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/vacancies/update/${id}`,
  },
  CANDIDATES: {
    GET_ALL_SUBMISSIONS: "/api/v1/shiftly/ems/admin/candidates/submissions",
    GET_SUBMISSION_BY_ID: (id) =>
      `/api/v1/shiftly/ems/admin/candidates/submission/${id}`,
    MARK_AS_READ: (id) =>
      `/api/v1/shiftly/ems/admin/candidates/submission/${id}/mark-read`,
    MARK_AS_UNREAD: (id) =>
      `/api/v1/shiftly/ems/admin/candidates/submission/${id}/mark-unread`,
    GET_READ_HISTORY: (id) =>
      `/api/v1/shiftly/ems/admin/candidates/submission/${id}/read-history`,
    DOWNLOAD_RESUME: (id) =>
      `/api/v1/shiftly/ems/admin/candidates/submission/${id}/resume`,
  },
  PROJECTS: {
    ADD_PROJECT: "/api/v1/shiftly/ems/projects/add",
    UPDATE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/update/${id}`,
    DELETE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/delete/${id}`,
    GET_ALL_PROJECTS: "/api/v1/shiftly/ems/projects/all",
    GET_MY_PROJECTS: "/api/v1/shiftly/ems/projects/my",
  },
  SAMPLE: {
    ADMIN_DASHBOARD: "/api/admin/dashboard",
    USER_PROFILE: "/api/user/profile",
  },
  CALENDAR: {
    GET_EVENTS: "/api/calendar/events",
    GET_MONTH_EVENTS: "/api/calendar/month",
    GET_UPCOMING_EVENTS: "/api/calendar/upcoming",
    ADD_EVENT: "/api/calendar/events",
    UPDATE_EVENT: "/api/calendar/events",
    DELETE_EVENT: "/api/calendar/events",
  },
  TEAMS: {
    GET_ALL_TEAMS: "/api/v1/shiftly/ems/teams/all",
  },
  CLAIMS: {
    // Employee endpoints
    GET_MY_CLAIMS: (userId) => `/api/v1/shiftly/ems/claims/user/${userId}`,
    ADD: '/api/v1/shiftly/ems/claims/add',
    UPDATE: (id) => `/api/v1/shiftly/ems/claims/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/claims/delete/${id}`,
    
    // Admin endpoints
    GET_ALL_CLAIMS: '/api/v1/shiftly/ems/claims/all',
    APPROVE_CLAIM: (id) => `/api/v1/shiftly/ems/claims/approve/${id}`,
    REJECT_CLAIM: (id) => `/api/v1/shiftly/ems/claims/reject/${id}`,
    GET_CLAIM_BY_ID: (id) => `/api/v1/shiftly/ems/claims/${id}`,
  },
  LEAVES: {
    GET_MY_LEAVES: "/api/v1/shiftly/ems/leaves/my",
    UPDATE_MY_LEAVE: (id) => `/api/v1/shiftly/ems/leaves/update/${id}`,
    DELETE_MY_LEAVE: (id) => `/api/v1/shiftly/ems/leaves/delete/${id}`,
    ADD_MY_LEAVE: "/api/v1/shiftly/ems/leaves/apply",
    GET_ALL: "/api/v1/shiftly/ems/leaves/all",
    // Admin endpoints - using the actual backend implementation
    GET_ALL_LEAVES_ADMIN: "/api/v1/shiftly/ems/leaves/all",
    UPDATE_LEAVE_STATUS: (id) => `/api/v1/shiftly/ems/leaves/status/${id}`,
    // Legacy endpoints (for fallback)
    APPROVE_LEAVE_ADMIN: (id) => `/api/v1/shiftly/ems/leaves/${id}/approve`,
    REJECT_LEAVE_ADMIN: (id) => `/api/v1/shiftly/ems/leaves/${id}/reject`,
  },

  LETTER: {
    GENERATE: "/api/v1/shiftly/ems/ai-letter/generate",
    GET_BY_ID: (id) => `/api/v1/shiftly/ems/ai-letter/${id}`,
    SEND: "/api/v1/shiftly/ems/ai-letter/send",
    REQUEST: {
      ADD: "/api/v1/shiftly/ems/ai-letter/requests",
      MY: "/api/v1/shiftly/ems/ai-letter/requests/my",
      ALL: "/api/v1/shiftly/ems/ai-letter/requests/all",
      GET_BY_ID: (id) => `/api/v1/shiftly/ems/ai-letter/requests/${id}`,
    },
    GENERATE_FROM_REQUEST: (id) => `/api/v1/shiftly/ems/ai-letter/requests/${id}/generate`,
  },
  TIMESHEETS: {
    ADD: "/api/v1/shiftly/ems/timesheets/add",
    UPDATE: (id) => `/api/v1/shiftly/ems/timesheets/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/timesheets/delete/${id}`,
    GET_ALL: "/api/v1/shiftly/ems/timesheets/all",
    BY_USER: (userId) => `/api/v1/shiftly/ems/timesheets/user/${userId}`,
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/timesheets/status/${id}`,
  },
  EVENTS: {
    // Admin endpoints
    GET_ALL_EVENTS: "/api/v1/shiftly/ems/events/all",
    APPROVE_EVENT: (id) => `/api/v1/shiftly/ems/events/approve/${id}`,
    REJECT_EVENT: (id) => `/api/v1/shiftly/ems/events/reject/${id}`,
    GET_EVENT_BY_ID: (id) => `/api/v1/shiftly/ems/events/${id}`,

    // Employee endpoints
    ADD: "/api/v1/shiftly/ems/events/add",
    UPDATE: (id) => `/api/v1/shiftly/ems/events/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/events/delete/${id}`,
    GET_MY_EVENTS: (userId) => `/api/v1/shiftly/ems/events/user/${userId}`,
  },
  
  REFERRALS: {
    //admin endpoints
    ALL_REFERRALS: "/api/v1/shiftly/ems/referrals/all",
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/referrals/status/${id}`,
    
    // employee endpoints
    ADD: "/api/v1/shiftly/ems/referrals/add",
    MY_REFERRALS: "/api/v1/shiftly/ems/referrals/my",
    UPDATE: (id) => `/api/v1/shiftly/ems/referrals/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/referrals/delete/${id}`,
  },
};
