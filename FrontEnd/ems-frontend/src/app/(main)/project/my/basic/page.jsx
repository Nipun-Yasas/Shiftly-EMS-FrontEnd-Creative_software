"use client";

import { useEffect, useState } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../../../_utils/axiosInstance";
import SearchBar from "../../../../_components/header/SearchBar";

export default function MyProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axiosInstance.get("/api/v1/shiftly/ems/projects/my")
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch projects");
        setLoading(false);
      });
  }, []);

  const projectColumns = [
    { field: "projectId", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "teamName", headerName: "Team", flex: 1 },
    { field: "departmentName", headerName: "Department", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 0.5 },
    { field: "endDate", headerName: "End Date", flex: 0.5 },
    { field: "progress", headerName: "Progress (%)", flex: 0.7,headerClassName: "last-column", },
  ];

  const filteredProjects = projects.filter((project) =>
    Object.values(project)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", px: 5, py: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          My Projects
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <SearchBar
            label="Search Projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box style={{ height: 'auto', width: '100%' }}>
          <DataGrid
            rows={filteredProjects}
            columns={projectColumns}
            getRowId={(row) => row.projectId}
            loading={loading}
            rowsPerPageOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 50, 100]}
          />
        </Box>
      </Box>
    </Paper>
  );
}