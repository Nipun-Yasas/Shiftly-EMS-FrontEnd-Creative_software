"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    { field: "email", headerName: "Email", width: 170 },
    {
      field: "roles",
      headerName: "Role",
      width: 80,
      renderCell: (params) => {
        return params.value?.[0] || "No role";
      },
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 140,
    },
    {
      field: "department",
      headerName: "Department",
      width: 140,
    },
    
    {
      field: "reportingPerson",
      headerName: "Reporting Person",
      width: 140,
    },
    {
      field: "reportingPersonEmail",
      headerName: "Reporting Email",
      width: 170,
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 90,
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
      <UserDataGrid loading={loading} rows={users} columns={columns} />
    </Box>
  );
}
