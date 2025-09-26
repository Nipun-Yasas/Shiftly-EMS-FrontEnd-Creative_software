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

import {
  getStatusColor,
  getStatusIcon,
  getWorkModeColor,
} from "../../_helpers/colorhelper";

import CustomDataGrid from "../../../_components/CustomDataGrid";

export default function TimeSheets({
  timeSheets,
  loading,
  handleUpdateStatus,
  showApprovalActions = false,
}) {
  const columns = [
    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 150,
    },
    {
      field: "departmentName",
      headerName: "Department",
      width: 150,
    },
    {
      field: "mode",
      headerName: "Work Mode",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getWorkModeColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 70,
    },
    {
      field: "date",
      headerName: "Date",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      field: "activity",
      headerName: "Activity",
      width: 230,
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
              <Tooltip title="Approve Time Sheet">
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
              <Tooltip title="Reject Time Sheet">
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
        <CustomDataGrid rows={timeSheets} columns={columns} />
      )}
    </Box>
  );
}
