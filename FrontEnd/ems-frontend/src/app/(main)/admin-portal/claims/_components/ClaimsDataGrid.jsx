"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Cancel from "@mui/icons-material/Cancel";

import Visibility from "@mui/icons-material/Visibility";
import CheckCircle from "@mui/icons-material/CheckCircle";

import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { getStatusColor, getStatusIcon } from "../../_helpers/colorhelper";

export default function ClaimsDataGrid({
  claims,
  loading,
  height = "auto",
  onViewClaim,
  onApprovalAction,
  showApprovalActions = false,
}) {
  const claimColumns = [
    { field: "employee_name", headerName: "Employee", width: 170 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "type", headerName: "Type", width: 140 },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: "claimDate",
      headerName: "Claim Date",
      width: 120,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "submission_date",
      headerName: "Submitted",
      width: 120,
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
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: '100%', justifyContent: 'center' }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => onViewClaim && onViewClaim(params.row)}
              color="primary"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
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
            disableSelectionOnClick
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
