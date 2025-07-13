"use client";
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const teamData = [
  {
    name: 'DIPS',
    members: 20,
    team: [
      { name: 'Dianne Russell', role: 'Lead UI/UX Designer' },
      { name: 'Arlene McCoy', role: 'Sr. UI/UX Designer' },
      { name: 'Cody Fisher', role: 'Sr. UI/UX Designer' },
      { name: 'Theresa Webb', role: 'UI/UX Designer' },
      { name: 'Ronald Richards', role: 'UI/UX Designer' },
    ],
  },
  {
    name: 'WINT',
    members: 14,
    team: [
      { name: 'Darrell Steward', role: 'Sr. Sales Manager' },
      { name: 'Kristin Watson', role: 'Sr. Sales Manager' },
      { name: 'Courtney Henry', role: 'BDM' },
      { name: 'Kathryn Murphy', role: 'BDM' },
      { name: 'Albert Flores', role: 'Sales' },
    ],
  },
  {
    name: 'ONEFLOW',
    members: 18,
    team: [
      { name: 'Leslie Alexander', role: 'Sr. Project Manager' },
      { name: 'Ronald Richards', role: 'Sr. Project Manager' },
      { name: 'Savannah Nguyen', role: 'Project Manager' },
      { name: 'Eleanor Pena', role: 'Project Manager' },
      { name: 'Esther Howard', role: 'Project Manager' },
    ],
  },
  {
    name: 'BOOKNORDICS.COM',
    members: 10,
    team: [
      { name: 'Wade Warren', role: 'Sr. Marketing Manager' },
      { name: 'Brooklyn Simmons', role: 'Sr. Marketing Manager' },
      { name: 'Kristin Watson', role: 'Marketing Coordinator' },
      { name: 'Jacob Jones', role: 'Marketing Coordinator' },
      { name: 'Cody Fisher', role: 'Marketing' },
    ],
  },
  {
    name: 'LOVOLD SOLUTION',
    members: 20,
    team: [
      { name: 'Dianne Russell', role: 'Lead UI/UX Designer' },
      { name: 'Arlene McCoy', role: 'Sr. UI/UX Designer' },
      { name: 'Cody Fisher', role: 'Sr. UI/UX Designer' },
      { name: 'Theresa Webb', role: 'UI/UX Designer' },
      { name: 'Ronald Richards', role: 'UI/UX Designer' },
    ],
  },
  {
    name: 'MEDIQ',
    members: 10,
    team: [
      { name: 'Wade Warren', role: 'Sr. Marketing Manager' },
      { name: 'Brooklyn Simmons', role: 'Sr. Marketing Manager' },
      { name: 'Kristin Watson', role: 'Marketing Coordinator' },
      { name: 'Jacob Jones', role: 'Marketing Coordinator' },
      { name: 'Cody Fisher', role: 'Marketing' },
    ],
  },
];

export default function DepartmentPage() {
  const params = useParams();
  const department = params?.department;
  // Find the team by department name (case-insensitive)
  const team = useMemo(() => teamData.find(t => t.name.toLowerCase().replace(/\./g, '') === department), [department]);

  if (!team) {
    return <Box sx={{ p: 4 }}><Typography variant="h5">Department not found</Typography></Box>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>{team.name} Department</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>{team.members} Members</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {team.team.map((member, idx) => (
              <TableRow key={idx}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 