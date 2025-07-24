"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Download from "@mui/icons-material/Download";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { getStatusIcon, getStatusColor } from "../../_helpers/colorhelper";

export default function EventDataGrid({
  loading,
  events,
  onApprovalAction,
  showApprovalActions = true,
}) {
  const eventColumns = [
    
    { field: "title", headerName: "Event Title", width: 200 },
    { field: "organizer", headerName: "Name", width: 170 },
    { field: "department", headerName: "Department", width: 160 },
    { field: "eventType", headerName: "Type", width: 160 },
    {
      field: "startDate",
      headerName: "Event Date",
      width: 150,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
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
      field: "imageUrl",
      headerName: "Banner",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params.value;
        
        return imageUrl && imageUrl.trim() !== "" ? (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={() => window.open(`http://localhost:8080${imageUrl}`, '_blank')}
            sx={{ 
              fontSize: '0.75rem',
              minWidth: 'auto',
              px: 1,
              py: 0.5
            }}
          >
            Download
          </Button>
        ) : (
          <span style={{ color: '#999' }}>No banner</span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: "last-column",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: '100%', justifyContent: 'center' }}>
          
          {showApprovalActions && (params.row.status === "pending" || params.row.status === "PENDING") && (
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
