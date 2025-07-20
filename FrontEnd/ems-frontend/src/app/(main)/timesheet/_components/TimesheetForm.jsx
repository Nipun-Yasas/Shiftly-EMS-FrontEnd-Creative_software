"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import UpdateTimesheet from "./UpdateTimesheet";
import TimesheetRecord from "./TimesheetRecord";
import TimesheetLegend from "./TimesheetLegend";

export default function TimesheetForm({ setOpenSubmit }) {
  return (
    <Box sx={{ py: 3 }}>
      {/* Update Timesheet Section */}
      <Box sx={{ mb: 3 }}>
        <UpdateTimesheet />
      </Box>
      
      {/* Timesheet Record Section */}
      <Box sx={{ mb: 3 }}>
        <TimesheetRecord />
      </Box>
      
      {/* Legend Section - Horizontal Layout */}
      <Box sx={{ width: '100%' }}>
        <TimesheetLegend />
      </Box>
    </Box>
  );
} 