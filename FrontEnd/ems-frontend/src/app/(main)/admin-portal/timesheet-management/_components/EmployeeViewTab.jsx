"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SearchField from "../../_components/SearchField";
import TimesheetDataGrid from "./TimesheetDataGrid";

export default function EmployeeViewTab({
  employees,
  searchQuery,
  handleSearchChange,
  onViewTimesheets,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Employee Timesheets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage timesheets by individual employees
          </Typography>
        </Box>
        <SearchField
          placeholder="Search ..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      <TimesheetDataGrid
        data={employees}
        type="employee"
        onViewTimesheets={onViewTimesheets}
        showTeamColumn={true}
        showProjectColumn={true}
        initialPageSize={10}
        pageSizeOptions={[10, 50, 100]}
      />
    </Box>
  );
}


