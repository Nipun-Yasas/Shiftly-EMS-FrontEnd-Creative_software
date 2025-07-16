"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import SearchField from "../../_components/SearchField";
import TimesheetDataGrid from "./TimesheetDataGrid";

export default function ProjectViewTab({
  projectGroupedEmployees,
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
            Project-wise Timesheets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage timesheets organized by projects
          </Typography>
        </Box>
        <SearchField
          placeholder="Search ..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      {Object.entries(projectGroupedEmployees).map(
        ([project, projectEmployees]) => (
          <Paper key={project} sx={{ mb: 3, overflow: "hidden" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">{project}</Typography>
              <Typography variant="body2">
                {projectEmployees.length} employee(s),{" "}
                {projectEmployees.reduce(
                  (sum, emp) => sum + emp.pendingSubmissions,
                  0
                )}{" "}
                pending timesheet(s)
              </Typography>
            </Box>
            <TimesheetDataGrid
              data={projectEmployees}
              type="employee"
              onViewTimesheets={onViewTimesheets}
              showTeamColumn={true}
              showProjectColumn={false}
              hideFooter={projectEmployees.length <= 5}
              initialPageSize={5}
              pageSizeOptions={[5, 10]}
            />
          </Paper>
        )
      )}
    </Box>
  );
}

