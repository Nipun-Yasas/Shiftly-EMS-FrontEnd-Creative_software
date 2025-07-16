"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";

import PendingClaimsTab from "./_components/PendingClaimsTab";
import ApprovedClaimsTab from "./_components/ApprovedClaimsTab";
import RejectedClaimsTab from "./_components/RejectedClaimsTab";
import AllClaimsTab from "./_components/AllClaimsTab";
import ClaimDetailsDialog from "./_components/ClaimDetailsDialog";
import ClaimDialog from "./_components/ClaimDialog";
import TabPanel from "../_components/TabPanel";

export default function ClaimsManagementPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [approvalAction, setApprovalAction] = useState("");

  // Sample claims data - replace with actual API calls
  const sampleClaims = [
    {
      id: 1,
      employee_name: "John Smith",
      employeeEmail: "john.smith@company.com",
      department: "Engineering",
      type: "Medical",
      description: "Routine medical checkup and prescription costs",
      amount: 250.0,
      claimDate: "2025-07-10T00:00:00",
      submission_date: "2025-07-12T14:30:00",
      status: "pending",
      attachments: ["medical-receipt-001.pdf", "prescription-receipt.pdf"],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    },
    {
      id: 2,
      employee_name: "Sarah Johnson",
      employeeEmail: "sarah.johnson@company.com",
      department: "Marketing",
      type: "Travel",
      description: "Business trip expenses for client meeting in New York",
      amount: 1200.5,
      claimDate: "2025-07-08T00:00:00",
      submission_date: "2025-07-09T10:15:00",
      status: "approved",
      attachments: [
        "flight-receipt.pdf",
        "hotel-receipt.pdf",
        "taxi-receipts.pdf",
      ],
      approvedBy: "Admin User",
      approvedAt: "2025-07-10T11:30:00",
      rejectionReason: null,
    },
    {
      id: 3,
      employee_name: "Mike Chen",
      employeeEmail: "mike.chen@company.com",
      department: "IT",
      type: "Equipment",
      description: "Laptop repair and maintenance",
      amount: 450.0,
      claimDate: "2025-07-05T00:00:00",
      submission_date: "2025-07-06T09:20:00",
      status: "rejected",
      attachments: ["repair-invoice.pdf"],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: "Equipment not covered under current policy",
    },
  ];

  // Fetch claims data
  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      // For demo purposes, use sample data
      // const response = await axiosInstance.get(API_PATHS.CLAIMS);
      // setClaims(response.data.data || []);
      setClaims(sampleClaims);
      setError(null);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError(err.response?.data?.message || "Failed to fetch claims");
    } finally {
      setLoading(false);
    }
  };

  // Handle claim action
  const handleClaimAction = async (claimId, action, reason = "") => {
    try {
      // For demo purposes, update local state
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === claimId
            ? {
                ...claim,
                status: action,
                rejectionReason: action === "rejected" ? reason : null,
              }
            : claim
        )
      );

      // const response = await axiosInstance.put(`${API_PATHS.CLAIMS}/${claimId}/status`, {
      //   status: action,
      //   reason: reason
      // });

      setSnackbarMessage(`Claim ${action} successfully`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Refresh claims data
      // await fetchClaims();
    } catch (err) {
      console.error("Error updating claim:", err);
      setSnackbarMessage(
        err.response?.data?.message || "Failed to update claim"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle view claim
  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setDialogOpen(true);
    setDialogType("view");
  };

  // Handle approve/reject
  const handleApprovalAction = (claim, action) => {
    setSelectedClaim(claim);
    setApprovalAction(action);
    setApprovalDialogOpen(true);
  };

  // Get filtered claims
  const getFilteredClaims = (status = "all") => {
    return claims.filter((claim) => {
      const matchesStatus = status === "all" || claim.status === status;
      const matchesSearch =
        !searchQuery ||
        claim.employee_name
          ?.toLowerCase()
          .includes(String(searchQuery).toLowerCase()) ||
        claim.type?.toLowerCase().includes(String(searchQuery).toLowerCase()) ||
        claim.description
          ?.toLowerCase()
          .includes(String(searchQuery).toLowerCase());
      const matchesCategory =
        filterCategory === "all" || claim.category === filterCategory;

      return matchesStatus && matchesSearch && matchesCategory;
    });
  };

  // Get counts for badges
  const getCounts = () => {
    return {
      all: claims.length,
      pending: claims.filter((c) => c.status === "pending").length,
    };
  };

  const counts = getCounts();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedClaim(null);
    setDialogType("");
  };

  // Handle approval dialog close
  const handleApprovalDialogClose = () => {
    setApprovalDialogOpen(false);
    setSelectedClaim(null);
    setApprovalAction("");
  };

  const tabProps = {
    claims: getFilteredClaims(),
    loading,
    onViewClaim: handleViewClaim,
    onApprovalAction: handleApprovalAction,
    searchQuery,
    onSearchChange: (event) => setSearchQuery(event.target.value),
    filterStatus,
    setFilterStatus,
  };

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Badge badgeContent={counts.pending} color="warning">
                <Box sx={{ px: 1 }}>Pending</Box>
              </Badge>
            }
          />
          <Tab label="Approved" />
          <Tab label="Rejected" />
          <Tab label="All Claims" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <PendingClaimsTab {...tabProps} claims={getFilteredClaims("pending")} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ApprovedClaimsTab
          {...tabProps}
          claims={getFilteredClaims("approved")}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <RejectedClaimsTab
          {...tabProps}
          claims={getFilteredClaims("rejected")}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <AllClaimsTab {...tabProps} claims={getFilteredClaims("all")} />
      </TabPanel>

      {/* Claim Details Dialog */}
      <ClaimDetailsDialog
        open={dialogOpen}
        claim={selectedClaim}
        onClose={handleDialogClose}
      />

      {/* Claim Dialog */}
      <ClaimDialog
        open={approvalDialogOpen}
        claim={selectedClaim}
        action={approvalAction}
        onClose={handleApprovalDialogClose}
        onApprove={(reason) => {
          handleClaimAction(selectedClaim?.id, "approved", reason);
          handleApprovalDialogClose();
        }}
        onReject={(reason) => {
          handleClaimAction(selectedClaim?.id, "rejected", reason);
          handleApprovalDialogClose();
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
