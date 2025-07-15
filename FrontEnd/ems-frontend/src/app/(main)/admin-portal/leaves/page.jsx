"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import PendingTab from "./_components/PendingTab";
import ApprovedTab from "./_components/ApprovedTab";
import RejectedTab from "./_components/RejectedTab";
import AllLeavesTab from "./_components/AllLeavesTab";
import DetailsDialog from "./_components/DetailsDialog";
import HistoryDialog from "./_components/HistoryDialog";
import ApprovalDialog from "./_components/ApprovalDialog";
import TabPanel from "../_components/TabPanel";

export default function LeavesManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalReason, setApprovalReason] = useState("");
  const [actionHistory, setActionHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sample leaves data
  const sampleLeaves = [
    {
      id: 1,
      leaveId: "LV-2025-001",
      employeeName: "John Smith",
      employeeEmail: "john.smith@company.com",
      department: "Engineering",
      leaveType: "Annual Leave",
      leaveFrom: "2025-07-15T00:00:00",
      leaveTo: "2025-07-19T00:00:00",
      leaveDuration: 5,
      coverPerson: "Jane Doe",
      reportPerson: "Mike Johnson",
      reason: "Family vacation to Europe",
      submissionDate: "2025-07-12T14:30:00",
      status: "pending",
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    },
    {
      id: 2,
      leaveId: "LV-2025-002",
      employeeName: "Sarah Johnson",
      employeeEmail: "sarah.johnson@company.com",
      department: "Marketing",
      leaveType: "Sick Leave",
      leaveFrom: "2025-07-14T00:00:00",
      leaveTo: "2025-07-16T00:00:00",
      leaveDuration: 3,
      coverPerson: "Tom Wilson",
      reportPerson: "Lisa Brown",
      reason: "Medical treatment for chronic condition",
      submissionDate: "2025-07-13T09:15:00",
      status: "approved",
      approvedBy: "Admin User",
      approvedAt: "2025-07-13T11:30:00",
      rejectionReason: null,
    },
    {
      id: 3,
      leaveId: "LV-2025-003",
      employeeName: "Mike Chen",
      employeeEmail: "mike.chen@company.com",
      department: "Sales",
      leaveType: "Casual Leave",
      leaveFrom: "2025-07-20T00:00:00",
      leaveTo: "2025-07-20T00:00:00",
      leaveDuration: 1,
      coverPerson: "Alex Rodriguez",
      reportPerson: "Emily Davis",
      reason: "Personal urgent matter",
      submissionDate: "2025-07-12T16:45:00",
      status: "rejected",
      approvedBy: null,
      approvedAt: null,
      rejectionReason: "Insufficient casual leave balance remaining",
    },
    {
      id: 4,
      leaveId: "LV-2025-004",
      employeeName: "Emma Davis",
      employeeEmail: "emma.davis@company.com",
      department: "HR",
      leaveType: "Maternity Leave",
      leaveFrom: "2025-08-01T00:00:00",
      leaveTo: "2025-11-01T00:00:00",
      leaveDuration: 92,
      coverPerson: "Lisa Johnson",
      reportPerson: "Mark Thompson",
      reason: "Maternity leave for newborn care",
      submissionDate: "2025-07-10T10:20:00",
      status: "pending",
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    },
    {
      id: 5,
      leaveId: "LV-2025-005",
      employeeName: "Alex Rodriguez",
      employeeEmail: "alex.rodriguez@company.com",
      department: "IT",
      leaveType: "Vacation Leave",
      leaveFrom: "2025-07-25T00:00:00",
      leaveTo: "2025-07-26T00:00:00",
      leaveDuration: 2,
      coverPerson: "David Kim",
      reportPerson: "Jennifer Lee",
      reason: "Weekend extension for family event",
      submissionDate: "2025-07-13T08:45:00",
      status: "pending",
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    },
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('/api/leaves/submissions');
      // setLeaves(response.data || []);

      // Using sample data for demo
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      setLeaves(sampleLeaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      showSnackbar("Error fetching leave submissions", "error");
      setLeaves(sampleLeaves); // Fallback to sample data
    } finally {
      setLoading(false);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setOpenDetailDialog(true);
  };

  const handleApprovalAction = (leave, action) => {
    setSelectedLeave(leave);
    setApprovalAction(action);
    setApprovalReason("");
    setOpenApprovalDialog(true);
  };

  const submitApprovalAction = async () => {
    if (!selectedLeave || !approvalAction) return;

    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/leaves/${selectedLeave.id}/${approvalAction}`, {
      //   reason: approvalReason
      // });

      const updatedStatus =
        approvalAction === "approve" ? "approved" : "rejected";

      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === selectedLeave.id
            ? {
                ...leave,
                status: updatedStatus,
                approvedBy:
                  approvalAction === "approve" ? "Current Admin" : null,
                approvedAt:
                  approvalAction === "approve"
                    ? new Date().toISOString()
                    : null,
                rejectionReason:
                  approvalAction === "reject" ? approvalReason : null,
              }
            : leave
        )
      );

      showSnackbar(
        `Leave ${approvalAction === "approve" ? "approved" : "rejected"} successfully`,
        "success"
      );
      setOpenApprovalDialog(false);
      setOpenDetailDialog(false);
    } catch (error) {
      console.error(`Error ${approvalAction}ing leave:`, error);
      showSnackbar(`Error ${approvalAction}ing leave`, "error");
    }
  };

  const handleViewHistory = async (leaveId) => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get(`/api/leaves/${leaveId}/action-history`);
      // setActionHistory(response.data || []);

      // Sample action history data
      const sampleHistory = [
        {
          id: 1,
          adminName: "John Doe",
          adminEmail: "john.doe@company.com",
          action: "viewed details",
          timestamp: "2025-07-12T10:30:00",
          notes: "Initial review",
        },
        {
          id: 2,
          adminName: "Jane Smith",
          adminEmail: "jane.smith@company.com",
          action: "approved",
          timestamp: "2025-07-12T14:15:00",
          notes: "Approved after verifying leave balance",
        },
      ];

      setActionHistory(sampleHistory);
      setOpenHistoryDialog(true);
    } catch (error) {
      console.error("Error fetching action history:", error);
      showSnackbar("Error fetching action history", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "CheckCircle";
      case "rejected":
        return "Cancel";
      case "pending":
        return "AccessTime";
      default:
        return "EventAvailable";
    }
  };

  const getLeaveTypeColor = (leaveType) => {
    switch (leaveType) {
      case "Annual Leave":
        return "#D81B60";
      case "Casual Leave":
        return "#2563EB";
      case "Sick Leave":
        return "#DC2626";
      case "Maternity Leave":
        return "#059669";
      case "Vacation Leave":
        return "#7C3AED";
      default:
        return "#6B7280";
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.leaveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || leave.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const pendingCount = leaves.filter((l) => l.status === "pending").length;

  const commonProps = {
    loading,
    searchQuery,
    handleSearchChange,
    onViewDetails: handleViewDetails,
    onApprovalAction: handleApprovalAction,
    onViewHistory: handleViewHistory,
    getStatusColor,
    getStatusIcon,
    getLeaveTypeColor,
  };

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={
              <Badge badgeContent={pendingCount} color="primary">
                Pending
              </Badge>
            }
          />
          <Tab label="Approved" />
          <Tab label="Rejected" />
          <Tab label="All Leaves" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <PendingTab
            leaves={filteredLeaves.filter((l) => l.status === "pending")}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            {...commonProps}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ApprovedTab
            leaves={filteredLeaves.filter((l) => l.status === "approved")}
            {...commonProps}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <RejectedTab
            leaves={filteredLeaves.filter((l) => l.status === "rejected")}
            {...commonProps}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AllLeavesTab
            leaves={filteredLeaves}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            {...commonProps}
          />
        </TabPanel>

        <DetailsDialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          selectedLeave={selectedLeave}
          onApprovalAction={handleApprovalAction}
          onViewHistory={handleViewHistory}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          getLeaveTypeColor={getLeaveTypeColor}
        />

        <HistoryDialog
          open={openHistoryDialog}
          onClose={() => setOpenHistoryDialog(false)}
          actionHistory={actionHistory}
        />

        <ApprovalDialog
          open={openApprovalDialog}
          onClose={() => setOpenApprovalDialog(false)}
          selectedLeave={selectedLeave}
          approvalAction={approvalAction}
          approvalReason={approvalReason}
          setApprovalReason={setApprovalReason}
          onSubmit={submitApprovalAction}
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
