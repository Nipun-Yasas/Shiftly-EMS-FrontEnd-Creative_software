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

import AllUserTab from "./_components/AllUserTab";
import AddUserTab from "./_components/AddUserTab";
import EditUserDialog from "./_components/EditUserDialog";
import DeleteConfirmDialog from "./_components/DeleteConfirmDialog";
import TabPanel from "./_components/TabPanel";

export default function UserManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const initialFormValues = {
    userId: "",
    username: "",
    email: "",
    password: "",
    roleId: null,
    isActive: true,
  };

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

      setUsers([
        {
          id: 1,
          userId: "USR001",
          username: "johndoe",
          email: "john.doe@company.com",
          roleId: { id: 1, name: "Admin" },
          isActive: true,
          employeeId: "EMP001",
          accountStatus: "Active",
          createdBy: "System Admin",
          createdAt: "2023-01-15",
        },
        {
          id: 2,
          userId: "USR002",
          username: "janesmith",
          email: "jane.smith@company.com",
          roleId: { id: 2, name: "Manager" },
          isActive: true,
          employeeId: "EMP002",
          accountStatus: "Active",
          createdBy: "System Admin",
          createdAt: "2023-03-22",
        },
        {
          id: 3,
          userId: "USR003",
          username: "mikejohnson",
          email: "mike.johnson@company.com",
          roleId: { id: 3, name: "Employee" },
          isActive: false,
          employeeId: "EMP003",
          accountStatus: "Inactive",
          createdBy: "HR Manager",
          createdAt: "2023-05-10",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const userData = {
        ...values,
        roleId: values.roleId?.id || values.roleId,
      };

      if (editingUser && !values.password) {
        delete userData.password;
      }

      if (editingUser) {
        await axiosInstance.put(
          API_PATHS.ADMIN_USER.UPDATE_USER(editingUser.id),
          userData
        );
        showSnackbar("User updated successfully", "success");
      } else {
        await axiosInstance.post(API_PATHS.ADMIN_USER.ADD_USER, userData);
        showSnackbar("User added successfully", "success");
        setTabValue(0); // Switch back to All Users tab after successful addition
      }

      resetForm();
      setOpenDialog(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showSnackbar("Error saving user", "error");
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddUserClick = () => {
    setTabValue(1); // Switch to Add User tab
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roleId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user management tabs"
        >
          <Tab label="All Users" />
          <Tab label="Add User" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AllUserTab
            loading={loading}
            filteredUsers={filteredUsers}
            handleEdit={handleEdit}
            setUserToDelete={setUserToDelete}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            handleAddUserClick={handleAddUserClick}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AddUserTab
            handleSubmit={handleSubmit}
            initialFormValues={initialFormValues}
          />
        </TabPanel>

        <EditUserDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          handleSubmit={handleSubmit}
          initialFormValues={initialFormValues}
        />

        <DeleteConfirmDialog
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
