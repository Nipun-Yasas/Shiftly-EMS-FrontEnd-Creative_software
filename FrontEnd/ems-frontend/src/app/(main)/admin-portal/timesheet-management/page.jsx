"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import TimesheetDataGrid from "./_components/TimesheetDataGrid";
import TimesheetDialog from "./_components/TimesheetDialog";
import { UserContext } from "../../../context/UserContext";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";

export default function TimesheetAdminReview() {
  const [allTimesheets, setAllTimesheets] = useState([]);
  const [distinctUsers, setDistinctUsers] = useState([]);
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

  // State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all timesheets and extract distinct users
  const fetchTimesheets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(API_PATHS.TIMESHEETS.GET_ALL);
      const timesheets = res.data.map((ts) => ({
        ...ts,
        name:
          ts.name ||
          ts.fullName ||
          ((ts.firstName || "") + " " + (ts.lastName || "")).trim() ||
          "Unnamed",
        department: ts.departmentName || ts.department || "",
        team: ts.team || ts.teamName || "",
        project: ts.project || ts.projectName || "",
        workMode: ts.mode || "",
        status: ts.status
          ? ts.status.charAt(0) + ts.status.slice(1).toLowerCase()
          : "",
      }));

      setAllTimesheets(timesheets);

      // Extract distinct users from timesheets
      const userMap = new Map();
      timesheets.forEach((timesheet) => {
        const userId = timesheet.userId || timesheet.employeeId;
        if (userId && !userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            userId: userId,
            name: timesheet.name,
            department: timesheet.department,
            team: timesheet.team,
            // Get the latest timesheet entry for this user
            lastSubmissionDate: timesheet.date || timesheet.submissionDate,
            totalHours: 0, // Will be calculated
            pendingCount: 0, // Will be calculated
            approvedCount: 0, // Will be calculated
          });
        }
      });

      // Calculate totals for each user
      const users = Array.from(userMap.values()).map((user) => {
        const userTimesheets = timesheets.filter(
          (ts) => (ts.userId || ts.employeeId) === user.userId
        );

        user.totalHours = userTimesheets.reduce(
          (sum, ts) => sum + (parseFloat(ts.hours) || 0),
          0
        );
        user.pendingCount = userTimesheets.filter(
          (ts) => ts.status === "Pending"
        ).length;
        user.approvedCount = userTimesheets.filter(
          (ts) => ts.status === "Approved"
        ).length;
        user.totalEntries = userTimesheets.length;

        return user;
      });

      setDistinctUsers(users);
    } catch (err) {
      console.error("Error fetching timesheets:", err);
      setAllTimesheets([]);
      setDistinctUsers([]);
      setError("Failed to fetch timesheet data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const getTeamGroupedEmployees = () => {
    const teams = {};
    distinctUsers.forEach((user) => {
      if (!teams[user.team]) {
        teams[user.team] = [];
      }
      teams[user.team].push(user);
    });
    return teams;
  };

  // Handle viewing all timesheets for a specific user
  const handleViewUserTimesheets = async (selectedUser) => {
    try {
      // Filter timesheets for the selected user from existing data
      const userTimesheets = allTimesheets.filter(
        (ts) => (ts.userId || ts.employeeId) === selectedUser.userId
      );

      setSelectedEmployee(selectedUser);
      setEmployeeTimesheets(userTimesheets);
      setTimesheetDialogOpen(true);
    } catch (err) {
      console.error("Error loading user timesheets:", err);
      setNotification({
        open: true,
        message: "Failed to load timesheet records",
        severity: "error",
      });
    }
  };

  const handleCloseTimesheetDialog = () => {
    setTimesheetDialogOpen(false);
  };

  const handleApproveTimesheet = async (timesheetId) => {
    try {
      // Update in local state
      setEmployeeTimesheets((prevTimesheets) =>
        prevTimesheets.map((timesheet) =>
          timesheet.id === timesheetId
            ? { ...timesheet, status: "Approved" }
            : timesheet
        )
      );

      // Update in all timesheets state
      setAllTimesheets((prevTimesheets) =>
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
    } catch (err) {
      console.error("Error approving timesheet:", err);
      setNotification({
        open: true,
        message: "Failed to approve timesheet",
        severity: "error",
      });
    }
  };

  const handleRejectTimesheet = async (timesheetId) => {
    try {
      // Update in local state
      setEmployeeTimesheets((prevTimesheets) =>
        prevTimesheets.map((timesheet) =>
          timesheet.id === timesheetId
            ? { ...timesheet, status: "Rejected" }
            : timesheet
        )
      );

      // Update in all timesheets state
      setAllTimesheets((prevTimesheets) =>
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
    } catch (err) {
      console.error("Error rejecting timesheet:", err);
      setNotification({
        open: true,
        message: "Failed to reject timesheet",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Filter users for Employee View: only those in admin's department
  const filteredUsers = distinctUsers.filter((userItem) => {
    // Check department match
    const departmentMatch =
      user &&
      userItem.department &&
      user.department &&
      userItem.department === user.department;
    // Optionally exclude the admin themselves (uncomment next line if needed)
    // const notAdmin = userItem.userId !== user.id;
    return departmentMatch; // && notAdmin;
  });

  const handleTimesheetUpdate = useCallback(() => {
    // Refresh the timesheet data when a status is updated
    fetchTimesheets();
  }, [fetchTimesheets]);

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Timesheet Management
          </Typography>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <TimesheetDataGrid
            data={distinctUsers}
            type="users"
            onViewTimesheets={handleViewUserTimesheets}
          />
        )}

        <TimesheetDialog
          open={timesheetDialogOpen}
          onClose={handleCloseTimesheetDialog}
          selectedEmployee={selectedEmployee}
          employeeTimesheets={employeeTimesheets}
          onApprove={handleApproveTimesheet}
          onReject={handleRejectTimesheet}
          onUpdate={handleTimesheetUpdate} // Pass the update handler
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
}