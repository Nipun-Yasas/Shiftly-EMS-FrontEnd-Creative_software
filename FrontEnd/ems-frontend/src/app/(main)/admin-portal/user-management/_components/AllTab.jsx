"use client";

import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CircularProgress from "@mui/material/CircularProgress";

import CustomDataGrid from "../../../_components/CustomDataGrid";

export default function VerifyTab({
  loading,
  all,
  onOpenAssign,
  handleDeleteUser,
}) {
  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 200,
      disableColumnSeparator: true,
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "roles",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.value?.[0] || "No role",
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 100,
      renderCell: (params) => {
        const rolesArr = params.row?.roles || [];
        const isSuperAdmin = rolesArr.some(
          (r) => String(r).toLowerCase() === "super_admin"
        );
        if (isSuperAdmin) return null;
        return (
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Tooltip title="Assign Role & Employee Number">
              <IconButton
                size="small"
                onClick={() => onOpenAssign?.(params.row)}
                sx={{ color: "primary.main" }}
              >
                <EditIcon />
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
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h6" gutterBottom>
        All Verified Users
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: { xs: "100%", md: "670px" },
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <CustomDataGrid rows={all} columns={columns} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
