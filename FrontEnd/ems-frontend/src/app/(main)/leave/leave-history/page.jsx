"use client";

import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, MenuItem, IconButton, Paper, Box } from "@mui/material";
import { FilterList, Settings } from "@mui/icons-material";

const columns = [
  { field: "id", headerName: "Leave Id", flex: 1 },
  {
    field: "leaveType",
    headerName: "Leave Type",
    flex: 2,
    renderCell: (params) => (
      <span>{params.value}</span>
    ),
  },
  { field: "requestedOn", headerName: "Requested On", flex: 2 },
  { field: "leaveFrom", headerName: "Leave From", flex: 2 },
  { field: "leaveTo", headerName: "Leave To", flex: 2 },
  { field: "duration", headerName: "Duration", flex: 1 },
  { field: "reason", headerName: "Reason", flex: 2 },
  { field: "coverPerson", headerName: "Cover Per", flex: 2 },
  {
    field: "status",
    headerName: "Status",
    flex: 2,
    minWidth: 150,
    renderCell: (params) => (
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
  {
    field: "cancel",
    headerName: "Cancel",
    flex: 1,
    renderCell: () => (
      <span style={{ color: "#f44336", cursor: "pointer" }}>Cancel</span> 
    ),
  },
];

const demoRows = [
  {
    id: 34567,
    leaveType: "Medical Leave",
    requestedOn: "04/10/2024",
    leaveFrom: "06/10/2024",
    leaveTo: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    coverPerson: "Julia Steve",
    status: "Approved",
  },
  {
    id: 43467,
    leaveType: "Casual Leave",
    requestedOn: "04/10/2024",
    leaveFrom: "04/10/2024",
    leaveTo: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    coverPerson: "Julia Steve",
    status: "Requested",
  },
  {
    id: 56763,
    leaveType: "Maternity Leave",
    requestedOn: "04/10/2024",
    leaveFrom: "04/10/2024",
    leaveTo: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    coverPerson: "Julia Steve",
    status: "Requested",
  },
  {
    id: 12354,
    leaveType: "Casual Leave",
    requestedOn: "04/10/2024",
    leaveFrom: "06/10/2024",
    leaveTo: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    coverPerson: "Julia Steve",
    status: "Approved",
  },
  {
    id: 45321,
    leaveType: "Casual Leave",
    requestedOn: "04/10/2024",
    leaveFrom: "06/10/2024",
    leaveTo: "08/10/2024",
    duration: "2 days",
    reason: "For personal re",
    coverPerson: "Julia Steve",
    status: "Approved",
  },
];

const attributeMap = {
  "Leave Id": "id",
  "Leave Type": "leaveType",
  "Requested On": "requestedOn",
  "Leave From": "leaveFrom",
  "Leave To": "leaveTo",
  "Cover Person": "coverPerson",
  Status: "status",
};

export default function LeaveHistory() {
  const [searchText, setSearchText] = useState("");
  const [attribute, setAttribute] = useState("Leave To");

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return demoRows;
    const field = attributeMap[attribute];
    return demoRows.filter((row) =>
      row[field]?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, attribute]);

  return (
    <Paper elevation={10} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{  borderRadius: 2, p: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Search"
              placeholder="Leave Id, Leave Type etc..."
              size="small"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ width: 200 }}
            />
            <TextField
              select
              label="Attribute"
              size="small"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
              sx={{ width: 150 }}
            >
              {Object.keys(attributeMap).map((attr) => (
                <MenuItem key={attr} value={attr}>
                  {attr}
                </MenuItem>
              ))}
            </TextField>
            <IconButton>
              <FilterList />
            </IconButton>
          </Box>
          <IconButton>
            <Settings />
          </IconButton>
        </Box>

        <Box sx={{ height: 430, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </Paper>
  );
}
