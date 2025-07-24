"use client";
import React, { useState, useEffect, useContext } from "react";
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
import { UserContext } from "../../../context/UserContext";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";

export default function TimesheetAdminReview(){
  const [tabValue, setTabValue] = useState(0);
  const [employees, setEmployees] = useState([]);
  const { user } = useContext(UserContext);

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
    if (user) {
      // Use user details from context to fill the table
      setEmployees([
        {
          id: user.id || user.employeeId || user.userId,
          name: user.name || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed',
          department: user.department || user.departmentName || '',
          team: user.team || user.teamName || '',
          project: user.project || user.projectName || '',
        },
      ]);
    } else {
      // Fallback: fetch all employees from API
      const fetchEmployees = async () => {
        try {
          const res = await axiosInstance.get(API_PATHS.ADMIN_USER.GET_ALL_USERS);
          setEmployees(res.data);
        } catch (err) {
          // handle error
        }
      };
      fetchEmployees();
    }
  }, [user]);


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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  // When viewing timesheets, only show those for the selected employee
  const handleViewTimesheets = (employee) => {
    setSelectedEmployee(employee);
    // Filter MOCK_TIMESHEETS to only those for this employee (by userId)
    const timesheetsForEmployee = MOCK_TIMESHEETS.filter(ts => ts.userId === employee.id);
    setEmployeeTimesheets(timesheetsForEmployee);
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

  // Filter employees for Employee View: only those in admin's department
  const filteredEmployees = employees.filter(emp => {
    // Check department match
    const departmentMatch = user && emp.department && user.department && emp.department === user.department;
    // Optionally exclude the admin themselves (uncomment next line if needed)
    // const notAdmin = emp.id !== user.id;
    return departmentMatch; // && notAdmin;
  });

  console.log("EMPLOYEES FOR GRIDS", employees);
  console.log("TEAM GROUPED", getTeamGroupedEmployees());
  console.log("PROJECT GROUPED", getProjectGroupedEmployees());

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
            employees={filteredEmployees}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TeamTab
            teamGroupedEmployees={getTeamGroupedEmployees()}
            onViewTimesheets={handleViewTimesheets}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ProjectTab
            projectGroupedEmployees={getProjectGroupedEmployees()}
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