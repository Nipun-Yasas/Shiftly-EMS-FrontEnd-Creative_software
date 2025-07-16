"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../_components/SearchField";
import ClaimsDataGrid from "./ClaimsDataGrid";

export default function ApprovedClaimsTab({
  claims,
  loading,
  searchQuery,
  handleSearchChange,
  onViewClaim,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <SearchField
          placeholder="Search approved claims..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>
      <ClaimsDataGrid
        claims={claims}
        loading={loading}
        onViewClaim={onViewClaim}
      />
    </Box>
  );
}
