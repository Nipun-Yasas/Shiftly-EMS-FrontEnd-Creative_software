"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  const [searchQuery, setSearchQuery] = useState("");
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

  // Sample leaves data
  const sampleLeaves = [
    {
      id: 1,
      employeeName: "John Smith",
      employeeEmail: "john.smith@company.com",
      department: "Engineering",
      leaveType: "Annual",
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
      employeeName: "Sarah Johnson",
      employeeEmail: "sarah.johnson@company.com",
      department: "Marketing",
      leaveType: "Sick",
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
      employeeName: "Mike Chen",
      employeeEmail: "mike.chen@company.com",
      department: "Sales",
      leaveType: "Casual",
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
      employeeName: "Emma Davis",
      employeeEmail: "emma.davis@company.com",
      department: "HR",
      leaveType: "Maternity",
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
      employeeName: "Alex Rodriguez",
      employeeEmail: "alex.rodriguez@company.com",
      department: "IT",
      leaveType: "Vacation",
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
      setApprovalDialogOpen(false);
      setOpenDetailDialog(false);
    } catch (error) {
      console.error(`Error ${approvalAction}ing leave:`, error);
      showSnackbar(`Error ${approvalAction}ing leave`, "error");
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
    setApprovalDialogOpen(true);
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || leave.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getFilteredLeaves = (status) => {
    if (status === "all") {
      return filteredLeaves;
    }
    return filteredLeaves.filter((leave) => leave.status === status);
  };

  const pendingCount = leaves.filter((l) => l.status === "pending").length;

  const tabProps = {
    leaves: getFilteredLeaves(),
    loading,
    onViewDetails: handleViewDetails,
    onApprovalAction: handleApprovalAction,
    searchQuery,
    handleSearchChange,
    filterStatus,
    setFilterStatus,
  };

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
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
          <LeavesTab {...tabProps} leaves={getFilteredLeaves("pending")} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ApprovedTab {...tabProps} leaves={getFilteredLeaves("approved")} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <RejectedTab {...tabProps} leaves={getFilteredLeaves("rejected")} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AllTab {...tabProps} leaves={getFilteredLeaves("all")} />
        </TabPanel>

        <DetailsDialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          selectedLeave={selectedLeave}
          onApprovalAction={handleApprovalAction}
        />

        <LeaveDialog
          open={openApprovalDialog}
          onClose={() => setApprovalDialogOpen(false)}
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
