"use client";

import { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

const columns = [
  { field: "id", headerName: "Event ID", width: 100 },
  { field: "title", headerName: "Title", width: 150 },
  { field: "audience", headerName: "Audience", width: 150 },
  { field: "eventType", headerName: "Event Type", width: 150 },
  { field: "projects", headerName: "Projects", width: 150 },
  { field: "enableDate", headerName: "Enabled Date", width: 150 },
  { field: "expireDate", headerName: "Expire Date", width: 150 },
  { field: "formUrl", headerName: "Form Url", width: 150 },
  { field: "responseUrl", headerName: "Response Url", width: 150 },
];

export default function Event() {
  const [events, setEvents] = useState([]);

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
          rows={events}
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
}
