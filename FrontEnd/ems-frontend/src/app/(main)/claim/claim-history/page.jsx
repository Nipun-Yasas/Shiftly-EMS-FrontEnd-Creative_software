"use client";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

import {
    renderEditStatus,
    renderStatus,
    STATUS_OPTIONS,
  } from './status';

const rows = [
  {
    id: 1,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "Pending"
  },
  {
    id: 2,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "Rejected"
  },
  {
    id: 3,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "Approved"
  },
];

const columns = [
  { field: "col1", headerName: "Claim Id", width: 150 },
  { field: "col2", headerName: "Date Submitted", width: 150 },
  { field: "col3", headerName: "Type", width: 150 },
  { field: "col4", headerName: "Amount", width: 150 },
  { field: "col5", headerName: "Status", width: 150 },
  {
    field: "col6",
    headerName: "Status",
    renderCell: renderStatus,
    renderEditCell: renderEditStatus,
    type: "singleSelect",
    valueOptions: STATUS_OPTIONS,
    width: 150,
    editable: true,
  },
];

export default function ClaimHistory(){
  
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
