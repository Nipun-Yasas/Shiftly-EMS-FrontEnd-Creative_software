"use client";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState, useContext } from "react";
import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";

import {
    renderStatus,
  } from './status';
import dayjs from "dayjs";
import { UserContext } from '../../../context/UserContext';
import DeleteDialog from './DeleteDialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';

export default function ClaimHistory(){
  const [rows, setRows] = useState([]);
  const { user } = useContext(UserContext);
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
    { field: "col3", headerName: "Type", width: 160 },
    { field: "col4", headerName: "Description", width: 250 },
    { field: "claimDate", headerName: "Claim Date", width: 180 },
    { field: "col5", headerName: "Status", width: 150, renderCell: renderStatus },
    {
      field: "claimFile",
      headerName: "Claim File",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <Button
            component="a"
            href={`http://localhost:8080${params.value}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            variant="outlined"
            size="small"
            sx={{ 
              fontSize: '0.75rem',
              minWidth: 'auto',
              px: 1,
              py: 0.5
            }}
            startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
          >
            Download
          </Button>
        ) : (
          "No file"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
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
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </Box>
      </Paper>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        claim={selectedClaim}
        onDelete={handleDeleteClaim}
      />
    </>
  );
}
