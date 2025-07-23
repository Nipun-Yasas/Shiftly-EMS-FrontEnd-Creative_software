"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import UserDataGrid from "./UserDataGrid";

export default function VerifyTab({ loading, users, handleAssignUser, onRefresh }) {
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
    renderCell: (params) => {
      if (!params.value) return "N/A";

      try {
        const date = new Date(params.value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return "Invalid Date";
      }
    },
  },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",

      headerClassName: "last-column",
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Assign Role & Employee Number">
          <IconButton
            size="small"
            onClick={() => handleAssignUser(params.row)}
            sx={{ color: "primary.main" }}
          >
            <AssignmentIndIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

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
          Users awaiting verification ({users.length})
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "670px" } }}>
          <UserDataGrid loading={loading} rows={users} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
}
