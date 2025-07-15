"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DownloadIcon from "@mui/icons-material/Download";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import SearchField from "../../_components/SearchField";

export default function UnreadTab({
  letters,
  loading,
  searchQuery,
  handleSearchChange,
  onViewDetails,
  onViewHistory,
  onMarkAsRead,
  onGenerateLetter,
  onDownloadLetter,
}) {
  const letterColumns = [
    { field: "employeeName", headerName: "Employee", width: 150 },
    { field: "employeeId", headerName: "ID", width: 100 },
    { field: "letterType", headerName: "Letter Type", width: 230 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={<RadioButtonUncheckedIcon />}
          label="unread"
          color="warning"
          size="small"
        />
      ),
    },
    { field: "department", headerName: "Department", width: 130 },
    {
      field: "requestDate",
      headerName: "Requested",
      width: 120,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 230,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => onViewDetails(params.row)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Read History">
            <IconButton
              size="small"
              onClick={() => onViewHistory(params.row.id)}
              color="info"
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Read">
            <IconButton
              size="small"
              onClick={() => onMarkAsRead(params.row.id)}
              color="success"
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          {params.row.processedAt ? (
            <Tooltip title="Download Letter">
              <IconButton
                size="small"
                onClick={() =>
                  onDownloadLetter(
                    params.row.id,
                    params.row.employeeName,
                    params.row.letterType
                  )
                }
                color="secondary"
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Generate Letter">
              <IconButton
                size="small"
                onClick={() => onGenerateLetter(params.row.id)}
                color="primary"
              >
                <AssignmentIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <SearchField
          placeholder="Search unread letters..."
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
        <DataGrid
          rows={letters}
          columns={letterColumns}
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
      )}
    </Box>
  );
}
