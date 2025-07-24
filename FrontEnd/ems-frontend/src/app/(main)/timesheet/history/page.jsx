"use client";

import Box from "@mui/material/Box";
import TimesheetRecord from "../_components/TimesheetRecord";
import { Paper } from "@mui/material";

export default function TimesheetHistory() {
  return (
    <Paper elevation={3} sx={{ width: "100%", height: "100%" }}>
      <TimesheetRecord />
    </Paper>
  );
} 