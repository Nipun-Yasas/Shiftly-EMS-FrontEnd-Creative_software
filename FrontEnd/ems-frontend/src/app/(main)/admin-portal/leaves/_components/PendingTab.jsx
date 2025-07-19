"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../../../_components/main/SearchField";
import LeavesDataGrid from "./LeavesDataGrid";

export default function LeavesTab({
  leaves,
  loading,
  searchQuery,
  handleSearchChange,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3}}>
        <SearchField
          placeholder="Search pending leaves..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
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
