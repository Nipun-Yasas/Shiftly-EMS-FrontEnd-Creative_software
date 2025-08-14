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
    GET_BY_USERID: (id) => `/api/v1/shiftly/ems/employee/${id}`,
    GET_BY_DEPARTMENTID: (id) => `/api/v1/shiftly/ems/employee/by-department/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/employee/delete/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/employee/update/${id}`,
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
  TIMESHEETS: {
    //admin endpoints
    GET_ALL: "/api/v1/shiftly/ems/timesheets/all",
    GET_BY_ADMINID: (id) => `/api/v1/shiftly/ems/timesheets/admin/${id}`,
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/timesheets/status/${id}`,
    
    //user endpoints
    ADD: (id) => `/api/v1/shiftly/ems/timesheets/add/${id}`,
    GET_BY_EMPLOYEEID: (id) => `/api/v1/shiftly/ems/timesheets/employee/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/timesheets/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/timesheets/delete/${id}`,
  },
  LEAVES: {
     //admin endpoints
    GET_ALL: "/api/v1/shiftly/ems/leaves/all",
    GET_BY_ADMINID: (id) => `/api/v1/shiftly/ems/leaves/admin/${id}`,
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/leaves/status/${id}`,

    //user endpoints
    ADD: (id) => `/api/v1/shiftly/ems/leaves/add/${id}`,
    GET_BY_EMPLOYEEID: (id) => `/api/v1/shiftly/ems/leaves/employee/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/leaves/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/leaves/delete/${id}`,
  },
  CLAIMS: {
     //admin endpoints
    GET_ALL: "/api/v1/shiftly/ems/claims/all",
    GET_BY_ADMINID: (id) => `/api/v1/shiftly/ems/claims/admin/${id}`,
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/claims/status/${id}`,

    //user endpoints
    ADD: (id) => `/api/v1/shiftly/ems/claims/add/${id}`,
    GET_BY_EMPLOYEEID: (id) => `/api/v1/shiftly/ems/claims/employee/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/claims/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/claims/delete/${id}`,
  },
  EVENTS: {
   //admin endpoints
    GET_ALL: "/api/v1/shiftly/ems/events/all",
    GET_BY_ADMINID: (id) => `/api/v1/shiftly/ems/events/admin/${id}`,
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/events/status/${id}`,

    //user endpoints
    ADD: (id) => `/api/v1/shiftly/ems/events/add/${id}`,
    GET_BY_EMPLOYEEID: (id) => `/api/v1/shiftly/ems/events/employee/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/events/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/events/delete/${id}`,
  },
  REFERRALS: {
    //admin endpoints
    GET_ALL: "/api/v1/shiftly/ems/referrals/all",
    GET_BY_ADMINID: (id) => `/api/v1/shiftly/ems/referrals/admin/${id}`,
    UPDATE_STATUS: (id) => `/api/v1/shiftly/ems/referrals/status/${id}`,

    //user endpoints
    ADD: (id) => `/api/v1/shiftly/ems/referrals/add/${id}`,
    GET_BY_EMPLOYEEID: (id) => `/api/v1/shiftly/ems/referrals/employee/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/referrals/update/${id}`,
    DELETE: (id) => `/api/v1/shiftly/ems/referrals/delete/${id}`,
  },
  VACANCIES: {
    ADD: (id) => `/api/v1/shiftly/ems/vacancies/add/${id}`,
    GET_ALL: "/api/v1/shiftly/ems/vacancies/all",
    GET_ALL_BY_DEPARTMENT: (departmentId) => `/api/v1/shiftly/ems/vacancies/by-department/${departmentId}`,
    DELETE: (id) => `/api/v1/shiftly/ems/vacancies/delete/${id}`,
    UPDATE: (id) => `/api/v1/shiftly/ems/vacancies/update/${id}`,
  },
  PROJECTS: {
    ADD_PROJECT: "/api/v1/shiftly/ems/projects/add",
    UPDATE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/update/${id}`,
    DELETE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/delete/${id}`,
    GET_ALL_PROJECTS: "/api/v1/shiftly/ems/projects/all",
    GET_MY_PROJECTS: "/api/v1/shiftly/ems/projects/my",
  },
  TEAMS: {
    GET_ALL_TEAMS: "/api/v1/shiftly/ems/teams/all",
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
  }
};
