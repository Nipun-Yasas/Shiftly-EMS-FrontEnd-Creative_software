"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";

import { DataGrid } from "@mui/x-data-grid";
import SearchField from "../../_components/SearchField";

export default function EmployeeViewTab({
  employees,
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
            <Typography variant="subtitle2" color="textPrimary">
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
      width: 150,
    },
    {
      field: "project",
      headerName: "Project",
      width: 180,
    },
    {
      field: "pendingSubmissions",
      headerName: "Pending Submissions",
      width: 180,
      renderCell: (params) =>
        params.value > 0 ? (
          <Chip
            label={`${params.value} Pending`}
            color="warning"
            size="small"
          />
        ) : (
          <Chip label="None" color="success" size="small" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={employees}
          columns={columns}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </div>
    </Box>
  );
}
