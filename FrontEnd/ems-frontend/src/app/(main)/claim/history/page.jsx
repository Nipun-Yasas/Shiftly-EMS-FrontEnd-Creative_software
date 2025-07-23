"use client";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";

import {
    renderEditStatus,
    renderStatus,
    STATUS_OPTIONS,
  } from './status';
import dayjs from "dayjs";

export default function ClaimHistory(){
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const userId = 2; // Replace with dynamic user ID as needed
        const response = await axiosInstance.get(API_PATHS.CLAIMS.GET_CLAIMS_BY_USER_ID(userId));
        // Map backend claims to DataGrid row format
        const mappedRows = response.data.map((claim) => ({
          id: claim.id,
          col1: claim.id,
          col3: claim.claimType,
          col4: claim.description,
          claimDate: claim.claimDate ? dayjs(claim.claimDate).format("MMM DD, YYYY") : "-", // Use claimDate from backend
          col5: claim.status,
          claimFile: claim.claimUrl,
        }));
        setRows(mappedRows);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      }
    };
    fetchClaims();
  }, []);

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
    </>
  );
}
