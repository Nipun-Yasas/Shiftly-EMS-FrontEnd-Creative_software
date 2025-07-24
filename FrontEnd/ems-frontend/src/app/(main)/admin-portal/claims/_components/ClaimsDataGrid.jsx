"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Download from "@mui/icons-material/Download";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { getStatusColor, getStatusIcon } from "../../_helpers/colorhelper";

export default function ClaimsDataGrid({
  claims,
  loading,
  height = "auto",
  onApprovalAction,
  showApprovalActions = false,
}) {
  const claimColumns = [
    { field: "employee_name", headerName: "Employee", width: 150 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "type", headerName: "Type", width: 110 },
    {
      field: "claimDate",
      headerName: "Claim Date",
      width: 140,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "submission_date",
      headerName: "Submitted",
      width: 140,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
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
      field: "claimUrl",
      headerName: "File",
      width: 120,
      sortable: false,
      renderCell: (params) => 
        params.value ? (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={() => window.open(`http://localhost:8080${params.value}`, '_blank')}
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
          <span style={{ color: '#999' }}>No file</span>
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      headerClassName: "last-column",
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
          {showApprovalActions && params.row.status === "pending" && (
            <>
              <Tooltip title="Approve Claim">
                <IconButton
                  size="small"
                  onClick={() =>
                    onApprovalAction && onApprovalAction(params.row, "approve")
                  }
                  color="success"
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Claim">
                <IconButton
                  size="small"
                  onClick={() =>
                    onApprovalAction && onApprovalAction(params.row, "reject")
                  }
                  color="error"
                >
                  <Cancel />
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
        <Box sx={{ height: height, width: "100%" }}>
          <DataGrid
            rows={claims}
            columns={claimColumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      )}
    </>
  );
}
