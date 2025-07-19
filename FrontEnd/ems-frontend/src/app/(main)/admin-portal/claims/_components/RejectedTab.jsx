"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../_components/SearchField";
import ClaimsDataGrid from "./ClaimsDataGrid";

export default function RejectedTab({
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
          mb: 3,
        }}
      >
        <SearchField
          placeholder="Search rejected claims..."
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
