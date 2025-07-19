import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";

import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import SearchField from "../../../../_components/main/SearchField";
import dayjs from "dayjs";

import { DataGrid } from "@mui/x-data-grid";

export default function AllTab({
  projects,
  loading,
  searchQuery,
  handleSearchChange,
  onEditProject,
  onDeleteProject,
}) {
  // DataGrid columns
  const columns = [
    {
      field: "projectName",
      headerName: "Project Name",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 270,
    },
    { field: "teamName", headerName: "Team", width: 120 },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "deadline",
      headerName: "Deadline",
      width: 110,
      renderCell: (params) => dayjs(params.value).format("MMM DD, YYYY"),
    },
    {
      field: "progress",
      headerName: "Progress",
      align: "center",
      width: 160,
      renderCell: (params) => {
        const progress = params.value || 0;
        const getProgressColor = (value) => {
          if (value >= 80) return "success";
          if (value >= 50) return "primary";
          if (value >= 25) return "warning";
          return "error";
        };

        return (
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={getProgressColor(progress)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1,width: '100%', justifyContent: 'center'  }}>
          <Tooltip title="Edit Project">
            <IconButton
              size="small"
              onClick={() => onEditProject(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Project">
            <IconButton
              size="small"
              onClick={() => onDeleteProject(params.row)}
              color="error"
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
        <SearchField
          placeholder="Search projects..."
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
        <Box sx={{ height: "auto", width: "100%" }}>
          <DataGrid
            rows={projects}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </Box>
      )}
    </Box>
  );
}
