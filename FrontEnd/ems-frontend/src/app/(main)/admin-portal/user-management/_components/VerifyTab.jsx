"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import SearchField from "../../_components/SearchField";
import UserDataGrid from "./UserDataGrid";

export default function VerifyTab({
  loading,
  unassignedUsers,
  handleAssignUser,
  searchQuery,
  handleSearchChange,
}) {
  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 170,
      disableColumnSeparator: true,
    },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 170,
      align: "center",
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
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6">Unverified Users</Typography>
        </Box>

        <SearchField
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ width: { xs: "100%", lg: "700px" } }}>
          <UserDataGrid
            loading={loading}
            rows={unassignedUsers}
            columns={columns}
          />
        </Box>
      </Box>
    </Box>
  );
}
