# Project Management Frontend-Backend Integration

## Overview
This document outlines the complete integration between the frontend and backend for the Project Management module in the Shiftly EMS system.

## Changes Made

### 1. API Endpoints Configuration (`src/app/_utils/apiPaths.js`)
Added complete project management endpoints:
```javascript
PROJECTS: {
  ADD_PROJECT: "/api/v1/shiftly/ems/projects/add",
  UPDATE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/update/${id}`,
  DELETE_PROJECT: (id) => `/api/v1/shiftly/ems/projects/delete/${id}`,
  GET_ALL_PROJECTS: "/api/v1/shiftly/ems/projects/all",
  GET_MY_PROJECTS: "/api/v1/shiftly/ems/projects/my"
}
```

### 2. Backend Data Mapping
The frontend now correctly maps to the backend Project DTO:
```javascript
// Backend DTO Structure
{
  projectId: number,
  name: string,
  description: string,
  teamId: number,
  teamName: string,
  startDate: string (YYYY-MM-DD),
  endDate: string (YYYY-MM-DD),
  departmentId: number,
  departmentName: string,
  progress: number (0-100)
}
```

### 3. Enhanced Project Management Functions

#### fetchProjects()
- Uses correct endpoint: `GET_ALL_PROJECTS`
- Maps backend data to frontend format
- Handles errors gracefully with fallback to demo data
- Provides user feedback via snackbar

#### handleAddSubmit()
- Maps form data to backend DTO format
- Handles team and department selection
- Provides comprehensive error handling for 400/403/500 errors
- Shows success/error messages to users
- Refreshes project list after successful creation

#### handleEditSubmit()
- Updates projects using correct endpoint with project ID
- Maps form data to backend DTO format
- Handles all error scenarios
- Updates local state and refreshes from server

#### handleDelete()
- Uses correct delete endpoint with project ID
- Handles 404 (not found) and 500 (server error) scenarios
- Provides immediate UI feedback
- Refreshes project list after deletion

### 4. Error Handling Strategy
- **400 Bad Request**: Shows validation error messages
- **403 Forbidden**: Shows permission error messages
- **404 Not Found**: Shows resource not found messages
- **500 Server Error**: Shows server error messages
- **Network Errors**: Shows connection error messages

### 5. User Experience Enhancements
- Real-time feedback via Material-UI Snackbar
- Immediate UI updates for better responsiveness
- Comprehensive error messages
- Debug logging for development
- Graceful fallback to demo data when backend is unavailable

## Usage Instructions

### Testing the Integration
1. **Add Project**: Fill out the form in the "Add Project" tab and submit
2. **View Projects**: All projects are displayed in the "All Projects" tab
3. **Edit Project**: Click the edit icon on any project row
4. **Delete Project**: Click the delete icon and confirm deletion

### Debugging
- Open browser console to see detailed debug logs
- All API calls are logged with request/response data
- Error responses are logged for troubleshooting

### Backend Requirements
Ensure your Spring Boot backend has these endpoints implemented:
- `POST /api/v1/shiftly/ems/projects/add`
- `GET /api/v1/shiftly/ems/projects/all`
- `PUT /api/v1/shiftly/ems/projects/update/{id}`
- `DELETE /api/v1/shiftly/ems/projects/delete/{id}`

## Error Prevention
- Always validate data before sending to backend
- Use try-catch blocks for all API calls
- Provide user-friendly error messages
- Log errors for debugging
- Implement fallback mechanisms

## Future Enhancements
1. Implement `GET_MY_PROJECTS` endpoint for user-specific projects
2. Add project filtering and searching capabilities
3. Implement project status tracking
4. Add project analytics and reporting
5. Implement real-time updates using WebSockets

## Technical Notes
- Uses Axios for HTTP requests with interceptors
- Material-UI components for consistent UI
- React hooks for state management
- Formik/Yup for form validation
- Custom error handling middleware

This integration ensures robust, error-free communication between frontend and backend for all project management operations.
