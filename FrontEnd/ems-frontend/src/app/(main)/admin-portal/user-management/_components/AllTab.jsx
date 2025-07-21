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
  users,
  handleEdit,
  setUserToDelete,
  setDeleteConfirmOpen,
}) {
  const columns = [
    { field: "username", headerName: "Username", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "roles",
      headerName: "Role",
      width: 110,
      renderCell: (params) => {
        // Handle both roleId.name (old structure) and roles array (new structure)
        if (params.value && Array.isArray(params.value)) {
          return params.value.join(", ");
        }
        return params.row.roleId?.name || params.value || "N/A";
      },
    },
    { 
      field: "active", 
      headerName: "Status", 
      width: 100,
      renderCell: (params) => (
        <span style={{ 
          color: params.value ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {params.value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { 
      field: "verified", 
      headerName: "Verified", 
      width: 100,
      renderCell: (params) => (
        <span style={{ 
          color: params.value ? 'green' : 'orange',
          fontWeight: 'bold'
        }}>
          {params.value ? 'Yes' : 'No'}
        </span>
      ),
    },
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
        
      </Box>

      <UserDataGrid loading={loading} rows={users} columns={columns} />
    </Box>
  );
}
