export const BASE_URL = 'http://localhost:8080';

export const API_PATHS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GET_CURRENT_USER: '/auth/currentuser',
  },
  SUPER_ADMIN: {
    GET_ALL_EMPLOYEES: '/superadmin/employees',
    VERIFY_EMPLOYEE: (id) => `/superadmin/employee/${id}/verify`,
    VERIFY_ALL_EMPLOYEES: '/superadmin/verify-all',
  },
  ADMIN_USER: {
    ADD_USER: '/api/v1/shiftly/ems/admin/user/add',
    GET_ALL_USERS: '/api/v1/shiftly/ems/admin/user/all',
    GET_USER_BY_ID: (id) => `/api/v1/shiftly/ems/admin/user/${id}`,
    UPDATE_USER: (id) => `/api/v1/shiftly/ems/admin/user/update/${id}`,
    DELETE_USER: (id) => `/api/v1/shiftly/ems/admin/user/delete/${id}`,
  },
  SAMPLE: {
    ADMIN_DASHBOARD: '/api/admin/dashboard',
    USER_PROFILE: '/api/user/profile',
  },
};