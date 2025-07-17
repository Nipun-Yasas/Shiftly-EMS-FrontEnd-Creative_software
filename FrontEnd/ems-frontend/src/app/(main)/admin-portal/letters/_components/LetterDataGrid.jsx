"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DownloadIcon from "@mui/icons-material/Download";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

export default function LetterDataGrid({
  loading,
  letters,
  onViewDetails,
  onMarkAsRead,
  onMarkAsUnread,
  onGenerateLetter,
  onDownloadLetter,
  statusFilter = "all",
}) {
  const letterColumns = [
    { field: "employeeName", headerName: "Employee", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "letterType", headerName: "Letter Type", width: 230 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        if (params.value === "read") {
          return (
            <Chip
              icon={<CheckCircleIcon />}
              label="read"
              color="success"
              size="small"
            />
          );
        } else {
          return (
            <Chip
              icon={<RadioButtonUncheckedIcon />}
              label="unread"
              color="warning"
              size="small"
            />
          );
        }
      },
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
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const buttons = [
          // View Details Button
          <Tooltip key="view" title="View Details">
            <IconButton
              size="small"
              onClick={() => onViewDetails(params.row)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>,
        ];

        // Mark as Read/Unread Button (conditional based on status and filter)
        if (statusFilter === "all") {
          buttons.push(
            <Tooltip
              key="toggle-read"
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
          );
        } else if (statusFilter === "read") {
          buttons.push(
            <Tooltip key="mark-unread" title="Mark as Unread">
              <IconButton
                size="small"
                onClick={() => onMarkAsUnread(params.row.id)}
                color="warning"
              >
                <VisibilityOffIcon />
              </IconButton>
            </Tooltip>
          );
        } else if (statusFilter === "unread") {
          buttons.push(
            <Tooltip key="mark-read" title="Mark as Read">
              <IconButton
                size="small"
                onClick={() => onMarkAsRead(params.row.id)}
                color="success"
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          );
        }

        // Generate/Download Letter Button
        if (params.row.processedAt) {
          buttons.push(
            <Tooltip key="download" title="Download Letter">
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
          );
        } else {
          buttons.push(
            <Tooltip key="generate" title="Generate Letter">
              <IconButton
                size="small"
                onClick={() => onGenerateLetter(params.row.id)}
                color="primary"
              >
                <AssignmentIcon />
              </IconButton>
            </Tooltip>
          );
        }

        return (
          <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
            {buttons}
          </Box>
        );
      },
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
        </Box>
      )}
    </>
  );
}
