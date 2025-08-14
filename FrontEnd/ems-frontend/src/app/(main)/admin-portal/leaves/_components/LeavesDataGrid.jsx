"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";

import dayjs from "dayjs";

import { getStatusColor, getStatusIcon } from "../../_helpers/colorhelper";

import CustomDataGrid from "../../../_components/CustomDataGrid";

export default function TimeSheetDataGrid({
  leaves,
  loading,
  handleUpdateStatus,
  showApprovalActions = false,
}) {
  const columns = [
    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 120,
    },
    {
      field: "departmentName",
      headerName: "Department",
      width: 150,
    },
    {
      field: "leaveType",
      headerName: "Leave Type",
      width: 90,
      renderCell: (params) => <span>{params.value}</span>,
    },
    {
      field: "leaveFrom",
      headerName: "Leave From",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "leaveTo",
      headerName: "Leave To",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    { field: "reason", headerName: "Reason", width: 160 },
    { field: "coverPersonName", headerName: "Cover Person", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value.toLowerCase())}
          label={params.value}
          color={getStatusColor(params.value.toLowerCase())}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
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
              <Tooltip title="Approve Leave">
                <IconButton
                  size="small"
                  onClick={() =>
                    handleUpdateStatus &&
                    handleUpdateStatus(params.row, "approve")
                  }
                  color="success"
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Leave">
                <IconButton
                  size="small"
                  onClick={() =>
                    handleUpdateStatus &&
                    handleUpdateStatus(params.row, "reject")
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <CustomDataGrid rows={leaves} columns={columns} />
      )}
    </Box>
  );
}
