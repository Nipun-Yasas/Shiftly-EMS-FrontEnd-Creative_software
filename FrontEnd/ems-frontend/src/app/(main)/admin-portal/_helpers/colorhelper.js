import React from "react";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import AccessTime from "@mui/icons-material/AccessTime";
import Receipt from "@mui/icons-material/Receipt";


export const getStatusColor = (status) => {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case 'read':
      return 'success';
    case 'unread':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

export const getStatusIcon = (status) => {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case "unread":
      return <AccessTime />;
    case "read":
      return <CheckCircle />;
    case "approved":
      return <CheckCircle />;
    case "rejected":
      return <Cancel />;
    case "pending":
      return <AccessTime />;
    default:
      return <Receipt />;
  }
};

export const getLeaveTypeColor = (leaveType) => {
  switch (leaveType) {
    case "Annual":
      return "#D81B60";
    case "Casual Leave":
      return "#2563EB";
    case "Sick":
      return "#DC2626";
    case "Maternity":
      return "#059669";
    case "Vacation":
      return "#7C3AED";
    default:
      return "#6B7280";
  }
};
