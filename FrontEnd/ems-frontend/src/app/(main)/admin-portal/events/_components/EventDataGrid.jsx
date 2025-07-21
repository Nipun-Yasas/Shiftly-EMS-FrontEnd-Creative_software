"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { getStatusIcon, getStatusColor } from "../../_helpers/colorhelper";

export default function EventDataGrid({
  loading,
  events,
  onViewDetails,
  onApprovalAction,
  showApprovalActions = true,
}) {
  const eventColumns = [
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
    { field: "title", headerName: "Event Title", width: 200 },
    { field: "organizer", headerName: "Organizer", width: 150 },
    { field: "department", headerName: "Department", width: 120 },
    { field: "eventType", headerName: "Type", width: 120 },
    {
      field: "startDate",
      headerName: "Event Date",
      width: 120,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "expectedAttendees",
      headerName: "Attendees",
      width: 100,
      align: "center",
    },
    {
      field: "budget",
      headerName: "Budget",
      width: 100,
      renderCell: (params) => `$${params.value?.toLocaleString()}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      headerClassName: "actions-header",
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
          {showApprovalActions && params.row.status === "pending" && (
            <>
              <Tooltip title="Approve Event">
                <IconButton
                  size="small"
                  onClick={() => onApprovalAction(params.row, "approve")}
                  color="success"
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Event">
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
        <Box sx={{ height: 'auto', width: "100%" }}>
          <DataGrid
            rows={events}
            columns={eventColumns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </Box>
      )}
    </>
  );
}
