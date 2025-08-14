"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";

import dayjs from "dayjs";

import { getStatusColor, getStatusIcon } from "../../_helpers/colorhelper";
import CustomDataGrid from "../../../_components/CustomDataGrid";

export default function ClaimsDataGrid({
  claims,
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
      field: "claimUrl",
      headerName: "Claim File",
      width: 150,
      renderCell: (params) => {
        const claimUrl = params.value;
        if (!claimUrl) return "No file";
        const fullUrl = "http://localhost:8080" + claimUrl;
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
      width: 100,
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
                    handleUpdateStatus &&
                    handleUpdateStatus(params.row, "approve")
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
        <CustomDataGrid rows={claims} columns={columns} />
      )}
    </Box>
  );
}
