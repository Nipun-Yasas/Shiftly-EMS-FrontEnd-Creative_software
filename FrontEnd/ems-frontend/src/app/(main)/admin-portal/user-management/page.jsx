"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";

import AllTab from "./_components/AllTab";
import VerifyTab from "./_components/VerifyTab";
import EditDialog from "./_components/EditDialog";
import VerifyDialog from "./_components/VerifyDialog";
import DeleteDialog from "./_components/DeleteDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function UserManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Debug: Check token and user data before making request
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token) {
        showSnackbar(
          "No authentication token found. Please login again.",
          "error"
        );
        return;
      }

      const response = await axiosInstance.get(
        API_PATHS.ADMIN_USER.GET_ALL_USERS
      );

      // Handle both single user and array of users response
      let usersData = response.data;
      if (usersData && !Array.isArray(usersData)) {
        // If response is a single user object, wrap it in an array
        usersData = [usersData];
      }

      const allUsers = usersData || [];

      // Filter users based on verification status
      const verifiedUsers = allUsers.filter((user) => user.verified === true);
      const unverifiedUsers = allUsers.filter((user) => user.verified === false);

      setUsers(verifiedUsers);
      setUnverifiedUsers(unverifiedUsers);
    } catch (error) {
      showSnackbar("Error fetching users. Please try again.", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const roleData = {
        roleId: values.roleId?.id || values.roleId,
      };

      await axiosInstance.put(
        API_PATHS.ADMIN_USER.UPDATE_USER_ROLE(editingUser.id),
        roleData
      );
      showSnackbar("User role updated successfully", "success");

      setOpenDialog(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      showSnackbar("Error updating user role", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const assignData = {
        employeeNumber: values.employeeNumber,
        roleId: values.roleId?.id || values.roleId,
        userId: assigningUser.id,
      };

      await axiosInstance.post(API_PATHS.ADMIN_USER.ASSIGN_USER, assignData);
      showSnackbar("User assigned successfully", "success");

      setAssignDialogOpen(false);
      setAssigningUser(null);
      fetchUsers(); 
      resetForm();
    } catch (error) {
      console.error("Error assigning user:", error);
      showSnackbar("Error assigning user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await axiosInstance.delete(
        API_PATHS.ADMIN_USER.DELETE_USER(userToDelete.id)
      );
      showSnackbar("User deleted successfully", "success");
      setUsers(users.filter((user) => user.id !== userToDelete.id));
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Error deleting user", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleAssignUser = (user) => {
    setAssigningUser(user);
    setAssignDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user management tabs"
        >
          <Tab label="Verified Users" />
          <Tab label="Verify Users" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AllTab
            loading={loading}
            users={users}
            handleEdit={handleEdit}
            setUserToDelete={setUserToDelete}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <VerifyTab
            loading={loading}
            users={unverifiedUsers}
            handleAssignUser={handleAssignUser}
          />
        </TabPanel>

        <EditDialog
          editDialogOpen={editDialogOpen}
          setOpenDialog={setOpenDialog}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          handleSubmit={handleSubmit}
        />

        <VerifyDialog
          assignDialogOpen={assignDialogOpen}
          setAssignDialogOpen={setAssignDialogOpen}
          assigningUser={assigningUser}
          setAssigningUser={setAssigningUser}
          handleAssignSubmit={handleAssignSubmit}
        />

        <DeleteDialog
          deleteConfirmOpen={deleteConfirmOpen}
          setDeleteConfirmOpen={setDeleteConfirmOpen}
          userToDelete={userToDelete}
          handleDelete={handleDelete}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}
