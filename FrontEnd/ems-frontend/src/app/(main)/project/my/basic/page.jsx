"use client";

import { useState } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchBar from "../../../../_components/header/SearchBar";

export default function MyProject() {
  const project = {
    logo: "/images/dips_logo.png",
    name: "ABC Corp",
    description:
      "DIPS AS is Norway’s leading provider of E-healthcare solutions for hospitals. The success of an initial collaboration to develop the first mobile applications led to DIPS establishing additional teams to work on other areas of their product.",
    start_date: "Jan 2017",
    end_date: "Dec 2026",
  };

  const userRows = [
    { id: 1, first_name: "Alice", last_name: "Johnson", designation: "Frontend Developer" },
    { id: 2, first_name: "Bob", last_name: "Smith", designation: "Backend Developer" },
    { id: 3, first_name: "Carol", last_name: "Williams", designation: "QA Engineer" },
  ];

  const userColumns = [
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
  ];

  // Search state and filtering
  const [userSearch, setUserSearch] = useState("");
  const filteredUsers = userRows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", px: 5, py: 1 }}>
        <Box sx={{ mb: 0 }}>
          <img
            src={project.logo}
            alt="Project Logo"
            style={{ width: 120, height: 120, objectFit: "contain" }}
          />
        </Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project Details
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 5 }}>
          <Typography variant="body1">
            <strong>Name:</strong> {project.name}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {project.description}
          </Typography>
          <Typography variant="body1">
            <strong>Start Date:</strong> {project.start_date}
          </Typography>
          <Typography variant="body1">
            <strong>Estimated End Date:</strong> {project.end_date}
          </Typography>
        </Box>
        
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project Users
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <SearchBar
            label="Search Users"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </Box>
        <Box sx={{ height: 320, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={userColumns}
            pageSizeOptions={[5, 10, 20]}
            autoHeight
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </Paper>
  );
}