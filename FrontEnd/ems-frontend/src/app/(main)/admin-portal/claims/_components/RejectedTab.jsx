"use client";

import React from "react";
import Box from "@mui/material/Box";

import ClaimsDataGrid from "./ClaimsDataGrid";

export default function RejectedTab({ claims, loading, onViewClaim }) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <ClaimsDataGrid
        claims={claims}
        loading={loading}
        onViewClaim={onViewClaim}
      />
    </Box>
  );
}
