"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";

import EmployeeViewTab from "./_components/EmployeeViewTab";
import TeamViewTab from "./_components/TeamViewTab";
import ProjectViewTab from "./_components/ProjectViewTab";
import TabPanel from "../_components/TabPanel";
import TimesheetDialog from "./_components/TimesheetDialog";

const TimesheetAdminReview = () => {
  const [tabValue, setTabValue] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewTab, setViewTab] = useState(0);

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

  // Mock data
  useEffect(() => {
    const mockEmployees = [
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

    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

  // Mock timesheet data
  const getMockTimesheets = (employeeId) => {
    return [
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle view tab change
  const handleViewTabChange = (event, newValue) => {
    setViewTab(newValue);
  };

  // Handle search change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
      severity: "success",
    });
  };

  // Handle timesheet rejection
  const handleRejectTimesheet = (timesheetId) => {
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
      severity: "error",
    });
  };

  // Close notification
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Group employees by team (using filtered employees)
  const getTeamGroupedEmployees = () => {
    const teams = {};
    filteredEmployees.forEach((employee) => {
      if (!teams[employee.team]) {
        teams[employee.team] = [];
      }
      teams[employee.team].push(employee);
    });
    return teams;
  };

  // Group employees by project (using filtered employees)
  const getProjectGroupedEmployees = () => {
    const projects = {};
    filteredEmployees.forEach((employee) => {
      if (!projects[employee.project]) {
        projects[employee.project] = [];
      }
      projects[employee.project].push(employee);
    });
    return projects;
  };

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
          <Tab label="Reports" />
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
            teamGroupedEmployees={getTeamGroupedEmployees()}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ProjectViewTab
            projectGroupedEmployees={getProjectGroupedEmployees()}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6">Timesheet Reports</Typography>
            <Typography variant="body2" color="text.secondary">
              Reports functionality coming soon...
            </Typography>
          </Box>
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

export default TimesheetAdminReview;
