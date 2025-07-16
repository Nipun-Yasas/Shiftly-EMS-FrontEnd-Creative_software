import React from "react";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import AccessTime from "@mui/icons-material/AccessTime";
import Receipt from "@mui/icons-material/Receipt";


export const getStatusColor = (status) => {
  switch (status) {
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
  switch (status) {
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
