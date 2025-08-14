"use client";

import React from "react";
import Box from "@mui/material/Box";

import TimeSheetDataGrid from "./TimeSheetDataGrid";

export default function ApprovedTab({ timeSheets, loading }) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <TimeSheetDataGrid timeSheets={timeSheets} loading={loading} />
    </Box>
  );
}
