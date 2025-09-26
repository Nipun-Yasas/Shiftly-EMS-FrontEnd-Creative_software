"use client";

import React from "react";
import Box from "@mui/material/Box";

import TimeSheets from "./TimeSheets";

export default function RejectedTab({ timeSheets, loading }) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <TimeSheets timeSheets={timeSheets} loading={loading} />
    </Box>
  );
}
