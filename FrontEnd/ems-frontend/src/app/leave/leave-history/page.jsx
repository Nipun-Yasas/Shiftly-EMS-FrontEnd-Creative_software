"use client";

import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, MenuItem, IconButton } from "@mui/material";
import { FilterList, Settings } from "@mui/icons-material";

const columns = [
  { field: "id", headerName: "Leave Id", flex: 1 },
  {
    field: "leaveType",
    headerName: "Leave Type",
    flex: 2,
    renderCell: (params) => (
      <span className="text-blue-600 underline cursor-pointer">
        {params.value}
      </span>
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
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          params.value === "Approved"
            ? "text-green-600 border border-green-400 bg-green-100"
            : "text-orange-600 border border-orange-400 bg-orange-100"
        }`}
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
      <span className="text-red-600 cursor-pointer">Cancel</span>
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

export default function LeaveHistory(){
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
    <div className="p-6 space-y-6">
     
      <div>
        <h1 className="text-2xl font-bold text-pink-600">Leave History</h1>
        <div className="text-gray-400 text-sm mt-1">Leave &gt; Leave History</div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        

       
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex gap-4 flex-wrap">
            <TextField
              label="Search"
              placeholder="Leave Id, Leave Type etc..."
              size="small"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64 bg-white"
            />
            <TextField
              select
              label="Attribute"
              size="small"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
              className="w-48 bg-white"
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
          </div>
          <IconButton size="small" className="mt-2 sm:mt-0">
            <Settings />
          </IconButton>
        </div>

        
        <div style={{ height: 430, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                fontSize: "0.875rem",
                overflow: "visible",
                textOverflow: "initial",
                whiteSpace: "normal",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
