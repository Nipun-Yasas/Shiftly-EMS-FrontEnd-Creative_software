"use client";

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Divider, Typography } from "@mui/material";
import SearchBar from "../../../../_components/header/SearchBar"; 

const columnsUsers = [
  { field: "user", headerName: "User", width: 230 },
  { field: "assignedDate", headerName: "Assigned Date", width: 220 },
  { field: "unassignedDate", headerName: "Unassigned Date", width: 210 },
  { field: "team", headerName: "Team", width: 210 },
  { field: "roster", headerName: "Assigned Roster", width: 210 },
];

const columnsTeams = [
  { field: "projectTeam", headerName: "Project Team", width: 370 },
  { field: "defaultStatus", headerName: "Default Status", width: 352 },
  { field: "status", headerName: "Status", width: 350 },
];

const userRows = [
  { id: 1, user: "Prince Fitzgerald", assignedDate: "01 Jan 2024", unassignedDate: "Present", team: "Dips", roster: "Roster A" },
  { id: 2, user: "Nina Joyce", assignedDate: "01 Jan 2024", unassignedDate: "Present", team: "Dips", roster: "Roster A" },
];

const teamRows = [
  { id: 1, projectTeam: "Dips", defaultStatus: "False", status: "Active" },
  { id: 2, projectTeam: "Thuele", defaultStatus: "False", status: "Active" },
];

export default function MyProjectTeam() {
  const [users, setUsers] = useState(userRows);
  const [teams, setTeams] = useState(teamRows);
  const [userSearch, setUserSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");

  const filteredUsers = users.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  const filteredTeams = teams.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(teamSearch.toLowerCase())
    )
  );

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project Users
        </Typography>
        <Box sx={{ mb: 2 }}>
          <SearchBar
            label="Search Users"
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </Box>
        <DataGrid
          rows={filteredUsers}
          columns={columnsUsers}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
          disableSelectionOnClick
        />
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project Teams
        </Typography>
        <Box sx={{ mb: 2 }}>
          <SearchBar
            label="Search Teams"
            onChange={(e) => setTeamSearch(e.target.value)}
          />
        </Box>
        <DataGrid
          rows={filteredTeams}
          columns={columnsTeams}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
          disableSelectionOnClick
        />
      </Box>
    </Paper>
  );
}