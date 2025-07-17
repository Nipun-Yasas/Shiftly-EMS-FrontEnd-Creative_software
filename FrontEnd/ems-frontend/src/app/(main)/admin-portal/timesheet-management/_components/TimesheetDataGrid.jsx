"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
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
  showTeamColumn = true,
  showProjectColumn = true,
  hideFooter = false,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 50, 100],
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Employee data grid columns
  const employeeColumns = [
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
    ...(showTeamColumn
      ? [
          {
            field: "team",
            headerName: "Team",
            width: showProjectColumn ? 150 : 210,
          },
        ]
      : []),
    ...(showProjectColumn
      ? [
          {
            field: "project",
            headerName: "Project",
            width: showTeamColumn ? 180 : 200,
          },
        ]
      : []),
    {
      field: "pendingSubmissions",
      headerName: "Pending Submissions",
      width: 200,
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
      width: 140,
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

  const timesheetColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 100,
    },
    {
      field: "projectTask",
      headerName: "Project Task",
      width: 150,
    },
    {
      field: "workMode",
      headerName: "Work Mode",
      width: 120,
    },
    {
      field: "activity",
      headerName: "Activity",
      width: 130,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 90,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      width: 120,
      sortable: false,
      renderCell: (params) =>
        params.row.status === "Pending" ? (
          <Box sx={{ display: "flex", gap: 1 }}>
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

  // Don't render the DataGrid until the component is mounted
  if (!mounted) {
    return (
      <Box
        sx={{
          height: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        disableSelectionOnClick
        hideFooter={hideFooter}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: initialPageSize },
          },
        }}
        pageSizeOptions={pageSizeOptions}
      />
    </Box>
  );
}

