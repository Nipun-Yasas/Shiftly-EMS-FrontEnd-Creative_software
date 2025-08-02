"use client";

import { useState, useEffect, useContext } from "react";
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
  const { user } = useContext(UserContext);

  const getInitialTabValue = () => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "verify") return 1;
    if (tabParam === "verified") return 0;
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
  const [refreshInterval, setRefreshInterval] = useState(null);

  const fetchUsers = async (showLoadingState = true) => {
    if (showLoadingState) {
      setLoading(true);
    }
    try {
      const response = await axiosInstance.get(
        API_PATHS.SUPER_ADMIN.GET_ALL_EMPLOYEES
      );

      let usersData = response.data;
      const allUsers = usersData || [];

      const currentUserId = user?.id;
      const currentUserEmail = user?.email;


      // Filter out the current logged-in user from all users
      const filteredUsers = allUsers.filter((userData) => {
        // Exclude current user by ID or email
        return (
          userData.id !== currentUserId && userData.email !== currentUserEmail
        );
      });

      const verifiedUsers = filteredUsers.filter(
        (user) => user.verified === true
      );
      const unverifiedUsers = filteredUsers.filter(
        (user) => user.verified === false
      );

      setUsers(verifiedUsers);
      setUnverifiedUsers(unverifiedUsers);
    } catch (error) {
      showSnackbar(errorMessage, "error");
      setUsers([]);
      setUnverifiedUsers([]);
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        designation: values.designation?.name || values.designation,
        department: values.department?.name || values.department,
        reportingPerson: values.reportingPerson || "",
        reportingPersonEmail: values.reportingPersonEmail || "",
      };

      await axiosInstance.put(
        API_PATHS.ADMIN_USER.UPDATE_USER(editingUser.id),
        updateData
      );
      showSnackbar("User updated successfully", "success");

      setOpenDialog(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      showSnackbar("Error updating user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const verifyData = {
        role: values.roleId?.name || values.roleId
      };

      const response = await axiosInstance.put(
        API_PATHS.SUPER_ADMIN.VERIFY_EMPLOYEE(assigningUser.id),
        verifyData
      );

      showSnackbar("User verified and assigned successfully", "success");

      // Close dialog and reset state
      setAssignDialogOpen(false);
      setAssigningUser(null);
      resetForm();

      // Refresh user data to get updated lists
      await fetchUsers();
    } catch (error) {
      showSnackbar("Network error. Please check your connection.", "error");
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
      setUnverifiedUsers(
        unverifiedUsers.filter((user) => user.id !== userToDelete.id)
      );
    } catch (error) {
      showSnackbar("Network error. Please check your connection.", "error");
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

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // Update URL parameter based on tab selection
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === 0) {
      params.set("tab", "verified");
    } else if (newValue === 1) {
      params.set("tab", "verify");
    }

    // Update URL without page refresh
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Update tab value when URL changes (for direct navigation)
  useEffect(() => {
    setTabValue(getInitialTabValue());
  }, [searchParams]);

  // Set up automatic refresh when on verify tab
  useEffect(() => {
    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    // Set up new interval only if on verify tab (tab index 1)
    if (tabValue === 1) {
      const interval = setInterval(() => {
        fetchUsers(false);
      }, 30000);

      setRefreshInterval(interval);
    }

    // Cleanup function
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [tabValue]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

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
            onRefresh={handleRefresh}
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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
