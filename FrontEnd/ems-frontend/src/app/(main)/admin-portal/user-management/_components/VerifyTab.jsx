"use client";

import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import CustomDataGrid from "../../../_components/CustomDataGrid";

export default function VerifyTab({
  loading,
  unVerified,
  onRefresh,
  onOpenAssign,
  handleDeleteUser
}) {
  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 150,
      disableColumnSeparator: true,
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 200,
      renderCell: () =>"2025-8-15",
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Tooltip title="Assign Role & Employee Number">
            <IconButton
              size="small"
              onClick={() => onOpenAssign?.(params.row)}
              sx={{ color: "primary.main" }}
            >
              <AssignmentIndIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDeleteUser(params.row)}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const hasData = Array.isArray(unVerified) && unVerified.length > 0;

  return (
    <Box sx={{ p: 3, mb: 3 }}>
      {/* Header with refresh button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Users awaiting verification
        </Typography>
        <Tooltip title="Refresh to check for new registrations">
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box sx={{ width: { xs: "100%", md: "670px" } }}>
          {!hasData ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="h6" gutterBottom>
                No users awaiting verification
              </Typography>
              <Typography variant="body2">
                All registered users have been verified. New user registrations
                will appear here.
              </Typography>
            </Box>
          ) : (
            <CustomDataGrid rows={unVerified} columns={columns} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
