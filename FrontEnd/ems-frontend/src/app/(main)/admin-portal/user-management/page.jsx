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
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignSearchQuery, setAssignSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN_USER.GET_ALL_USERS
      );
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Error fetching users", "error");

      // Mock data for assigned users
      setUsers([
        {
          id: 1,
          username: "johndoe",
          email: "john.doe@company.com",
          roleId: { id: 1, name: "Admin" },
          designation: "Software Engineer",
          department: "Engineering",
          reporting_person: "Jane Smith",
          verifiedBy: "System Admin",
        },
        {
          id: 2,
          username: "janesmith",
          email: "jane.smith@company.com",
          roleId: { id: 2, name: "Manager" },
          designation: "Project Manager",
          department: "Project Management",
          reporting_person: "John Doe",
          verifiedBy: "System Admin",
        },
        {
          id: 3,
          username: "mikejohnson",
          email: "mike.johnson@company.com",
          roleId: { id: 3, name: "Employee" },
          designation: "HR Specialist",
          department: "Human Resources",
          reporting_person: "Sarah Connor",
          verifiedBy: "HR Manager",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN_USER.GET_UNASSIGNED_USERS
      );
      setUnassignedUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching unassigned users:", error);
      showSnackbar("Error fetching unassigned users", "error");

      // Mock data for unassigned users
      setUnassignedUsers([
        {
          id: 4,
          username: "newuser1",
          email: "newuser1@company.com",
          createdAt: "2023-07-15",
        },
        {
          id: 5,
          username: "newuser2",
          email: "newuser2@company.com",
          createdAt: "2023-07-16",
        },
      ]);
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
      fetchUnassignedUsers();
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
    if (newValue === 1) {
      fetchUnassignedUsers();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAssignSearchChange = (event) => {
    setAssignSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roleId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.reporting_person?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnassignedUsers = unassignedUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(assignSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(assignSearchQuery.toLowerCase())
  );

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
          <Tab label="All Users" />
          <Tab label="Verify Users" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AllTab
            loading={loading}
            filteredUsers={filteredUsers}
            handleEdit={handleEdit}
            setUserToDelete={setUserToDelete}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <VerifyTab
            loading={loading}
            unassignedUsers={filteredUnassignedUsers}
            handleAssignUser={handleAssignUser}
            searchQuery={assignSearchQuery}
            handleSearchChange={handleAssignSearchChange}
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
