"use client";

import React from "react";
import Box from "@mui/material/Box";

import LeavesDataGrid from "./LeavesDataGrid";

export default function RejectedTab({ leaves, loading, onViewClaim }) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <LeavesDataGrid
        leaves={leaves}
        loading={loading}
        onViewClaim={onViewClaim}
      />
    </Box>
  );
}
