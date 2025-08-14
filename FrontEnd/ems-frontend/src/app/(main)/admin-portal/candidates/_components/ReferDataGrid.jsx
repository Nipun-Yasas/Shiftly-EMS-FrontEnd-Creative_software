"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import CheckCircle from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";

import { getStatusColor, getStatusIcon } from "../../_helpers/colorhelper";
import CustomDataGrid from "../../../_components/CustomDataGrid";

export default function ReferDataGrid({
  candidates,
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
    { field: "vacancyName", headerName: "Vacancy", width: 120 },
    { field: "applicantName", headerName: "Candidate", width: 120 },
    { field: "applicantEmail", headerName: "Candidate Email", width: 170 },
    {
      field: "message",
      headerName: "Message",
      width: 190,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
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
      field: "fileUrl",
      headerName: "Resume file",
      width: 130,
      renderCell: (params) => {
        const fileUrl = params.value;
        if (!fileUrl) return "No file";
        const fullUrl = "http://localhost:8080" + fileUrl;
        return (
          <Button
            component="a"
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            variant="outlined"
            size="small"
            sx={{
              fontSize: "0.75rem",
              minWidth: "auto",
              px: 1,
              py: 0.5,
            }}
            startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
          >
            Download
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
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
          {showApprovalActions && params.row.status === "unread" && (
            <Tooltip title="Mark as read">
              <IconButton
                size="small"
                onClick={() =>
                  handleUpdateStatus && handleUpdateStatus(params.row, "read")
                }
                color="success"
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>
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
        <CustomDataGrid rows={candidates} columns={columns} />
      )}
    </Box>
  );
}
