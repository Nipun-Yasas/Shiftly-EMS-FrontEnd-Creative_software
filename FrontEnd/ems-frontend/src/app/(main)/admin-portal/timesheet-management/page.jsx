"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";

import EmployeeTab from "./_components/EmployeeTab";
import TeamTab from "./_components/TeamTab";
import ProjectTab from "./_components/ProjectTab";
import TabPanel from "../../../_components/main/TabPanel";
import TimesheetDialog from "./_components/TimesheetDialog";

// Constants for mock data
const MOCK_EMPLOYEES = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    team: "Development",
    project: "Web Platform",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    team: "Design",
    project: "Mobile App",
    department: "Design",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    team: "Development",
    project: "Web Platform",
    department: "Engineering",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    team: "QA",
    project: "Mobile App",
    department: "Quality Assurance",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@company.com",
    team: "Design",
    project: "Web Platform",
    department: "Design",
  },
];

const MOCK_TIMESHEETS = [
  {
    id: 101,
    date: "2024-08-31",
    projectTask: "E_Interview",
    workMode: "Online",
    activity: "Development",
    hours: "8.00",
    status: "Pending",
  },
  {
    id: 102,
    date: "2024-08-30",
    projectTask: "Web_Platform",
    workMode: "On-site",
    activity: "Development",
    hours: "7.50",
    status: "Pending",
  },
  {
    id: 103,
    date: "2024-10-03",
    projectTask: "Bench_Engineering",
    workMode: "Online",
    activity: "Training",
    hours: "6.00",
    status: "Pending",
  },
  {
    id: 104,
    date: "2024-09-20",
    projectTask: "Web_Platform",
    workMode: "On-site",
    activity: "Meeting",
    hours: "8.00",
    status: "Pending",
  },
];

export default function TimesheetAdminReview(){
  const [tabValue, setTabValue] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // State for timesheet details
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [timesheetDialogOpen, setTimesheetDialogOpen] = useState(false);
  const [employeeTimesheets, setEmployeeTimesheets] = useState([]);

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize employees with mock data on component mount
  useEffect(() => {
    setEmployees(MOCK_EMPLOYEES);
  }, []);

  // Filter employees based on search query
  const getFilteredEmployees = () => {
    if (searchQuery.trim() === "") {
      return employees;
    }

    const query = searchQuery.toLowerCase();
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.team.toLowerCase().includes(query) ||
        employee.project.toLowerCase().includes(query)
    );
  };

  // Group employees by team
  const getTeamGroupedEmployees = () => {
    const teams = {};
    const filteredEmployees = getFilteredEmployees();
    
    filteredEmployees.forEach((employee) => {
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
    const filteredEmployees = getFilteredEmployees();
    
    filteredEmployees.forEach((employee) => {
      if (!projects[employee.project]) {
        projects[employee.project] = [];
      }
      projects[employee.project].push(employee);
    });
    return projects;
  };

  // Event handlers without useCallback
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewTimesheets = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeTimesheets(MOCK_TIMESHEETS);
    setTimesheetDialogOpen(true);
  };

  const handleCloseTimesheetDialog = () => {
    setTimesheetDialogOpen(false);
  };

  const handleApproveTimesheet = (timesheetId) => {
    setEmployeeTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) =>
        timesheet.id === timesheetId
          ? { ...timesheet, status: "Approved" }
          : timesheet
      )
    );

    setNotification({
      open: true,
      message: "Timesheet entry approved successfully",
      severity: "success",
    });
  };

  const handleRejectTimesheet = (timesheetId) => {
    setEmployeeTimesheets((prevTimesheets) =>
      prevTimesheets.map((timesheet) =>
        timesheet.id === timesheetId
          ? { ...timesheet, status: "Rejected" }
          : timesheet
      )
    );

    setNotification({
      open: true,
      message: "Timesheet entry rejected",
      severity: "error",
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="timesheet management tabs"
        >
          <Tab label="Employee View" />
          <Tab label="Team View" />
          <Tab label="Project View" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <EmployeeTab
            employees={getFilteredEmployees()}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TeamTab
            teamGroupedEmployees={getTeamGroupedEmployees()}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ProjectTab
            projectGroupedEmployees={getProjectGroupedEmployees()}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TimesheetDialog
          open={timesheetDialogOpen}
          onClose={handleCloseTimesheetDialog}
          selectedEmployee={selectedEmployee}
          employeeTimesheets={employeeTimesheets}
          onApprove={handleApproveTimesheet}
          onReject={handleRejectTimesheet}
        />

        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
    </Paper>
  );
};