"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../_components/SearchField";
import ClaimsDataGrid from "./ClaimsDataGrid";

export default function PendingClaimsTab({
  claims,
  loading,
  searchQuery,
  onSearchChange,
  onViewClaim,
  onApprovalAction,
}) {
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      !searchQuery ||
      claim.employee_name
        ?.toLowerCase()
        .includes(String(searchQuery).toLowerCase()) ||
      claim.department
        ?.toLowerCase()
        .includes(String(searchQuery).toLowerCase()) ||
      claim.type?.toLowerCase().includes(String(searchQuery).toLowerCase()) ||
      claim.description
        ?.toLowerCase()
        .includes(String(searchQuery).toLowerCase());

    const matchesStatus = claim.status === "pending";

    return matchesSearch && matchesStatus;
  });

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
          onChange={onSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      <ClaimsDataGrid
        claims={filteredClaims}
        loading={loading}
        onViewClaim={onViewClaim}
        onApprovalAction={onApprovalAction}
        showApprovalActions={true}
      />
    </Box>
  );
}
