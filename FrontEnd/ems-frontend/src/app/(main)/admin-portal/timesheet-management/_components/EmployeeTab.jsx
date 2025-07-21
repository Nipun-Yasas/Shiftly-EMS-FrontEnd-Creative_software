"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../../../_components/main/SearchField";
import TimesheetDataGrid from "./TimesheetDataGrid";

export default function EmployeeTab({
  employees,
  onViewTimesheets,
}) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ width: { xs: "100%", lg: "800px" } }}>
          <TimesheetDataGrid
            data={employees}
            type="employee"
            onViewTimesheets={onViewTimesheets}
            showTeamColumn={true}
            showProjectColumn={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
