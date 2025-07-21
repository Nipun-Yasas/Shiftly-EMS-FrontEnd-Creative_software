"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TimesheetDataGrid from "./TimesheetDataGrid";

export default function TeamTab({
  teamGroupedEmployees,
  onViewTimesheets,
}) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      {Object.entries(teamGroupedEmployees).map(([team, teamEmployees]) => (
        <Box>
          <Typography variant="h6">{team} Team</Typography>
          <Typography variant="body2">
            {teamEmployees.length} employee(s) pending timesheet(s)
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 2,
            }}
          >
            <Box sx={{ width: { xs: "100%", lg: "650px" }, mb:3 }}>
              <TimesheetDataGrid
                data={teamEmployees}
                type="employee"
                onViewTimesheets={onViewTimesheets}
                showTeamColumn={false}
                showProjectColumn={true}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
