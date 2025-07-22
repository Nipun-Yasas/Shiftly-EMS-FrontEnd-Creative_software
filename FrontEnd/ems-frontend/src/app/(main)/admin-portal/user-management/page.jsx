"use client";

import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import { UserContext } from "../../../context/UserContext";

import AllTab from "./_components/AllTab";
import VerifyTab from "./_components/VerifyTab";
import EditDialog from "./_components/EditDialog";
import VerifyDialog from "./_components/VerifyDialog";
import DeleteDialog from "./_components/DeleteDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function UserManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateUser } = useContext(UserContext);
  
  const getInitialTabValue = () => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'verify') return 1;
    if (tabParam === 'verified') return 0;
    return 0;
  };

  const [tabValue, setTabValue] = useState(getInitialTabValue);
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
        API_PATHS.SUPER_ADMIN.GET_ALL_EMPLOYEES
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

  // Function to refresh current user data from server
  const refreshCurrentUserData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_CURRENT_USER);
      if (response.data) {
        console.log("Refreshed user data from server:", response.data);
        updateUser(response.data);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
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
      const verifyData = {
        role: values.roleId?.name || values.roleId,
        designation: values.designation?.name || values.designation,
        department: values.department?.name || values.department, // Send department name, not ID
      };

      console.log("Sending verification data:", verifyData);

      const response = await axiosInstance.put(
        API_PATHS.SUPER_ADMIN.VERIFY_EMPLOYEE(assigningUser.id),
        verifyData
      );
      
      console.log("User verified successfully");
      console.log("Verification response:", response.data);
      
      // Update UserContext if the verified user is the current logged-in user
      if (user && (user.id === assigningUser.id || user.email === assigningUser.email)) {
        console.log("Updating current user context with new data");
        const updatedUser = {
          ...user,
          designation: verifyData.designation,
          department: verifyData.department,
          verified: true
        };
        updateUser(updatedUser);
        console.log("UserContext updated:", updatedUser);
        
        // Also refresh from server to get the latest data
        setTimeout(() => {
          refreshCurrentUserData();
        }, 1000);
      }
      
      showSnackbar("User verified and assigned successfully", "success");

      setAssignDialogOpen(false);
      setAssigningUser(null);
      fetchUsers(); 
      resetForm();
    } catch (error) {
      console.error("Error verifying user:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Error verifying user";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      showSnackbar(errorMessage, "error");
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
    
    // Update URL parameter based on tab selection
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === 0) {
      params.set('tab', 'verified');
    } else if (newValue === 1) {
      params.set('tab', 'verify');
    }
    
    // Update URL without page refresh
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Update tab value when URL changes (for direct navigation)
  useEffect(() => {
    setTabValue(getInitialTabValue());
  }, [searchParams]);

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
