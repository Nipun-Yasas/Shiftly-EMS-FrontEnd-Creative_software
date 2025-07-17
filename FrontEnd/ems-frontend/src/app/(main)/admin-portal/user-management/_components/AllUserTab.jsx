"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SearchField from "../../_components/SearchField";
import UserDataGrid from "./UserDataGrid";

export default function AllUserTab({
  loading,
  filteredUsers,
  handleEdit,
  setUserToDelete,
  setDeleteConfirmOpen,
  searchQuery,
  handleSearchChange,
  handleAddUserClick,
}) {
  const columns = [
    { field: "employeeNumber", headerName: "Employee Number", width: 150 },
    { field: "username", headerName: "Username", width: 160 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "roleId",
      headerName: "Role",
      width: 130,
      renderCell: (params) => params.value?.name || params.value,
    },
    { field: "createdBy", headerName: "Created By", width: 140 },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{ color: "primary.main" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                setUserToDelete(params.row);
                setDeleteConfirmOpen(true);
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
        <Typography variant="h6">User List</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <SearchField
            placeholder="Search ..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: { xs: "auto", sm: 200 } }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUserClick}
          >
            Assign User
          </Button>
        </Box>
      </Box>

      <UserDataGrid loading={loading} rows={filteredUsers} columns={columns} />
    </Box>
  );
}
