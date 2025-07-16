"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../_components/SearchField";
import LeavesDataGrid from "./LeavesDataGrid";

export default function ApprovedLeavesTab({
  leaves,
  loading,
  searchQuery,
  handleSearchChange,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ pb: 2, display: "flex", alignItems: "center" }}>
        <SearchField
          placeholder="Search approved leaves..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <LeavesDataGrid
        loading={loading}
        leaves={leaves}
        onViewDetails={onViewDetails}
        onApprovalAction={onApprovalAction}
      />
    </Box>
  );
}
