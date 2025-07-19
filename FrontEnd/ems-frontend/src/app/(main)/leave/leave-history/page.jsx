'use client';

import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box } from "@mui/material";

const columns = [
  { field: "id", headerName: "Leave Id", width: 100 },
  { field: "leave_type", headerName: "Leave Type", width: 150, renderCell: (params) => (<span>{params.value}</span>), },
  { field: "leave_from", headerName: "Leave From", width: 150 },
  { field: "leave_to", headerName: "Leave To", width: 150 },
  { field: "duration", headerName: "Duration", width: 100 },
  { field: "reason", headerName: "Reason", width: 150 },
  { field: "cover_person", headerName: "Cover Person", width: 150 },
  { field: "leave_status", headerName: "Status", width: 150, renderCell: (params) => (
      <span
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.875rem",
          fontWeight: 500,
          textAlign: "center",
          backgroundColor: params.value === "Approved" ? "#dcedc8" : "#fff3e0",
          color: params.value === "Approved" ? "#388e3c" : "#f57c00",
        }}
      >
        {params.value}
      </span>
    ),
  },
  { field: "cancel", headerName: "Cancel", width: 100, renderCell: () => (<span style={{ color: "#f44336", cursor: "pointer" }}>Cancel</span>), },
];

const demoRows = [
  {
    id: 34567,
    leave_type: "Medical Leave",
    leave_from: "06/10/2024",
    leave_to: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    cover_person: "Julia Steve",
    leave_status: "Approved",
  },
  {
    id: 43467,
    leave_type: "Casual Leave",
    leave_from: "04/10/2024",
    leave_to: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    cover_person: "Julia Steve",
    leave_status: "Requested",
  },
  {
    id: 56763,
    leave_type: "Maternity Leave",
    leave_from: "04/10/2024",
    leave_to: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    cover_person: "Julia Steve",
    leave_status: "Requested",
  },
  {
    id: 12354,
    leave_type: "Casual Leave",
    leave_from: "06/10/2024",
    leave_to: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    cover_person: "Julia Steve",
    leave_status: "Approved",
  },
  {
    id: 45321,
    leave_type: "Casual Leave",
    leave_from: "06/10/2024",
    leave_to: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    cover_person: "Julia Steve",
    leave_status: "Approved",
  },
];

export default function LeaveHistory() {
  const [searchText, setSearchText] = useState("");
  const [attribute, setAttribute] = useState("Leave To");

  const attributeMap = {
    "Leave Id": "id",
    "Leave Type": "leave_type",
    "Leave From": "leave_from",
    "Leave To": "leave_to",
    "Cover Person": "cover_person",
    Status: "leave_status",
  };

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return demoRows;
    const field = attributeMap[attribute];
    return demoRows.filter((row) =>
      row[field]?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, attribute]);

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
          rows={filteredRows}
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