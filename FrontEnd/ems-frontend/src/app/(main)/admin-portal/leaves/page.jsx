"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import LeavesTab from "./_components/PendingTab";
import ApprovedTab from "./_components/ApprovedTab";
import RejectedTab from "./_components/RejectedTab";
import AllTab from "./_components/AllTab";
import DetailsDialog from "./_components/DetailsDialog";
import LeaveDialog from "./_components/LeaveDialog";
import TabPanel from "../../../_components/main/TabPanel";

export default function LeavesManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalReason, setApprovalReason] = useState("");
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchLeaves();
    
    // Set up auto-refresh if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLeaves(0, true); // Silent refresh
      }, 30000); // 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchLeaves = async (retryCount = 0, silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    
    try {
      let response;
      let employeesData = [];
      
      // Fetch employees data to get proper names
      try {
        const employeesResponse = await axiosInstance.get(API_PATHS.EMPLOYEE.GET_ALL_EMPLOYEES);
        employeesData = employeesResponse.data || [];
        console.log('Fetched employees data:', employeesData);
      } catch (empError) {
        console.warn('Could not fetch employees data:', empError.message);
        // Continue without employee data - will use fallback names
      }
      
      try {
        // Try admin endpoint first
        response = await axiosInstance.get(API_PATHS.LEAVES.GET_ALL_LEAVES_ADMIN);
      } catch (adminError) {
        // If admin endpoint fails (404 or 500), try regular endpoint as fallback
        if (adminError.response?.status === 404 || adminError.response?.status === 500) {
          console.warn('Admin endpoint not available, falling back to regular endpoint');
          response = await axiosInstance.get(API_PATHS.LEAVES.GET_MY_LEAVES);
        } else {
          throw adminError;
        }
      }
      
      // Create a comprehensive map of employee data for quick lookup
      const employeeMap = {};
      employeesData.forEach((emp, index) => {
        console.log(`Employee ${index + 1}:`, emp);
        
        // Map by all possible identifiers that might be in leave data
        const identifiers = [
          emp.id,
          emp.employeeId, 
          emp.userId,
          emp.username,
          emp.email,
          emp.workEmail,
          emp.personalEmail,
          emp.employeeNumber,
          emp.staffId
        ];
        
        identifiers.forEach(identifier => {
          if (identifier) {
            employeeMap[identifier] = emp;
          }
        });
      });
      
      console.log('Employee map created with keys:', Object.keys(employeeMap));
      console.log('Total employees mapped:', employeesData.length);
      
      // Debug: Show sample leave data structure
      if (response.data && response.data.length > 0) {
        console.log('Sample leave data structure:', response.data[0]);
        console.log('Available leave data fields:', Object.keys(response.data[0]));
      }
      
      // Map backend data to expected format
      const mappedLeaves = response.data.map((leave, index) => {
        console.log(`Processing leave ${index + 1}:`, leave);
        
        // Try to find employee data by various identifiers
        let employeeInfo = null;
        let matchedBy = null;
        
        // Try to match by different possible identifiers
        const identifiers = [
          { key: 'employeeId', value: leave.employeeId },
          { key: 'userId', value: leave.userId },
          { key: 'id', value: leave.id },
          { key: 'submittedBy', value: leave.submittedBy },
          { key: 'applicantId', value: leave.applicantId },
          { key: 'username', value: leave.username },
          { key: 'userEmail', value: leave.userEmail },
          { key: 'applicantEmail', value: leave.applicantEmail },
          { key: 'email', value: leave.email },
          { key: 'employeeEmail', value: leave.employeeEmail }
        ];
        
        for (const identifier of identifiers) {
          if (identifier.value && employeeMap[identifier.value]) {
            employeeInfo = employeeMap[identifier.value];
            matchedBy = identifier.key;
            console.log(`Found employee match for leave ${index + 1} by ${matchedBy}:`, employeeInfo);
            break;
          }
        }
        
        if (!employeeInfo) {
          console.log(`No employee match found for leave ${index + 1}. Available identifiers:`, identifiers.filter(i => i.value));
        }
        
        // Determine employee name from various sources with priority
        let employeeName = 'Unknown Employee';
        let nameSource = 'fallback';
        
        if (employeeInfo) {
          // Priority 1: Employee data from API
          if (employeeInfo.firstName && employeeInfo.lastName) {
            employeeName = `${employeeInfo.firstName} ${employeeInfo.lastName}`;
            nameSource = 'employee-firstName-lastName';
          } else if (employeeInfo.fullName) {
            employeeName = employeeInfo.fullName;
            nameSource = 'employee-fullName';
          } else if (employeeInfo.name) {
            employeeName = employeeInfo.name;
            nameSource = 'employee-name';
          } else if (employeeInfo.username) {
            employeeName = employeeInfo.username;
            nameSource = 'employee-username';
          } else if (employeeInfo.email) {
            employeeName = employeeInfo.email.split('@')[0]; // Use email prefix as name
            nameSource = 'employee-email';
          }
        } else {
          // Priority 2: Leave request data fields
          if (leave.firstName && leave.lastName) {
            employeeName = `${leave.firstName} ${leave.lastName}`;
            nameSource = 'leave-firstName-lastName';
          } else if (leave.employeeName) {
            employeeName = leave.employeeName;
            nameSource = 'leave-employeeName';
          } else if (leave.userName) {
            employeeName = leave.userName;
            nameSource = 'leave-userName';
          } else if (leave.applicantName) {
            employeeName = leave.applicantName;
            nameSource = 'leave-applicantName';
          } else if (leave.username) {
            employeeName = leave.username;
            nameSource = 'leave-username';
          } else if (leave.submittedByName) {
            employeeName = leave.submittedByName;
            nameSource = 'leave-submittedByName';
          } else if (leave.userEmail) {
            employeeName = leave.userEmail.split('@')[0]; // Use email prefix as name
            nameSource = 'leave-userEmail';
          } else if (leave.applicantEmail) {
            employeeName = leave.applicantEmail.split('@')[0]; // Use email prefix as name
            nameSource = 'leave-applicantEmail';
          }
        }
        
        console.log(`Leave ${index + 1} final name: "${employeeName}" (source: ${nameSource})`);
        
        if (employeeName === 'Unknown Employee') {
          console.warn(`Could not resolve name for leave ${index + 1}. Leave data:`, leave);
          console.warn(`Available employee data keys:`, Object.keys(employeeMap));
        }
        
        return {
          id: leave.id,
          employeeName: employeeName,
          employeeEmail: leave.employeeEmail || leave.userEmail || leave.applicantEmail || employeeInfo?.email || 'N/A',
          department: leave.department || employeeInfo?.department || 'N/A',
          leaveType: leave.leaveType || '',
          leaveFrom: leave.leaveFrom || '',
          leaveTo: leave.leaveTo || '',
          leaveDuration: leave.leaveDuration || leave.duration || calculateDuration(leave.leaveFrom, leave.leaveTo),
          coverPerson: leave.coverPersonName || leave.coverPerson || 'N/A',
          reportPerson: leave.reportToName || leave.reportPerson || 'N/A',
          reason: leave.reason || '',
          submissionDate: leave.createdAt || leave.submissionDate || new Date().toISOString(),
          status: (leave.leaveStatus?.toLowerCase() || leave.status?.toLowerCase() || 'pending').toLowerCase(),
          approvedBy: leave.approvedBy || null,
          approvedAt: leave.approvedAt || null,
          rejectionReason: leave.rejectionReason || null,
        };
      });
      
      console.log('Mapped leaves with employee names:', mappedLeaves);
      setLeaves(mappedLeaves);
      
      if (mappedLeaves.length === 0 && !silent) {
        setError("No leave requests found. This could mean no employees have submitted leave requests yet.");
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      
      // Only show error and retry for non-silent requests
      if (!silent) {
        // Retry logic for network errors
        if (retryCount < 2 && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
          setTimeout(() => {
            fetchLeaves(retryCount + 1);
          }, (retryCount + 1) * 1000); // Exponential backoff
          return;
        }
        
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        const detailedError = `Failed to fetch leave requests: ${errorMessage}`;
        
        // Add helpful message for common errors
        if (error.response?.status === 500) {
          setError(`${detailedError}. This might be because the admin endpoints are not yet implemented on the backend server.`);
        } else if (error.response?.status === 404) {
          setError(`${detailedError}. The leave management endpoints might not be available.`);
        } else if (error.isNetworkError) {
          setError("Backend server is not available. Please ensure the server is running at http://localhost:8080");
        } else {
          setError(detailedError);
        }
        
        showSnackbar("Error fetching leave submissions. Please check your connection and try again.", "error");
        setLeaves([]);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const retryFetch = () => {
    fetchLeaves();
  };

  // Helper function to calculate leave duration
  const calculateDuration = (from, to) => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const submitApprovalAction = async () => {
    console.log('submitApprovalAction called with:', {
      selectedLeave,
      approvalAction,
      approvalReason
    });
    
    if (!selectedLeave || !approvalAction) {
      console.error('Missing required data for approval:', { selectedLeave, approvalAction });
      showSnackbar('Missing required data for approval', 'error');
      return;
    }

    // Validate rejection reason if rejecting
    if (approvalAction === 'reject' && (!approvalReason || approvalReason.trim() === '')) {
      console.error('Rejection reason is required');
      showSnackbar('Please provide a reason for rejection', 'error');
      return;
    }

    try {
      // Try different status formats that the backend might expect
      const statusVariants = {
        approve: ["APPROVED", "approved", "Approved"],
        reject: ["REJECTED", "rejected", "Rejected"]
      };
      
      const statusToTry = statusVariants[approvalAction][0]; // Start with uppercase
      
      console.log('Attempting to update leave:', {
        leaveId: selectedLeave.id,
        currentStatus: selectedLeave.status,
        newStatus: statusToTry,
        action: approvalAction,
        reason: approvalReason
      });

      // Try multiple payload formats
      const payloadOptions = [
        // Option 1: Minimal admin payload
        {
          rejectionReason: approvalAction === "reject" ? approvalReason : null,
        },
        // Option 2: Status-based payload
        {
          status: statusToTry,
          rejectionReason: approvalAction === "reject" ? approvalReason : null,
        },
        // Option 3: Leave status field
        {
          leaveStatus: statusToTry,
          rejectionReason: approvalAction === "reject" ? approvalReason : null,
        },
        // Option 4: Full leave data with status update
        {
          leaveType: selectedLeave.leaveType,
          leaveFrom: selectedLeave.leaveFrom,
          leaveTo: selectedLeave.leaveTo,
          reason: selectedLeave.reason,
          coverPersonName: selectedLeave.coverPerson,
          leaveStatus: statusToTry,
          rejectionReason: approvalAction === "reject" ? approvalReason : null,
        },
        // Option 5: Empty payload (for endpoints that don't need body)
        {}
      ];

      let success = false;
      let lastError = null;

      // Primary approach: Use the actual backend endpoint with query parameter
      const correctEndpoints = [
        {
          url: `${API_PATHS.LEAVES.UPDATE_LEAVE_STATUS(selectedLeave.id)}?status=${statusToTry}`,
          method: 'PUT',
          data: null
        },
        {
          url: `${API_PATHS.LEAVES.UPDATE_LEAVE_STATUS(selectedLeave.id)}?status=${statusVariants[approvalAction][1]}`,
          method: 'PUT',
          data: null
        },
        {
          url: `${API_PATHS.LEAVES.UPDATE_LEAVE_STATUS(selectedLeave.id)}?status=${statusVariants[approvalAction][2]}`,
          method: 'PUT',
          data: null
        }
      ];

      // Try the correct backend endpoints first
      for (let endpoint of correctEndpoints) {
        try {
          console.log(`Trying correct backend endpoint: ${endpoint.method} ${endpoint.url}`);
          
          const response = await axiosInstance.request({
            method: endpoint.method,
            url: endpoint.url
          });
          
          success = true;
          console.log('Backend endpoint successful:', response.data);
          break;
        } catch (error) {
          console.log(`Backend endpoint failed: ${error.response?.data || error.message}`);
          lastError = error;
        }
      }

      // Fallback: Try other approaches with payloads if the main endpoint fails
      if (!success) {
        console.log('Main endpoint failed, trying fallback approaches...');
        
        for (let i = 0; i < payloadOptions.length && !success; i++) {
          const payload = payloadOptions[i];
          
          const fallbackEndpoints = [
            // Legacy endpoints
            {
              url: approvalAction === 'approve' 
                ? API_PATHS.LEAVES.APPROVE_LEAVE_ADMIN(selectedLeave.id)
                : API_PATHS.LEAVES.REJECT_LEAVE_ADMIN(selectedLeave.id),
              method: 'POST',
              data: payload
            },
            {
              url: approvalAction === 'approve' 
                ? API_PATHS.LEAVES.APPROVE_LEAVE_ADMIN(selectedLeave.id)
                : API_PATHS.LEAVES.REJECT_LEAVE_ADMIN(selectedLeave.id),
              method: 'PUT',
              data: payload
            },
            // Generic update endpoint
            {
              url: API_PATHS.LEAVES.UPDATE_MY_LEAVE(selectedLeave.id),
              method: 'PUT',
              data: payload
            },
            {
              url: API_PATHS.LEAVES.UPDATE_MY_LEAVE(selectedLeave.id),
              method: 'PATCH',
              data: payload
            }
          ];

          for (let endpoint of fallbackEndpoints) {
            try {
              console.log(`Trying fallback: ${endpoint.method} ${endpoint.url} with payload ${i + 1}:`, payload);
              
              const response = await axiosInstance.request({
                method: endpoint.method,
                url: endpoint.url,
                data: endpoint.data
              });
              
              success = true;
              console.log(`Fallback successful with payload ${i + 1}:`, response.data);
              break;
            } catch (error) {
              console.log(`Fallback failed: ${error.response?.data || error.message}`);
              lastError = error;
            }
          }
          
          if (success) break;
        }
      }

      if (!success) {
        throw lastError || new Error('All payload options failed');
      }

      // Update local state immediately for better UX
      const localStatus = approvalAction === "approve" ? "approved" : "rejected";
      
      // Update the leaves state with the new status
      setLeaves((prev) => {
        const updated = prev.map((leave) =>
          leave.id === selectedLeave.id
            ? {
                ...leave,
                status: localStatus,
                approvedBy: approvalAction === "approve" ? "Admin User" : null,
                approvedAt: approvalAction === "approve" ? new Date().toISOString() : null,
                rejectionReason: approvalAction === "reject" ? approvalReason : null,
              }
            : leave
        );
        
        // Log the update for debugging
        console.log(`Local state updated: Leave ${selectedLeave.id} status changed to ${localStatus}`);
        return updated;
      });

      showSnackbar(
        `Leave ${approvalAction === "approve" ? "approved" : "rejected"} successfully`,
        "success"
      );
      
      setOpenApprovalDialog(false);
      setOpenDetailDialog(false);
      
      // Force refresh of all data to ensure all tabs are updated correctly
      // This ensures backend and frontend state are synchronized
      fetchLeaves(0, false); // Immediate refresh, not silent

    } catch (error) {
      console.error(`Error ${approvalAction}ing leave:`, error);
      
      // Detailed error logging
      console.log('Final error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data
      });
      
      let errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      // Check for network errors specifically
      if (error.isNetworkError || error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend server. Please check if the server is running.';
      } else if (error.response?.status === 500) {
        errorMessage = `Backend server error while ${approvalAction}ing leave. The admin approval endpoints may not be fully implemented yet. Please contact your system administrator.`;
        
        // For 500 errors, try to update the UI optimistically as a fallback
        console.log('Applying optimistic UI update due to backend error');
        const localStatus = approvalAction === "approve" ? "approved" : "rejected";
        
        setLeaves((prev) => {
          const updated = prev.map((leave) =>
            leave.id === selectedLeave.id
              ? {
                  ...leave,
                  status: localStatus,
                  approvedBy: approvalAction === "approve" ? "Admin User (Pending Sync)" : null,
                  approvedAt: approvalAction === "approve" ? new Date().toISOString() : null,
                  rejectionReason: approvalAction === "reject" ? approvalReason : null,
                }
              : leave
          );
          return updated;
        });
        
        showSnackbar(
          `Leave ${approvalAction}ed locally. Note: Backend synchronization failed - changes may not persist.`,
          "warning"
        );
        
        setOpenApprovalDialog(false);
        setOpenDetailDialog(false);
        return; // Don't show the error message, we've handled it with optimistic update
      } else if (error.response?.status === 404) {
        errorMessage = 'Leave record not found or approval endpoint does not exist.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You may not have admin permissions for this action.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request data. ' + (error.response?.data?.message || '');
      }
      
      showSnackbar(`Error ${approvalAction}ing leave: ${errorMessage}`, "error");
      
      // Additional helpful information for backend issues
      if (error.response?.status === 500) {
        console.warn(`
⚠️  BACKEND DEVELOPMENT NOTE:
The endpoint ${error.config?.url} returned a 500 error.
This suggests the admin approval endpoints need to be implemented or fixed on the backend.

Expected endpoint behavior:
- POST ${error.config?.url} should accept a payload and update the leave status
- The backend should handle the approval/rejection logic
- Response should confirm the status change

Current request details:
- Method: ${error.config?.method}
- URL: ${error.config?.url}
- Payload: ${JSON.stringify(error.config?.data, null, 2)}
        `);
      }
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


  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setOpenDetailDialog(true);
  };

  const handleApprovalAction = (leave, action) => {
    console.log('Approval action triggered:', { leave, action });
    
    // Validate inputs
    if (!leave) {
      console.error('No leave selected for approval action');
      showSnackbar('No leave selected for approval', 'error');
      return;
    }
    
    if (!action || (action !== 'approve' && action !== 'reject')) {
      console.error('Invalid action for approval:', action);
      showSnackbar('Invalid approval action', 'error');
      return;
    }
    
    // Only allow approval/rejection for pending leaves
    if (leave.status !== 'pending') {
      showSnackbar(`Cannot ${action} a leave that is already ${leave.status}`, 'warning');
      return;
    }
    
    console.log('Setting approval dialog state:', {
      selectedLeave: leave,
      approvalAction: action,
      openDialog: true
    });
    
    setSelectedLeave(leave);
    setApprovalAction(action);
    setApprovalReason("");
    setOpenApprovalDialog(true);
  };


  const getFilteredLeaves = (status) => {
    if (status === "all") {
      return leaves;
    }
    return leaves.filter((leave) => leave.status === status);
  };

  const tabProps = {
    leaves: leaves,
    loading,
    onViewDetails: handleViewDetails,
    onApprovalAction: handleApprovalAction,
    filterStatus,
    setFilterStatus,
  };

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        {/* Header with Refresh Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Leave Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="textSecondary">
              {autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAutoRefresh(!autoRefresh)}
              sx={{ mr: 1 }}
            >
              {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
            </Button>
            <Tooltip title="Refresh Leave Data">
              <IconButton 
                onClick={retryFetch} 
                disabled={loading}
                sx={{ color: 'primary.main' }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={retryFetch}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Statistics */}
        {leaves.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3, 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#e3f2fd',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                {leaves.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Requests
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#fff3e0',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                {leaves.filter(l => l.status === "pending").length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Pending
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#dcedc8',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                {leaves.filter(l => l.status === "approved").length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Approved
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#ffcdd2',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                {leaves.filter(l => l.status === "rejected").length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Rejected
              </Typography>
            </Box>
          </Box>
        )}

        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={
              <Badge badgeContent={leaves.filter(l => l.status === "pending").length} color="primary">
                Pending
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={leaves.filter(l => l.status === "approved").length} color="success">
                Approved
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={leaves.filter(l => l.status === "rejected").length} color="error">
                Rejected
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={leaves.length} color="info">
                All Leaves
              </Badge>
            }
          />
        </Tabs>

        {loading && leaves.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading leave requests...</Typography>
          </Box>
        ) : leaves.length === 0 && !error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography color="textSecondary">
              No leave requests found. Employees haven't submitted any leave requests yet.
            </Typography>
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0} key={`pending-${leaves.filter(l => l.status === "pending").length}`}>
              <LeavesTab {...tabProps} leaves={getFilteredLeaves("pending")} />
            </TabPanel>

            <TabPanel value={tabValue} index={1} key={`approved-${leaves.filter(l => l.status === "approved").length}`}>
              <ApprovedTab {...tabProps} leaves={getFilteredLeaves("approved")} />
            </TabPanel>

            <TabPanel value={tabValue} index={2} key={`rejected-${leaves.filter(l => l.status === "rejected").length}`}>
              <RejectedTab {...tabProps} leaves={getFilteredLeaves("rejected")} />
            </TabPanel>

            <TabPanel value={tabValue} index={3} key={`all-${leaves.length}`}>
              <AllTab {...tabProps} leaves={getFilteredLeaves("all")} />
            </TabPanel>
          </>
        )}

        <DetailsDialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          selectedLeave={selectedLeave}
          onApprovalAction={handleApprovalAction}
        />

        <LeaveDialog
          open={openApprovalDialog}
          onClose={() => {
            console.log('Closing approval dialog');
            setOpenApprovalDialog(false);
          }}
          selectedLeave={selectedLeave}
          approvalAction={approvalAction}
          approvalReason={approvalReason}
          setApprovalReason={setApprovalReason}
          onSubmit={() => {
            console.log('Submit button clicked in dialog');
            console.log('Current dialog state:', {
              selectedLeave,
              approvalAction,
              approvalReason,
              openApprovalDialog
            });
            submitApprovalAction();
          }}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}
