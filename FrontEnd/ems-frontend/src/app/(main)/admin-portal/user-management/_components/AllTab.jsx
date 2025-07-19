"use client";

import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SearchField from "../../../../_components/main/SearchField";
import UserDataGrid from "./UserDataGrid";

export default function AllTab({
  loading,
  filteredUsers,
  handleEdit,
  setUserToDelete,
  setDeleteConfirmOpen,
  searchQuery,
  handleSearchChange,
}) {
  const columns = [
    { field: "username", headerName: "Username", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "roleId",
      headerName: "Role",
      width: 110,
      renderCell: (params) => params.value?.name || params.value,
    },
    { field: "designation", headerName: "Designation", width: 140 },

    { field: "department", headerName: "Department", width: 140 },
    { field: "reporting_person", headerName: "Reporting Person", width: 130 },
    { field: "verifiedBy", headerName: "Verified By", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 90,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1,width: '100%', justifyContent: 'center'  }}>
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
          mb: 3,
        }}
      >
        <Box>
          <SearchField
            placeholder="Search users ..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: { xs: "auto", sm: 200 } }}
          />
        </Box>
      </Box>

      <UserDataGrid loading={loading} rows={filteredUsers} columns={columns} />
    </Box>
  );
}
