"use client";

import React, { useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';
import StyledCard from './_components/StyledCard';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import OrgChart from './_components/OrgChart';
import TeamCard from './_components/TeamCard';
import TeamDialog from './_components/TeamDialog';

const teamData = [
  {
    name: "DIPS",
    members: 20,
    team: [
      { name: "Dianne Russell", role: "Lead UI/UX Designer" },
      { name: "Arlene McCoy", role: "Sr. UI/UX Designer" },
      { name: "Cody Fisher", role: "Sr. UI/UX Designer" },
      { name: "Theresa Webb", role: "UI/UX Designer" },
      { name: "Ronald Richards", role: "UI/UX Designer" },
    ],
  },
  {
    name: "WINT",
    members: 14,
    team: [
      { name: "Darrell Steward", role: "Sr. Sales Manager" },
      { name: "Kristin Watson", role: "Sr. Sales Manager" },
      { name: "Courtney Henry", role: "BDM" },
      { name: "Kathryn Murphy", role: "BDM" },
      { name: "Albert Flores", role: "Sales" },
    ],
  },
  {
    name: "ONEFLOW",
    members: 18,
    team: [
      { name: "Leslie Alexander", role: "Sr. Project Manager" },
      { name: "Ronald Richards", role: "Sr. Project Manager" },
      { name: "Savannah Nguyen", role: "Project Manager" },
      { name: "Eleanor Pena", role: "Project Manager" },
      { name: "Esther Howard", role: "Project Manager" },
    ],
  },
  {
    name: "BOOKNORDICS.COM",
    members: 10,
    team: [
      { name: "Wade Warren", role: "Sr. Marketing Manager" },
      { name: "Brooklyn Simmons", role: "Sr. Marketing Manager" },
      { name: "Kristin Watson", role: "Marketing Coordinator" },
      { name: "Jacob Jones", role: "Marketing Coordinator" },
      { name: "Cody Fisher", role: "Marketing" },
    ],
  },
  {
    name: "LOVOLD SOLUTION",
    members: 20,
    team: [
      { name: "Dianne Russell", role: "Lead UI/UX Designer" },
      { name: "Arlene McCoy", role: "Sr. UI/UX Designer" },
      { name: "Cody Fisher", role: "Sr. UI/UX Designer" },
      { name: "Theresa Webb", role: "UI/UX Designer" },
      { name: "Ronald Richards", role: "UI/UX Designer" },
    ],
  },
  {
    name: "MEDIQ",
    members: 10,
    team: [
      { name: "Wade Warren", role: "Sr. Marketing Manager" },
      { name: "Brooklyn Simmons", role: "Sr. Marketing Manager" },
      { name: "Kristin Watson", role: "Marketing Coordinator" },
      { name: "Jacob Jones", role: "Marketing Coordinator" },
      { name: "Cody Fisher", role: "Marketing" },
    ],
  },
];

const OrgChartContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '30px',
  backgroundColor: '#F9FAFB',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
});

const TeamContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '20px',
  padding: '20px',
});

const OrgMember = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '15px',
});

export default function Organization(){
  const [openTeam, setOpenTeam] = React.useState(null); // team index or null

  const handleOpenTeam = (idx) => setOpenTeam(idx);
  const handleCloseTeam = () => setOpenTeam(null);

  return (
    <Paper elevation={2} square={false}
      sx={{
        height: '100%',
        width: '100%',
      }}>

        <OrgChart />
      <TeamContainer>
        {teamData.map((team, index) => (
          <React.Fragment key={index}>
            <TeamCard team={team} onViewMore={() => handleOpenTeam(index)} />
            <TeamDialog open={openTeam === index} onClose={handleCloseTeam} team={team} />
          </React.Fragment>
        ))}
      </TeamContainer>
        
    </Paper>
  );
}
