"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { DataGrid } from "@mui/x-data-grid";
import { getStatusColor } from "../../_helpers/colorhelper";

export default function TimesheetDataGrid({
  data,
  type = "employee",
  onViewTimesheets,
  onApprove,
  onReject,
  showTeamColumn = false,
  showProjectColumn = false,
}) {
  // Employee data grid columns
  const employeeColumns = [
    {
      field: "name",
      headerName: "Employee",
      width: 150,
    },
    {
      field: "department",
      headerName: "Department",
      width: 170,
    },
    ...(showTeamColumn
      ? [
          {
            field: "team",
            headerName: "Team",
            width: 150,
          },
        ]
      : []),
    ...(showProjectColumn
      ? [
          {
            field: "project",
            headerName: "Project",
            width: 200,
          },
        ]
      : []),

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: "last-column",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            mt: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onViewTimesheets(params.row)}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  const timesheetColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
    },
    {
      field: "workMode",
      headerName: "Work Mode",
      width: 100,
    },
    {
      field: "activity",
      headerName: "Activity",
      width: 350,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 80,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "last-column",
      align: "center",
      sortable: false,
      renderCell: (params) =>
        params.row.status === "Pending" ? (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              mt: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <IconButton
              size="small"
              color="success"
              onClick={() => onApprove(params.row.id)}
              title="Approve"
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onReject(params.row.id)}
              title="Reject"
            >
              <CancelIcon />
            </IconButton>
          </Box>
        ) : null,
    },
  ];

  const columns = type === "employee" ? employeeColumns : timesheetColumns;

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 50, 100]}
      />
    </Box>
  );
}
