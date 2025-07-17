"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import SearchField from "../../_components/SearchField";
import TimesheetDataGrid from "./TimesheetDataGrid";

export default function TeamViewTab({
  teamGroupedEmployees,
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
            Team-wise Timesheets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage timesheets organized by teams
          </Typography>
        </Box>
        <SearchField
          placeholder="Search ..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      {Object.entries(teamGroupedEmployees).map(([team, teamEmployees]) => (
        <Paper key={team} sx={{ mb: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">{team} Team</Typography>
            <Typography variant="body2">
              {teamEmployees.length} employee(s),{" "}
              {teamEmployees.reduce(
                (sum, emp) => sum + emp.pendingSubmissions,
                0
              )}{" "}
              pending timesheet(s)
            </Typography>
          </Box>
          <TimesheetDataGrid
            data={teamEmployees}
            type="employee"
            onViewTimesheets={onViewTimesheets}
            showTeamColumn={false}
            showProjectColumn={true}
            hideFooter={teamEmployees.length <= 5}
            initialPageSize={5}
            pageSizeOptions={[5, 10]}
          />
        </Paper>
      ))}
    </Box>
  );
}
