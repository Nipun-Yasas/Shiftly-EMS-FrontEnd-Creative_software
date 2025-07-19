"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SearchField from "../../_components/SearchField";
import TimesheetDataGrid from "./TimesheetDataGrid";

export default function ProjectTab({
  projectGroupedEmployees,
  searchQuery,
  handleSearchChange,
  onViewTimesheets,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
        }}
      >
        <SearchField
          placeholder="Search ..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      {Object.entries(projectGroupedEmployees).map(
        ([project, projectEmployees]) => (
          <Box>
            <Typography variant="h6">{project}</Typography>
            <Typography variant="body2">
              {projectEmployees.length} employee(s), pending timesheet(s)
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: 2,
              }}
            >
              <Box sx={{ width: { xs: "100%", lg: "600px" } }}>
                <TimesheetDataGrid
                  data={projectEmployees}
                  type="employee"
                  onViewTimesheets={onViewTimesheets}
                  showTeamColumn={true}
                  showProjectColumn={false}
                />
              </Box>
            </Box>
          </Box>
        )
      )}
    </Box>
  );
}
