"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../_components/SearchField";
import ClaimsDataGrid from "./ClaimsDataGrid";

export default function PendingClaimsTab({
  claims,
  loading,
  searchQuery,
  handleSearchChange,
  onViewClaim,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 3,
        }}
      >
        <SearchField
          placeholder="Search claims..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      <ClaimsDataGrid
        claims={claims}
        loading={loading}
        onViewClaim={onViewClaim}
        onApprovalAction={onApprovalAction}
        showApprovalActions={true}
      />
    </Box>
  );
}
