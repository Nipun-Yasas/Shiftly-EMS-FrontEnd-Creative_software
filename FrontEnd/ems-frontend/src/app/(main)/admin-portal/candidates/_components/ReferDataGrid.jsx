import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnreadIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";

export default function ReferDataGrid({
  rows,
  loading,
  onDownloadFile,
  onViewDetails,
  onMarkAsRead,
  onMarkAsUnread
}) {
  const candidateColumns = [
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "email", headerName: "Email", width: 210 },
    { field: "position", headerName: "Position", width: 180 },
    {
      field: "submissionDate",
      headerName: "Submitted",
      width: 180,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Tooltip title={`Click to mark as ${params.value === "read" ? "unread" : "read"}`}>
          <Chip
            icon={params.value === "read" ? <CheckCircleIcon /> : <UnreadIcon />}
            label={params.value}
            color={params.value === "read" ? "success" : "warning"}
            size="small"
            onClick={() => {
              console.log('Status clicked for:', params.row);
              if (params.value === "read") {
                onMarkAsUnread && onMarkAsUnread(params.row.id);
              } else {
                onMarkAsRead && onMarkAsRead(params.row.id);
              }
            }}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          />
        </Tooltip>
      ),
    },
    {
      field: "file",
      headerName: "File Name",
      width: 100,
      headerClassName: "last-column",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Tooltip title={params.row.fileUrl ? "Download File" : "No file available"}>
            <IconButton
              size="small"
              onClick={() => {
                console.log('Download clicked for:', params.row); // Debug log
                if (onDownloadFile && typeof onDownloadFile === 'function') {
                  onDownloadFile(params.row);
                } else {
                  console.error('onDownloadFile is not a function:', onDownloadFile);
                }
              }}
              sx={{ color: '#E91E63' }}
              disabled={!params.row.fileUrl}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={candidateColumns}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 20]}
      loading={loading}
    />
  );
}
