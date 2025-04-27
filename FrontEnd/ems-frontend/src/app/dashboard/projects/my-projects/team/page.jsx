'use client';
import * as React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, IconButton, TextField, MenuItem,
  Box, Typography, Divider
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const columnsUsers = [
  { id: 'user', label: 'User', minWidth: 150 },
  { id: 'assignedDate', label: 'Assigned Date', minWidth: 100 },
  { id: 'unassignedDate', label: 'Unassigned Date', minWidth: 100 },
  { id: 'team', label: 'Team', minWidth: 100 },
  { id: 'roster', label: 'Assigned Roster', minWidth: 150 },
];

const userRows = [
  { user: 'Prince Fitzgerald', assignedDate: '01 Jan 2024', unassignedDate: 'Present', team: 'Dips', roster: 'Roster A' },
  { user: 'Nina Joyce', assignedDate: '01 Jan 2024', unassignedDate: 'Present', team: 'Dips', roster: 'Roster A' },
  { user: 'Lloyd Jefferson', assignedDate: '01 Jan 2024', unassignedDate: 'Present', team: 'FLUID', roster: 'Roster A' },
  { user: 'Ciara Moyo', assignedDate: '01 Jan 2024', unassignedDate: 'Present', team: 'Synergy', roster: 'Roster A' },
  { user: 'Thandilwa James', assignedDate: '01 Jan 2024', unassignedDate: 'Present', team: 'Dips', roster: 'Roster A' },
];

const columnsTeams = [
  { id: 'projectTeam', label: 'Project Team', minWidth: 150 },
  { id: 'defaultStatus', label: 'Default Status', minWidth: 120 },
  { id: 'status', label: 'Status', minWidth: 100 },
];

const teamRows = [
  { projectTeam: 'Dips', defaultStatus: 'False', status: 'Active' },
  { projectTeam: 'Thuele', defaultStatus: 'False', status: 'Active' },
  { projectTeam: 'FLUID', defaultStatus: 'False', status: 'Active' },
  { projectTeam: 'VYNOTS', defaultStatus: 'False', status: 'Active' },
  { projectTeam: 'ORBIS', defaultStatus: 'False', status: 'Active' },
];

function ProjectTableSection({ title, columns, rows, searchLabel }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchText, setSearchText] = React.useState('');
  const [searchAttribute, setSearchAttribute] = React.useState('None');

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchTextChange = (event) => setSearchText(event.target.value);
  const handleSearchAttributeChange = (event) => setSearchAttribute(event.target.value);

  const filteredRows = rows.filter((row) => {
    if (!searchText.trim()) return true;
    if (searchAttribute === 'None') {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return String(row[searchAttribute])
      .toLowerCase()
      .includes(searchText.toLowerCase());
  });

  return (
    <Box className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="font-semibold text-gray-800">
          {title}
        </Typography>
        <Box className="flex gap-2">
          <TextField
            size="small"
            label={searchLabel}
            variant="outlined"
            value={searchText}
            onChange={handleSearchTextChange}
          />
          <TextField
            size="small"
            select
            label="Attribute"
            value={searchAttribute}
            onChange={handleSearchAttributeChange}
          >
            <MenuItem value="None">None</MenuItem>
            {columns.map(col => (
              <MenuItem key={col.id} value={col.id}>{col.label}</MenuItem>
            ))}
          </TextField>
          <IconButton><FilterListIcon /></IconButton>
          <IconButton><SettingsIcon /></IconButton>
        </Box>
      </Box>
      <Divider className="mb-4" />
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
        <TableContainer sx={{ maxHeight: 300 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                <TableRow hover tabIndex={-1} key={idx}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default function MyProjectTeam(){
  const pathname = usePathname();

  return (
    <Box className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-[#E90A4D] mb-2">My Project</h1>
      <p className="text-sm text-gray-500 mb-4">project / my project</p>

      <Box className="bg-white rounded-2xl shadow-md p-6">
        <Box className="flex items-center gap-150 mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/dips_logo.png"
              alt="DIPS Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <div className="flex gap-6 border-b border-gray-200">
            {[{ name: "BASIC INFO", href: "/projects/my-projects/basic-info" },
              { name: "TEAM", href: "/projects/my-projects/team" }]
              .map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`pb-2 text-sm font-medium ${isActive ? "border-b-2 border-[#E90A4D] text-[#E90A4D]" : "text-gray-600 hover:text-[#E90A4D]"}`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
          </div>
        </Box>

        <ProjectTableSection
          title="Project Users"
          columns={columnsUsers}
          rows={userRows}
          searchLabel="User, Team, etc..."
        />
        <ProjectTableSection
          title="Project Teams"
          columns={columnsTeams}
          rows={teamRows}
          searchLabel="Project Team, Status, etc..."
        />
      </Box>
    </Box>
  );
}
