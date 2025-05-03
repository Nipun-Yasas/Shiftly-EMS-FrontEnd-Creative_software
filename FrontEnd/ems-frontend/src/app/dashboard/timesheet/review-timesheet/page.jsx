"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Divider,
  Alert,
  Snackbar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";

/**
 * Timesheet Admin Review Page
 * Allows admins to search employees, view their timesheet records,
 * and approve or reject timesheet entries
 */
const TimesheetAdminReview = () => {
  // State for employee list
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for current view
  const [viewTab, setViewTab] = useState(0); // 0 for Employee View, 1 for Team View
  
  // State for timesheet details
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [timesheetDialogOpen, setTimesheetDialogOpen] = useState(false);
  const [employeeTimesheets, setEmployeeTimesheets] = useState([]);
  
  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Mock data - In a real application, this would come from an API
  useEffect(() => {
    // Mock employee data
    const mockEmployees = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@company.com",
        team: "Development",
        project: "Web Platform",
        pendingSubmissions: 2,
        profileImage: "/images/avatars/1.jpg"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@company.com",
        team: "Design",
        project: "Mobile App",
        pendingSubmissions: 1,
        profileImage: "/images/avatars/2.jpg"
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert.johnson@company.com",
        team: "Development",
        project: "Web Platform",
        pendingSubmissions: 0,
        profileImage: "/images/avatars/3.jpg"
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@company.com",
        team: "QA",
        project: "Mobile App",
        pendingSubmissions: 3,
        profileImage: "/images/avatars/4.jpg"
      },
      {
        id: 5,
        name: "Michael Wilson",
        email: "michael.wilson@company.com",
        team: "Design",
        project: "Web Platform",
        pendingSubmissions: 1,
        profileImage: "/images/avatars/5.jpg"
      }
    ];
    
    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

  // Mock timesheet data for a specific employee
  const getMockTimesheets = (employeeId) => {
    return [
      {
        id: 101,
        date: "15 Jan",
        projectTask: "E_Interview",
        workMode: "Online",
        activity: "Development",
        hours: "8.00",
        status: "Pending"
      },
      {
        id: 102,
        date: "16 Jan",
        projectTask: "Web_Platform",
        workMode: "On-site",
        activity: "Development",
        hours: "7.50",
        status: "Pending"
      },
      {
        id: 103,
        date: "17 Jan",
        projectTask: "Bench_Engineering",
        workMode: "Online",
        activity: "Training",
        hours: "6.00",
        status: "Pending"
      },
      {
        id: 104,
        date: "18 Jan",
        projectTask: "Web_Platform",
        workMode: "On-site",
        activity: "Meeting",
        hours: "8.00",
        status: "Pending"
      }
    ];
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.project.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setViewTab(newValue);
  };

  // Open timesheet dialog
  const handleViewTimesheets = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeTimesheets(getMockTimesheets(employee.id));
    setTimesheetDialogOpen(true);
  };

  // Close timesheet dialog
  const handleCloseTimesheetDialog = () => {
    setTimesheetDialogOpen(false);
  };

  // Handle timesheet approval
  const handleApproveTimesheet = (timesheetId) => {
    // In a real app, you would make an API call here
    setEmployeeTimesheets(
      employeeTimesheets.map((timesheet) =>
        timesheet.id === timesheetId
          ? { ...timesheet, status: "Approved" }
          : timesheet
      )
    );
    
    setNotification({
      open: true,
      message: "Timesheet entry approved successfully",
      severity: "success"
    });
  };

  // Handle timesheet rejection
  const handleRejectTimesheet = (timesheetId) => {
    // In a real app, you would make an API call here
    setEmployeeTimesheets(
      employeeTimesheets.map((timesheet) =>
        timesheet.id === timesheetId
          ? { ...timesheet, status: "Rejected" }
          : timesheet
      )
    );
    
    setNotification({
      open: true,
      message: "Timesheet entry rejected",
      severity: "error"
    });
  };

  // Close notification
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  // Group employees by team for the team view
  const getTeamGroupedEmployees = () => {
    const teams = {};
    employees.forEach((employee) => {
      if (!teams[employee.team]) {
        teams[employee.team] = [];
      }
      teams[employee.team].push(employee);
    });
    return teams;
  };

  // Group employees by project
  const getProjectGroupedEmployees = () => {
    const projects = {};
    employees.forEach((employee) => {
      if (!projects[employee.project]) {
        projects[employee.project] = [];
      }
      projects[employee.project].push(employee);
    });
    return projects;
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" component="h1" className="mb-6">
        Timesheet Administration
      </Typography>

      {/* Search and Filter Section */}
      <Paper className="p-4 mb-6">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name, email, team or project..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          {/* Filter button removed as requested */}
        </Grid>
      </Paper>

      {/* View Tabs */}
      <Box className="mb-4">
        <Tabs value={viewTab} onChange={handleTabChange} aria-label="timesheet view tabs">
          <Tab label="Employee View" />
          <Tab label="Team View" />
          <Tab label="Project View" />
        </Tabs>
      </Box>

      {/* Employee View */}
      {viewTab === 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="employee timesheets">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Employee</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Pending Submissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Box className="flex items-center">
                        <Box className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <PersonIcon />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textPrimary">{employee.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {employee.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.team}</TableCell>
                    <TableCell>{employee.project}</TableCell>
                    <TableCell>
                      {employee.pendingSubmissions > 0 ? (
                        <Chip
                          label={`${employee.pendingSubmissions} Pending`}
                          color="warning"
                          size="small"
                        />
                      ) : (
                        <Chip label="None" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        color="inherit"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewTimesheets(employee)}
                      >
                        View Timesheets
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No employees found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Team View */}
      {viewTab === 1 && (
        <Box>
          {Object.entries(getTeamGroupedEmployees()).map(([team, teamEmployees]) => (
            <Paper key={team} className="mb-6 overflow-hidden">
              <Box className="bg-gray-100 p-4">
                <Typography variant="h6">{team} Team</Typography>
                <Typography variant="body2">
                  {teamEmployees.length} employee(s), {
                    teamEmployees.reduce((sum, emp) => sum + emp.pendingSubmissions, 0)
                  } pending timesheet(s)
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Pending Submissions</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Box className="flex items-center">
                            <Box className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <PersonIcon />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">{employee.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {employee.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{employee.project}</TableCell>
                        <TableCell>
                          {employee.pendingSubmissions > 0 ? (
                            <Chip
                              label={`${employee.pendingSubmissions} Pending`}
                              color="warning"
                              size="small"
                            />
                          ) : (
                            <Chip label="None" color="success" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="text"
                            size="small"
                            color="inherit"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewTimesheets(employee)}
                          >
                            View Timesheets
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Box>
      )}

      {/* Project View */}
      {viewTab === 2 && (
        <Box>
          {Object.entries(getProjectGroupedEmployees()).map(([project, projectEmployees]) => (
            <Paper key={project} className="mb-6 overflow-hidden">
              <Box className="bg-gray-100 p-4">
                <Typography variant="h6">{project}</Typography>
                <Typography variant="body2">
                  {projectEmployees.length} employee(s), {
                    projectEmployees.reduce((sum, emp) => sum + emp.pendingSubmissions, 0)
                  } pending timesheet(s)
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell>Pending Submissions</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Box className="flex items-center">
                            <Box className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <PersonIcon />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">{employee.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {employee.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{employee.team}</TableCell>
                        <TableCell>
                          {employee.pendingSubmissions > 0 ? (
                            <Chip
                              label={`${employee.pendingSubmissions} Pending`}
                              color="warning"
                              size="small"
                            />
                          ) : (
                            <Chip label="None" color="success" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewTimesheets(employee)}
                          >
                            View Timesheets
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Box>
      )}

      {/* Timesheet Detail Dialog */}
      <Dialog
        open={timesheetDialogOpen}
        onClose={handleCloseTimesheetDialog}
        fullWidth
        maxWidth="md"
      >
        {selectedEmployee && (
          <>
            <DialogTitle>
              <Box className="flex justify-between items-center">
                <Typography variant="h6">
                  Timesheet Records: {selectedEmployee.name}
                </Typography>
                <IconButton onClick={handleCloseTimesheetDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box className="mb-4">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box className="flex items-center mb-2">
                      <Box className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <PersonIcon fontSize="large" />
                      </Box>
                      <Box>
                        <Typography variant="h6">{selectedEmployee.name}</Typography>
                        <Typography variant="body2">{selectedEmployee.email}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2">
                      <strong>Team:</strong> {selectedEmployee.team}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Project:</strong> {selectedEmployee.project}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className="bg-gray-100 p-3 rounded">
                      <Typography variant="body2" className="mb-1">
                        <strong>Pending Submissions:</strong> {selectedEmployee.pendingSubmissions}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> 3 days ago
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider className="my-4" />

              <Typography variant="h6" className="mb-3">
                Timesheet Entries
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell>Date</TableCell>
                      <TableCell>Project Task</TableCell>
                      <TableCell>Work Mode</TableCell>
                      <TableCell>Activity</TableCell>
                      <TableCell>Hours</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employeeTimesheets.map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell>{timesheet.date}</TableCell>
                        <TableCell>{timesheet.projectTask}</TableCell>
                        <TableCell>{timesheet.workMode}</TableCell>
                        <TableCell>{timesheet.activity}</TableCell>
                        <TableCell>{timesheet.hours}</TableCell>
                        <TableCell>
                          <Chip
                            label={timesheet.status}
                            color={getStatusColor(timesheet.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {timesheet.status === "Pending" && (
                            <Box className="flex space-x-1">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveTimesheet(timesheet.id)}
                                title="Approve"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectTimesheet(timesheet.id)}
                                title="Reject"
                              >
                                <CancelIcon />
                              </IconButton>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseTimesheetDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TimesheetAdminReview;