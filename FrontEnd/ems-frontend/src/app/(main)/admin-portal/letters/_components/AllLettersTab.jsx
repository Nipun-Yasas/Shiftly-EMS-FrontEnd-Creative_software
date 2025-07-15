"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DownloadIcon from "@mui/icons-material/Download";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import SearchField from "../../_components/SearchField";

export default function AllLettersTab({
  letters,
  loading,
  searchQuery,
  handleSearchChange,
  letterTypes,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  onViewDetails,
  onViewHistory,
  onMarkAsRead,
  onMarkAsUnread,
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
          icon={
            params.value === "read" ? (
              <CheckCircleIcon />
            ) : (
              <RadioButtonUncheckedIcon />
            )
          }
          label={params.value}
          color={params.value === "read" ? "success" : "warning"}
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
          <Tooltip
            title={
              params.row.status === "read" ? "Mark as Unread" : "Mark as Read"
            }
          >
            <IconButton
              size="small"
              onClick={() =>
                params.row.status === "read"
                  ? onMarkAsUnread(params.row.id)
                  : onMarkAsRead(params.row.id)
              }
              color={params.row.status === "read" ? "warning" : "success"}
            >
              {params.row.status === "read" ? (
                <VisibilityOffIcon />
              ) : (
                <CheckCircleIcon />
              )}
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
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <SearchField
          placeholder="Search letters..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={filterType}
            label="Filter by Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            {letterTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
