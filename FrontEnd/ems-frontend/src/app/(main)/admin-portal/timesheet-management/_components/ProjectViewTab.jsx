"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";

import { DataGrid } from "@mui/x-data-grid";
import SearchField from "../../_components/SearchField";

export default function ProjectViewTab({
  projectGroupedEmployees,
  searchQuery,
  handleSearchChange,
  onViewTimesheets,
}) {
  const columns = [
    {
      field: "employee",
      headerName: "Employee",
      width: 350,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <PersonIcon />
          </Box>
          <Box>
            <Typography variant="subtitle2">
              {params.row.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "team",
      headerName: "Team",
      width: 220,
    },
    {
      field: "pendingSubmissions",
      headerName: "Pending Submissions",
      width: 210,
      renderCell: (params) => (
        params.value > 0 ? (
          <Chip
            label={`${params.value} Pending`}
            color="warning"
            size="small"
          />
        ) : (
          <Chip label="None" color="success" size="small" />
        )
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 210,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => onViewTimesheets(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box>
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
            <Box>
              <DataGrid
                rows={projectEmployees}
                columns={columns}
                disableSelectionOnClick
                hideFooter={projectEmployees.length <= 5}
                sx={{
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  border: 0,
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            </Box>
          </Paper>
        )
      )}
    </Box>
  );
}
