"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { DataGrid } from "@mui/x-data-grid";
import { getStatusColor } from "../../_helpers/colorhelper";
import axiosInstance from "../../../../_utils/axiosInstance";
import { API_PATHS } from "../../../../_utils/apiPaths";

export default function TimesheetDataGrid({
  data,
  type = "employee",
  onViewTimesheets,
  onApprove,
  onReject,
  showTeamColumn = false,
  showProjectColumn = false,
}) {
  // User summary data grid columns (for distinct users)
  const userColumns = [
    {
      field: "name",
      headerName: "Employee Name",
      width: 200,
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
    },
    {
      field: "team",
      headerName: "Team",
      width: 120,
    },
    {
      field: "totalEntries",
      headerName: "Total Entries",
      width: 120,
      align: "center",
    },
    {
      field: "totalHours",
      headerName: "Total Hours",
      width: 120,
      align: "center",
      renderCell: (params) => (
        <span>{params.value?.toFixed(1) || '0.0'}</span>
      ),
    },
    {
      field: "pendingCount",
      headerName: "Pending",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value || 0}
          color="warning"
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "approvedCount",
      headerName: "Approved",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value || 0}
          color="success"
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: "last-column",
      align: "center",
      sortable: false,
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
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onViewTimesheets(params.row)}
            sx={{ fontSize: '0.75rem' }}
          >
            View All
          </Button>
        </Box>
      ),
    },
  ];

  // Employee data grid columns (original timesheet entries)
  const employeeColumns = [
    {
      field: "date",
      headerName: "Submit date",
      width: 150,
    },
    {
      field: "mode",
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
        field: "activity",
        headerName: "Submit date",
        width: 150,
      },
      {
        field: "hours",
        headerName: "Department",
        width: 170,
      },
      
      {
        field: "status",
        headerName: "Department",
        width: 170,
      },



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
      field: "mode",
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

  // Determine which columns to use based on type
  const getColumns = () => {
    switch (type) {
      case "users":
        return userColumns;
      case "timesheet":
        return timesheetColumns;
      default:
        return employeeColumns;
    }
  };

  const columns = getColumns();

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        rowsPerPageOptions={[10]}
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
