"use client";

import React from "react";
import Box from "@mui/material/Box";

import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  getStatusColor,
  getStatusIcon,
  getLeaveTypeColor,
} from "../../_helpers/colorhelper";

import { DataGrid } from "@mui/x-data-grid";

export default function LeavesDataGrid({
  loading,
  leaves,
  onViewDetails,
  onApprovalAction,
}) {
  const leaveColumns = [
    { field: "employeeName", headerName: "Employee", width: 150 },
    { field: "department", headerName: "Department", width: 130 },
    {
      field: "leaveType",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          style={{
            backgroundColor: getLeaveTypeColor(params.value),
            color: "white",
          }}
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "leaveDuration",
      headerName: "Duration",
      width: 90,
      renderCell: (params) =>
        `${params.value} day${params.value > 1 ? "s" : ""}`,
    },
    {
      field: "leaveFrom",
      headerName: "From",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "leaveTo",
      headerName: "To",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "submissionDate",
      headerName: "Submitted",
      width: 120,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: "last-column",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: '100%', justifyContent: 'center' }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => onViewDetails(params.row)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === "pending" && (
            <>
              <Tooltip title="Approve Leave">
                <IconButton
                  size="small"
                  onClick={() => onApprovalAction(params.row, "approve")}
                  color="success"
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Leave">
                <IconButton
                  size="small"
                  onClick={() => onApprovalAction(params.row, "reject")}
                  color="error"
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];
  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: "auto", width: "100%" }}>
          <DataGrid
            rows={leaves}
            columns={leaveColumns}
            pageSize={10}
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
      )}
    </>
  );
}
