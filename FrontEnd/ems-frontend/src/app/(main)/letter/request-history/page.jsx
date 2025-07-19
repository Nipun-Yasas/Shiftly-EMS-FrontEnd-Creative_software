"use client";

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

const columns = [
  { field: "id", headerName: "REQUEST ID", flex:1},
  { field: "name", headerName: "REQUEST BY", flex:1 },
  { field: "date", headerName: "REQUEST ON", flex:1 },
  { field: "type", headerName: "LETTER TYPE", flex:1 }
];



const RequestHistory = () => {
  const [requests, setRequest] = useState([]);
  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", p: 5 }}>
        <DataGrid
          rows={requests}
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
  );
};

export default RequestHistory;