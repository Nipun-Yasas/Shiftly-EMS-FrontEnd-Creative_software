"use client";

import React from "react";
import Box from "@mui/material/Box";

import LeavesDataGrid from "./LeavesDataGrid";

export default function ApprovedTab({
  leaves,
  loading,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>

      <LeavesDataGrid
        loading={loading}
        leaves={leaves}
        onViewDetails={onViewDetails}
        onApprovalAction={onApprovalAction}
      />
    </Box>
  );
}
