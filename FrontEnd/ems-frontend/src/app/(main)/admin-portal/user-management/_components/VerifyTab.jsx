"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import UserDataGrid from "./UserDataGrid";

export default function VerifyTab({ loading, users, handleAssignUser }) {
  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 150,
      disableColumnSeparator: true,
    },
    { field: "email", headerName: "Email", width: 250 },
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
     <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "510px" } }}>
          <UserDataGrid loading={loading} rows={users} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
}
