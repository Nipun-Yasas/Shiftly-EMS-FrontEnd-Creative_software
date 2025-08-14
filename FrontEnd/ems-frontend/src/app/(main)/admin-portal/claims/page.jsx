"use client";

import { useState, useEffect, useContext } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import { UserContext } from "../../../context/UserContext";

import PendingTab from "./_components/PendingTab";
import ApprovedTab from "./_components/ApprovedTab";
import RejectedTab from "./_components/RejectedTab";
import AllTab from "./_components/AllTab";
import ActionDialog from "./_components/ActionDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function page() {
  const { user } = useContext(UserContext);

  const roles = (user?.roles || []).map((r) => r.toLowerCase());
  const isSuperAdmin = roles.includes("super_admin");

  const [tabValue, setTabValue] = useState(0);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchClaims = async () => {
    setLoading(true);
    try {
      let response;
      if (isSuperAdmin) {
        response = await axiosInstance.get(API_PATHS.CLAIMS.GET_ALL);
      } else {
        response = await axiosInstance.get(
          API_PATHS.CLAIMS.GET_BY_ADMINID(user?.id)
        );
      }
      setClaims(
        (response.data || []).map((r) => ({
          ...r,
          status: r.status?.toLowerCase(),
        }))
      );
    } catch (error) {
      setClaims([]);
      showSnackbar("Failed to fetch Claims", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateStatus = (record, action) => {
    setSelectedRecord(record);
    setActionType(action);
    setOpenActionDialog(true);
  };

  const updateStatus = async (status) => {
    if (!selectedRecord) return;
    try {
      await axiosInstance.put(
        `${API_PATHS.CLAIMS.UPDATE_STATUS(selectedRecord.id)}?status=${status}`
      );
      showSnackbar(
        `Claim ${status === "APPROVED" ? "approved" : "rejected"} successfully`
      );
      setOpenActionDialog(false);
      setSelectedRecord(null);
      await fetchClaims();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update Leave",
        "error"
      );
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getFilteredClaims = (status) => {
    if (status === "all") return claims;
    return claims.filter((t) => t.status === status);
  };

  const pendingCount = claims.filter((l) => l.status === "pending").length;

  const tabProps = {
    claims,
    loading,
    handleUpdateStatus,
    filterStatus,
    setFilterStatus,
  };

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        {!user ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab
                label={
                  <Badge badgeContent={pendingCount} color="warning">
                    Pending
                  </Badge>
                }
              />
              <Tab label="Approved" />
              <Tab label="Rejected" />
              <Tab label="All Claims" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <PendingTab {...tabProps} claims={getFilteredClaims("pending")} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <ApprovedTab
                {...tabProps}
                claims={getFilteredClaims("approved")}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <RejectedTab
                {...tabProps}
                claims={getFilteredClaims("rejected")}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <AllTab {...tabProps} claims={getFilteredClaims("all")} />
            </TabPanel>
          </>
        )}

        <ActionDialog
          open={openActionDialog}
          selectedRecord={selectedRecord}
          action={actionType}
          onClose={() => setOpenActionDialog(false)}
          onApprove={() => updateStatus("APPROVED")}
          onReject={() => updateStatus("REJECTED")}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
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
