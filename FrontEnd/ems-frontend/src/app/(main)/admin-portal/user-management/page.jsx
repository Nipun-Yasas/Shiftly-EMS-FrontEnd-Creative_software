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

import AdminsTab from "./_components/AdminsTab";
import UsersTab from "./_components/UsersTab";
import AllTab from "./_components/AllTab";
import VerifyTab from "./_components/VerifyTab";
import VerifyDialog from "./_components/VerifyDialog";
import DeleteDialog from "../../_components/DeleteDialog";
import TabPanel from "../../../_components/main/TabPanel";

import { useDepartments } from "../../../_hooks/useDepartments";

export default function UserManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(UserContext);

  const roles = (user?.roles || []).map((r) => r.toLowerCase());
  const isSuperAdmin = roles.includes("super_admin");

  const tabKeys = isSuperAdmin
    ? ["verify", "all", "admins", "users"]
    : ["admins", "users"];

  const [tabValue, setTabValue] = useState(() => {
    const tabParam = searchParams.get("tab");
    const idx = tabKeys.indexOf(tabParam || tabKeys[0]);
    return idx === -1 ? 0 : idx;
  });
  const [unVerified, setUnVerified] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { departments } = useDepartments();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUnverified = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.SUPER_ADMIN.GET_ALL_UNVERIFIED
      );
      setUnVerified(response.data);
    } catch (error) {
      showSnackbar("Error fetching unverified User", "error");
      setUnVerified([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.SUPER_ADMIN.GET_ALL_VERIFIED
      );

      setAll(response.data);
      console.log(all);
    } catch (error) {
      showSnackbar("Error fetching All Users", "error");
      setAll([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN_USER.GET_ALL_ADMINS
      );

      setAdmins(response.data);
      console.log(admins);
    } catch (error) {
      showSnackbar("Error fetching admins", "error");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN_USER.GET_ALL_USERS
      );

      setUsers(response.data);
      console.log(users);
    } catch (error) {
      showSnackbar("Error fetching users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        designationId:
          typeof values.designationId === "object"
            ? values.designationId?.id
            : values.designationId,
        departmentId:
          typeof values.departmentId === "object"
            ? values.departmentId?.id
            : values.departmentId,
        reportingPersonId: user?.id,
      };

      await axiosInstance.post(
        API_PATHS.EMPLOYEE.ADD(selectedRecord.id),
        payload
      );
      showSnackbar("User updated successfully", "success");
      setEditDialogOpen(false);
      setSelectedRecord(null);
      await fetchAdmins();
      await fetchUsers();
    } catch (error) {
      showSnackbar("Error updating user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const verifyData = {
        role: values.roleId?.name || values.roleId,
      };

      const response = await axiosInstance.put(
        API_PATHS.SUPER_ADMIN.VERIFY_EMPLOYEE(assigningUser.id),
        verifyData
      );

      await fetchUnverified();
      await fetchAll();
      await fetchAdmins();
      await fetchUsers();
      showSnackbar("Role assigned successfully", "success");

      setAssignDialogOpen(false);
      setAssigningUser(null);
      resetForm();
    } catch (error) {
      showSnackbar("Network error. Please check your connection.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedRecord) return;
    try {
      setLoading(true);
      const userId = selectedRecord.id ?? selectedRecord.userId;
      if (isSuperAdmin) {
        await axiosInstance.delete(API_PATHS.SUPER_ADMIN.DELETE_USER(userId));
        showSnackbar("User deleted successfully", "success");
        await fetchUnverified();
        await fetchAdmins();
        await fetchUsers();
        await fetchAll();
      } else {
        await axiosInstance.delete(API_PATHS.EMPLOYEE.DELETE(userId));
        showSnackbar("Employee record deleted successfully", "success");
        await fetchUsers();
      }
    } catch (error) {
      if (isSuperAdmin) {
        showSnackbar(
          error.response?.data?.message || "Failed to delete user",
          "error"
        );
      } else {
        showSnackbar(
          error.response?.data?.message || "Failed to delete Employee record",
          "error"
        );
      }
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const handleEdit = (row) => {
    setSelectedRecord(row);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (row) => {
    setSelectedRecord(row);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchUnverified();
    fetchAll();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabKeys[newValue]);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleOpenAssign = (row) => {
    setAssigningUser(row);
    setAssignDialogOpen(true);
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab") || tabKeys[0];
    const idx = tabKeys.indexOf(tabParam);
    setTabValue(idx === -1 ? 0 : idx);
  }, [searchParams, isSuperAdmin]);

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUnverified();
      fetchAll();
    }
  }, [isSuperAdmin]);

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user management tabs"
        >
          {isSuperAdmin && <Tab label="Verify Users" />}
          {isSuperAdmin && <Tab label="All Users" />}
          <Tab label="Verified Admins" />
          <Tab label="Verified Users" />
        </Tabs>

        {isSuperAdmin && (
          <>
            <TabPanel value={tabValue} index={0}>
              <VerifyTab
                loading={loading}
                unVerified={unVerified}
                onRefresh={handleRefresh}
                onOpenAssign={handleOpenAssign}
                handleDeleteUser={handleDeleteUser}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <AllTab
                loading={loading}
                all={all}
                onOpenAssign={handleOpenAssign}
                handleDeleteUser={handleDeleteUser}
              />
            </TabPanel>
          </>
        )}

        <TabPanel value={tabValue} index={isSuperAdmin ? 2 : 0}>
          <AdminsTab
            loading={loading}
            user={user}
            admins={admins}
            departments={departments}
            handleEdit={handleEdit}
            handleDeleteUser={handleDeleteUser}
            editDialogOpen={editDialogOpen}
            selectedRecord={selectedRecord}
            setEditDialogOpen={setEditDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            handleSubmit={handleSubmit}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={isSuperAdmin ? 3 : 1}>
          <UsersTab
            loading={loading}
            user={user}
            users={users}
            handleEdit={handleEdit}
            handleDeleteUser={handleDeleteUser}
            editDialogOpen={editDialogOpen}
            selectedRecord={selectedRecord}
            setEditDialogOpen={setEditDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            handleSubmit={handleSubmit}
          />
        </TabPanel>

        <VerifyDialog
          assignDialogOpen={assignDialogOpen}
          setAssignDialogOpen={setAssignDialogOpen}
          assigningUser={assigningUser}
          setAssigningUser={setAssigningUser}
          handleAssignSubmit={handleAssignSubmit}
          onCancel={() => {
            setAssignDialogOpen(false);
            setAssigningUser(null);
          }}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={deleteUser}
          loading={loading}
          title="Delete User"
          message={`Are you sure you want to delete the user "${selectedRecord?.username}" (${selectedRecord?.email})? This action cannot be undone.`}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
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
