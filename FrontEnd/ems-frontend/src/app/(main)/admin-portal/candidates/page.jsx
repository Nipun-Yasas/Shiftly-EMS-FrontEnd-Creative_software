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

import UnreadTab from "./_components/UnreadTab";
import ReadTab from "./_components/ReadTab";
import AllTab from "./_components/AllTab";
import ActionDialog from "./_components/ActionDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function page() {
  const { user } = useContext(UserContext);

  const roles = (user?.roles || []).map((r) => r.toLowerCase());
  const isSuperAdmin = roles.includes("super_admin");

  const [tabValue, setTabValue] = useState(0);
  const [candidates, setCandidates] = useState([]);
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

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      let response;
      if (isSuperAdmin) {
        response = await axiosInstance.get(API_PATHS.REFERRALS.GET_ALL);
      } else {
        response = await axiosInstance.get(
          API_PATHS.REFERRALS.GET_BY_ADMINID(user?.id)
        );
      }
      setCandidates(
        (response.data || []).map((r) => ({
          ...r,
          status: r.status?.toLowerCase(),
        }))
      );
    } catch (error) {
      setCandidates([]);
      showSnackbar("Failed to fetch Candidates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
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
        `${API_PATHS.REFERRALS.UPDATE_STATUS(selectedRecord.id)}?status=${status}`
      );
      showSnackbar(
        `Referral ${status === "READ" ? "marked as read" : "unmarked as read"} successfully`
      );
      setOpenActionDialog(false);
      setSelectedRecord(null);
      await fetchCandidates();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update referral",
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

  const getFilteredCandidates = (status) => {
    if (status === "all") return candidates;
    return candidates.filter((t) => t.status === status);
  };

  const pendingCount = candidates.filter((l) => l.status === "unread").length;

  const tabProps = {
    candidates,
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
                    Unread
                  </Badge>
                }
              />
              <Tab label="Read" />
              <Tab label="All Candidates" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <UnreadTab
                {...tabProps}
                candidates={getFilteredCandidates("unread")}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <ReadTab
                {...tabProps}
                candidates={getFilteredCandidates("read")}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <AllTab {...tabProps} candidates={getFilteredCandidates("all")} />
            </TabPanel>
          </>
        )}

        <ActionDialog
          open={openActionDialog}
          selectedRecord={selectedRecord}
          action={actionType}
          onClose={() => setOpenActionDialog(false)}
          onRead={() => updateStatus("READ")}
          onUnRead={() => updateStatus("UNREAD")}
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
