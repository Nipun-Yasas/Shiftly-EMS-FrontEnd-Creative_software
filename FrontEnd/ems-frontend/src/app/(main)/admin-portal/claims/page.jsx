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

import PendingTab from "./_components/PendingTab";
import ApprovedTab from "./_components/ApprovedTab";
import RejectedTab from "./_components/RejectedTab";
import AllTab from "./_components/AllTab";
import DetailsDialog from "./_components/DetailsDialog";
import ClaimDialog from "./_components/ClaimDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function ClaimsManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openApprovalDialog, setApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalReason, setApprovalReason] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      console.log("Fetching claims from backend...");
      
      const response = await axiosInstance.get(API_PATHS.CLAIMS.GET_ALL_CLAIMS);
      console.log("Backend claims response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend data to frontend format
        const mappedClaims = response.data.map(claim => ({
          id: claim.id,
          employee_name: `Employee ${claim.userId}`, // Will need to fetch employee details later
          employeeEmail: `employee${claim.userId}@company.com`, // Placeholder
          department: "Unknown", // Not in backend DTO, will need to fetch
          type: claim.claimType,
          description: claim.description,
          amount: Math.floor(Math.random() * 1000) + 100, // Placeholder amount until backend includes it
          claimDate: claim.claimDate,
          submission_date: claim.createdAt || new Date().toISOString(),
          status: claim.status.toLowerCase(),
          attachments: claim.claimUrl ? [claim.claimUrl] : [],
          approvedBy: claim.status === 'APPROVED' ? 'Admin' : null,
          approvedAt: claim.status === 'APPROVED' ? new Date().toISOString() : null,
          rejectionReason: claim.status === 'REJECTED' ? 'Claim rejected by admin' : null,
          // Backend specific fields
          userId: claim.userId,
          claimUrl: claim.claimUrl,
        }));
        
        console.log("Mapped claims:", mappedClaims);
        setClaims(mappedClaims);
      } else {
        console.warn("Invalid response format or no data");
        setClaims([]);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      console.error("Error details:", error.response?.data);
      
      showSnackbar("Failed to fetch claims from server", "error");
      
      // Fallback to sample data for demo
      setClaims(sampleClaims);
    } finally {
      setLoading(false);
    }
  };

  // Handle claim action
  const submitApprovalAction = async () => {
    if (!selectedClaim || !approvalAction) return;

    try {
      console.log(`${approvalAction}ing claim:`, selectedClaim.id);
      
      // Call appropriate API endpoint based on action
      let response;
      if (approvalAction === "approve") {
        response = await axiosInstance.put(API_PATHS.CLAIMS.APPROVE_CLAIM(selectedClaim.id));
      } else {
        response = await axiosInstance.put(API_PATHS.CLAIMS.REJECT_CLAIM(selectedClaim.id));
      }
      
      console.log("Approval response:", response.data);

      // Update local state with the response from backend
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === selectedClaim.id
            ? {
                ...claim,
                status: response.data.status.toLowerCase(),
                approvedBy: response.data.status === 'APPROVED' ? "Current Admin" : null,
                approvedAt: response.data.status === 'APPROVED' ? new Date().toISOString() : null,
                rejectionReason: response.data.status === 'REJECTED' ? approvalReason || "Claim rejected by admin" : null,
              }
            : claim
        )
      );

      showSnackbar(
        `Claim ${approvalAction === "approve" ? "approved" : "rejected"} successfully`,
        "success"
      );
      setApprovalDialogOpen(false);
      setOpenDetailDialog(false);
      
      // Refresh claims to get latest data
      fetchClaims();
      
    } catch (error) {
      console.error(`Error ${approvalAction}ing claim:`, error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = `Error ${approvalAction}ing claim`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Claim not found. It may have been deleted.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error while processing the request.";
      }
      
      showSnackbar(errorMessage, "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setOpenDetailDialog(true);
  };

  const handleApprovalAction = (claim, action) => {
    setSelectedClaim(claim);
    setApprovalAction(action);
    setApprovalReason("");
    setApprovalDialogOpen(true);
  };

  const getFilteredClaims = (status) => {
    if (status === "all") {
      return claims;
    }
    return claims.filter((claim) => claim.status === status);
  };

  const pendingCount = claims.filter((l) => l.status === "pending").length;

  const tabProps = {
    claims: claims,
    loading,
    onViewClaim: handleViewDetails,
    onApprovalAction: handleApprovalAction,
    filterStatus,
    setFilterStatus,
  };

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
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
          <ApprovedTab {...tabProps} claims={getFilteredClaims("approved")} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <RejectedTab {...tabProps} claims={getFilteredClaims("rejected")} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <AllTab {...tabProps} claims={getFilteredClaims("all")} />
        </TabPanel>

        {/* Claim Details Dialog */}
        <DetailsDialog
          open={openDetailDialog}
          selectedClaim={selectedClaim}
          onClose={() => setOpenDetailDialog(false)}
          onApprovalAction={handleApprovalAction}
        />

        {/* Claim Dialog */}
        <ClaimDialog
          open={openApprovalDialog}
          selectedClaim={selectedClaim}
          action={approvalAction}
          onClose={() => setApprovalDialogOpen(false)}
          onApprove={(reason) => {
            submitApprovalAction();
          }}
          onReject={(reason) => {
            submitApprovalAction();
          }}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
