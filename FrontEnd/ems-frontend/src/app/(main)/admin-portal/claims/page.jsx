"use client";

import React, { useState, useEffect, useContext } from "react";
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
import useUserAuth from "../../../_hooks/useUserAuth";

import PendingTab from "./_components/PendingTab";
import ApprovedTab from "./_components/ApprovedTab";
import RejectedTab from "./_components/RejectedTab";
import AllTab from "./_components/AllTab";
import ClaimDialog from "./_components/ClaimDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function ClaimsManagementPage() {
  const { user } = useContext(UserContext);
  useUserAuth(); // Ensure user authentication
  
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


  // Fetch claims data
  useEffect(() => {
    // Check if user has admin privileges (SUPER_ADMIN or ADMIN role)
    if (user && user.roles) {
      const isSuperAdmin = Array.isArray(user.roles) 
        ? user.roles.includes('SUPER_ADMIN')
        : user.roles === 'SUPER_ADMIN' || user.role === 'SUPER_ADMIN';
      
      const isAdmin = Array.isArray(user.roles)
        ? user.roles.includes('ADMIN')
        : user.roles === 'ADMIN' || user.role === 'ADMIN';
      
      if (isSuperAdmin || isAdmin) {
        console.log("User has admin privileges, fetching claims for:", user.roles);
        fetchClaims();
      } else {
        console.warn("User does not have admin privileges:", user.roles);
        setClaims([]);
        setLoading(false);
      }
    } else {
      console.log("Waiting for user context...");
    }
  }, [user]); // Depend on user to refetch when user context changes

  const fetchClaims = async () => {
    try {
      setLoading(true);
      console.log("Fetching claims from backend...");
      console.log("Current user:", user);
      
      const response = await axiosInstance.get(API_PATHS.CLAIMS.GET_ALL_CLAIMS);
      console.log("Backend claims response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend data to frontend format
        const mappedClaims = response.data.map(claim => ({
          id: claim.id,
          employee_name: claim.employeeName || claim.username || `Employee ${claim.userId}`,
          employeeEmail: claim.employeeEmail || `employee${claim.userId}@company.com`,
          department: claim.department || "Unknown",
          type: claim.claimType,
          description: claim.description,
          amount: Math.floor(Math.random() * 1000) + 100, // Placeholder amount until backend includes it
          claimDate: claim.claimDate,
          submission_date: claim.createdAt || new Date().toISOString(),
          status: claim.status ? claim.status.toLowerCase() : 'pending',
          attachments: claim.claimUrl ? [claim.claimUrl] : [],
          approvedBy: claim.status === 'APPROVED' ? 'Admin' : null,
          approvedAt: claim.status === 'APPROVED' ? new Date().toISOString() : null,
          rejectionReason: claim.status === 'REJECTED' ? 'Claim rejected by admin' : null,
          // Backend specific fields
          userId: claim.userId,
          claimUrl: claim.claimUrl,
        }));

        // Apply role-based filtering on frontend (since backend might not have it yet)
        let filteredClaims = mappedClaims;
        
        if (user && user.roles) {
          console.log("Applying role-based filtering for:", user.roles, "Department:", user.department);
          
          // Check if user has SUPER_ADMIN role
          const isSuperAdmin = Array.isArray(user.roles) 
            ? user.roles.includes('SUPER_ADMIN')
            : user.roles === 'SUPER_ADMIN' || user.role === 'SUPER_ADMIN';
          
          // Check if user has ADMIN role
          const isAdmin = Array.isArray(user.roles)
            ? user.roles.includes('ADMIN')
            : user.roles === 'ADMIN' || user.role === 'ADMIN';
          
          if (isSuperAdmin) {
            // Super admin can see all claims from all departments
            filteredClaims = mappedClaims;
            console.log("Super admin - showing all claims:", filteredClaims.length);
          } else if (isAdmin && user.department) {
            // Regular admin can only see claims from same department
            filteredClaims = mappedClaims.filter(claim => {
              const match = claim.department === user.department;
              console.log(`Claim ${claim.id} department: ${claim.department}, User department: ${user.department}, Match: ${match}`);
              return match;
            });
            console.log(`Admin filter applied - showing ${filteredClaims.length} of ${mappedClaims.length} claims`);
          } else {
            // User has no admin privileges or no department - show no claims
            console.log("User has no admin privileges - showing no claims");
            filteredClaims = [];
          }
        } else {
          console.log("No user roles found - showing all claims");
        }
        
        console.log("Final filtered claims:", filteredClaims);
        setClaims(filteredClaims);
      } else {
        console.warn("Invalid response format or no data");
        setClaims([]);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      // More detailed error logging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      }
      
      showSnackbar(`Failed to fetch claims: ${error.message}`, "error");
      
      // Fallback to sample data for demo (also apply filtering)
      let filteredSampleClaims = sampleClaims;
      if (user && user.role) {
        if (user.role === 'SUPER_ADMIN') {
          filteredSampleClaims = sampleClaims;
        } else if (user.role === 'ADMIN') {
          filteredSampleClaims = sampleClaims.filter(claim => 
            claim.department === user.department
          );
        } else {
          filteredSampleClaims = [];
        }
      }
      setClaims(filteredSampleClaims);
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
        {/* Show loading if user context is not ready */}
        {!user ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
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
              <ApprovedTab {...tabProps} claims={getFilteredClaims("approved")} />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <RejectedTab {...tabProps} claims={getFilteredClaims("rejected")} />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <AllTab {...tabProps} claims={getFilteredClaims("all")} />
            </TabPanel>
          </>
        )}

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
