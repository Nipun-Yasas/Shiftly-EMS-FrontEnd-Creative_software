"use client";

import React from "react";
import Box from "@mui/material/Box";

import ReferDataGrid from "./ReferDataGrid";

export default function AllTab({ candidates, loading, handleUpdateStatus }) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <ReferDataGrid
        candidates={candidates}
        loading={loading}
        handleUpdateStatus={handleUpdateStatus}
        showApprovalActions={true}
      />
    </Box>
  );
}
