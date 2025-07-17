"use client";
import React, { useState, useEffect,useMemo,useCallback } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";

import EmployeeViewTab from "./_components/EmployeeViewTab";
import TeamViewTab from "./_components/TeamViewTab";
import ProjectViewTab from "./_components/ProjectViewTab";
import TabPanel from "../_components/TabPanel";
import TimesheetDialog from "./_components/TimesheetDialog";

// Constants for mock data
const MOCK_EMPLOYEES = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    team: "Development",
    project: "Web Platform",
    pendingSubmissions: 2,
    profileImage: "/images/avatars/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    team: "Design",
    project: "Mobile App",
    pendingSubmissions: 1,
    profileImage: "/images/avatars/2.jpg",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    team: "Development",
    project: "Web Platform",
    pendingSubmissions: 0,
    profileImage: "/images/avatars/3.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    team: "QA",
    project: "Mobile App",
    pendingSubmissions: 3,
    profileImage: "/images/avatars/4.jpg",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@company.com",
    team: "Design",
    project: "Web Platform",
    pendingSubmissions: 1,
    profileImage: "/images/avatars/5.jpg",
  },
];

const MOCK_TIMESHEETS = [
  {
    id: 101,
    date: "15 Jan",
    projectTask: "E_Interview",
    workMode: "Online",
    activity: "Development",
    hours: "8.00",
    status: "Pending",
  },
  {
    id: 102,
    date: "16 Jan",
    projectTask: "Web_Platform",
    workMode: "On-site",
    activity: "Development",
    hours: "7.50",
    status: "Pending",
  },
  {
    id: 103,
    date: "17 Jan",
    projectTask: "Bench_Engineering",
    workMode: "Online",
    activity: "Training",
    hours: "6.00",
    status: "Pending",
  },
  {
    id: 104,
    date: "18 Jan",
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

  // Mock data initialization
  useEffect(() => {
    setEmployees(MOCK_EMPLOYEES);
  }, []);

  // Memoized filtered employees
  const filteredEmployees = useMemo(() => {
    if (searchQuery.trim() === "") {
      return employees;
    }

    const query = searchQuery.toLowerCase();
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.team.toLowerCase().includes(query) ||
        employee.project.toLowerCase().includes(query)
    );
  }, [searchQuery, employees]);

  // Memoized grouped employees
  const teamGroupedEmployees = useMemo(() => {
    const teams = {};
    filteredEmployees.forEach((employee) => {
      if (!teams[employee.team]) {
        teams[employee.team] = [];
      }
      teams[employee.team].push(employee);
    });
    return teams;
  }, [filteredEmployees]);

  const projectGroupedEmployees = useMemo(() => {
    const projects = {};
    filteredEmployees.forEach((employee) => {
      if (!projects[employee.project]) {
        projects[employee.project] = [];
      }
      projects[employee.project].push(employee);
    });
    return projects;
  }, [filteredEmployees]);

  // Optimized event handlers with useCallback
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleViewTimesheets = useCallback((employee) => {
    setSelectedEmployee(employee);
    setEmployeeTimesheets(MOCK_TIMESHEETS);
    setTimesheetDialogOpen(true);
  }, []);

  const handleCloseTimesheetDialog = useCallback(() => {
    setTimesheetDialogOpen(false);
  }, []);

  const handleApproveTimesheet = useCallback((timesheetId) => {
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
  }, []);

  const handleRejectTimesheet = useCallback((timesheetId) => {
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
  }, []);

  const handleCloseNotification = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
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
          <EmployeeViewTab
            employees={filteredEmployees}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TeamViewTab
            teamGroupedEmployees={teamGroupedEmployees}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ProjectViewTab
            projectGroupedEmployees={projectGroupedEmployees}
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

