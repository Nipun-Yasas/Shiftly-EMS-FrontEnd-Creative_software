"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import { DataGrid } from "@mui/x-data-grid";
import SearchField from "../../_components/SearchField";

export default function AssignUserTab({
  loading,
  unassignedUsers,
  handleAssignUser,
  searchQuery,
  handleSearchChange,
}) {
  const columns = [
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "createdAt", headerName: "Registered Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
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
          <Typography variant="h6">Assign Users</Typography>
          <Typography variant="body2" color="text.secondary">
            New users waiting for role assignment
          </Typography>
        </Box>

        <SearchField
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={unassignedUsers}
            columns={columns}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 50, 100]}
          />
        </Box>
      )}
    </Box>
  );
}
