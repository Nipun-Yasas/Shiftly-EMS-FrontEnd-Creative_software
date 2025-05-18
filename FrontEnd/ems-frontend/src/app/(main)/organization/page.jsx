"use client";

import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';
import StyledCard from './_components/StyledCard';
import Paper from '@mui/material/Paper';

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

const OrgChart = () => (
  <Box>
    <OrgMember>
      <Avatar sx={{ width: 90, height: 90, marginBottom: 1, border: '3px solid #FF2D55' }} />
      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '1.25rem', color: 'avatarname.main' }}>
        Sushena Ranatunga
      </Typography>
      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '0.875rem' , color: '#6B7280'  }}>
        CEO
      </Typography>
    </OrgMember>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
      <OrgMember>
        <Avatar sx={{ width: 70, height: 70, marginBottom: 1 , border: '3px solid #FF2D55' }} />
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '1rem', color: 'avatarname.main' }}>
          Channa De Silva
        </Typography>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280' }}>
          Software Engineering Director
        </Typography>
      </OrgMember>
      <OrgMember>
        <Avatar sx={{ width: 70, height: 70, marginBottom: 1 , border: '3px solid #FF2D55'}} />
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '1rem', color: 'avatarname.main' }}>
          Damitha Liyanage
        </Typography>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280' }}>
          Software Engineering Director
        </Typography>
      </OrgMember>
      <OrgMember>
        <Avatar sx={{ width: 70, height: 70, marginBottom: 1 , border: '3px solid #FF2D55' }} />
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '1rem', color: 'avatarname.main' }}>
          Asma Cader
        </Typography>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280' }}>
          Director Marketing
        </Typography>
      </OrgMember>
      <OrgMember>
        <Avatar sx={{ width: 70, height: 70, marginBottom: 1 , border: '3px solid #FF2D55'}} />
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '1rem', color: 'avatarname.main' }}>
          Dinithi Abeygunawardena
        </Typography>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280' }}>
          Head of Human Resources
        </Typography>
      </OrgMember>
    </Box>
  </Box>
);

const TeamCard = ({ team }) => (
  <StyledCard>
    <CardContent>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '1.125rem',
          color: 'avatarname.main',
          marginBottom: '8px',
        }}
      >
        {team.name}
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '0.875rem',
          color: 'avatarname.main',
          marginBottom: '12px',
        }}
      >
        {team.members} MEMBERS
      </Typography>
      {team.team.slice(0, 5).map((member, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <Avatar sx={{ width: 40, height: 40, marginRight: 2, border: '1px solid #E5E7EB' }} />
          <Box>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '0.9375rem',
                color: 'avatarname.main',
              }}
            >
              {member.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '0.8125rem',
                color: '#6B7280',
              }}
            >
              {member.role}
            </Typography>
          </Box>
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Link href={`/organization/${team.name.toLowerCase().replace(/\./g, '')}`} passHref>
          <Button
            variant="outlined"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#FF2D55',
              borderColor: '#FF2D55',
              borderRadius: '8px',
              textTransform: 'none',
              padding: '4px 16px',
              '&:hover': {
                backgroundColor: 'viewButton.main',
                borderColor: '#FECDD3',
              },
            }}
          >
            View More
          </Button>
        </Link>
      </Box>
    </CardContent>
  </StyledCard>
);

export default function Organization(){
  return (
    <Paper elevation={2} square={false}
      sx={{
        height: '100%',
        width: '100%',
      }}>

        <OrgChart />
      <TeamContainer>
        {teamData.map((team, index) => (
          <TeamCard key={index} team={team} />
        ))}
      </TeamContainer>
        
    </Paper>
  );
}
