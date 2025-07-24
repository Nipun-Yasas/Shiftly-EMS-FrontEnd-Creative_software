"use client";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState, useContext } from "react";
import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";

import {
    renderEditStatus,
    renderStatus,
    STATUS_OPTIONS,
  } from './status';
import dayjs from "dayjs";
import { UserContext } from '../../../context/UserContext';
import EditDialog from './EditDialog';
import DeleteDialog from './DeleteDialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

export default function ClaimHistory(){
  const [rows, setRows] = useState([]);
  const { user } = useContext(UserContext);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchClaims = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CLAIMS.GET_CLAIMS_BY_USER_ID(user.id));
        // Map backend claims to DataGrid row format
        const mappedRows = response.data.map((claim) => ({
          id: claim.id,
          col1: claim.id,
          col3: claim.claimType,
          col4: claim.description,
          claimDate: claim.claimDate ? dayjs(claim.claimDate).format("MMM DD, YYYY") : "-", // Use claimDate from backend
          col5: claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1).toLowerCase() : "Pending", // Normalize status format
          claimFile: claim.claimUrl,
          raw: claim,
        }));
        setRows(mappedRows);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      }
    };
    fetchClaims();
  }, [user?.id]);

  const handleEdit = (claim) => {
    setSelectedClaim(claim.raw);
    setEditDialogOpen(true);
  };

  const handleDelete = (claim) => {
    setSelectedClaim(claim.raw);
    setDeleteDialogOpen(true);
  };

  const handleUpdateClaim = (updatedClaim) => {
    setRows((prev) => prev.map(row => row.id === updatedClaim.id ? { ...row, ...updatedClaim, raw: updatedClaim } : row));
  };

  const handleDeleteClaim = (deletedClaim) => {
    setRows((prev) => prev.filter(row => row.id !== deletedClaim.id));
  };

  const columns = [
    { field: "col1", headerName: "Claim Id", width: 150 },
    { field: "col3", headerName: "Type", width: 150 },
    { field: "col4", headerName: "Description", width: 200 },
    { field: "claimDate", headerName: "Claim Date", width: 180 },
    { field: "col5", headerName: "Status", width: 150, renderCell: renderStatus },
    {
      field: "claimFile",
      headerName: "Claim File",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <a href={`http://localhost:8080${params.value}`} target="_blank" rel="noopener noreferrer">Download</a>
        ) : (
          "No file"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color: "primary.main" }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDelete(params.row)} sx={{ color: "error.main" }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Paper elevation={3}
      sx={{
        height: '100%',
        width: '100%',
      }}
      >
      <Box sx={{ width: "100%", p: 5 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          height="auto"
          pageSize={10}
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
      </Paper>
      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        claim={selectedClaim}
        onUpdate={handleUpdateClaim}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        claim={selectedClaim}
        onDelete={handleDeleteClaim}
      />
    </>
  );
}
