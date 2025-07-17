import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import SearchField from "../../_components/SearchField";

import { DataGrid } from "@mui/x-data-grid";

// Helper function to calculate project progress
const calculateProgress = (project) => {
  if (project.status?.name === "Completed") return 100;
  if (project.status?.name === "Cancelled") return 0;
  if (project.status?.name === "Planning") return 10;
  if (project.status?.name === "On Hold") return 25;

  // For "In Progress", calculate based on time elapsed
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const now = new Date();

  if (now < start) return 10;
  if (now > end) return 95;

  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const elapsedDays = (now - start) / (1000 * 60 * 60 * 24);
  return Math.min(Math.max((elapsedDays / totalDays) * 100, 10), 95);
};

export default function AllProjectTab({
  projects,
  loading,
  searchQuery,
  handleSearchChange,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) {
  // DataGrid columns
  const columns = [
    { field: "projectName", headerName: "Project Name", width: 180 },
    { field: "client", headerName: "Client", width: 150 },
    { field: "projectManager", headerName: "Project Manager", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value?.name || params.value}
          color={params.value?.color || "default"}
          size="small"
        />
      ),
    },
    { field: "teamSize", headerName: "Team Size", width: 100 },
    {
      field: "progress",
      headerName: "Progress",
      width: 140,
      renderCell: (params) => {
        const progress = calculateProgress(params.row);
        return (
          <Box sx={{ width: "100%", mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEditProject(params.row)}
              sx={{ color: "primary.main" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDeleteProject(params.row)}
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
        <Typography variant="h6">All Projects</Typography>
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
            onClick={onAddProject}
          >
            Add Project
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={projects}
            columns={columns}
            pageSize={5}
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
