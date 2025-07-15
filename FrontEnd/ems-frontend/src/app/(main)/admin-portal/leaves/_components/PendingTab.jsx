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
import HistoryIcon from "@mui/icons-material/History";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import SearchField from "../../_components/SearchField";

export default function PendingTab({
  leaves,
  loading,
  searchQuery,
  handleSearchChange,
  filterStatus,
  setFilterStatus,
  onViewDetails,
  onApprovalAction,
  onViewHistory,
  getStatusColor,
  getStatusIcon,
  getLeaveTypeColor,
}) {
  const getStatusIconComponent = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon />;
      case "rejected":
        return <CancelIcon />;
      case "pending":
        return <AccessTimeIcon />;
      default:
        return <EventAvailableIcon />;
    }
  };

  const leaveColumns = [
    { field: "leaveId", headerName: "Leave ID", width: 120 },
    { field: "employeeName", headerName: "Employee", width: 150 },
    { field: "department", headerName: "Department", width: 120 },
    {
      field: "leaveType",
      headerName: "Type",
      width: 140,
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
          icon={getStatusIconComponent(params.value)}
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "leaveDuration",
      headerName: "Duration",
      width: 100,
      renderCell: (params) =>
        `${params.value} day${params.value > 1 ? "s" : ""}`,
    },
    {
      field: "leaveFrom",
      headerName: "From",
      width: 120,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "leaveTo",
      headerName: "To",
      width: 120,
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
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => onViewDetails(params.row)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
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
          <Tooltip title="View History">
            <IconButton
              size="small"
              onClick={() => onViewHistory(params.row.id)}
              color="info"
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ pb: 2, display: "flex", alignItems: "center" }}>
        <SearchField
          placeholder="Search pending leaves..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
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
    </Box>
  );
}
