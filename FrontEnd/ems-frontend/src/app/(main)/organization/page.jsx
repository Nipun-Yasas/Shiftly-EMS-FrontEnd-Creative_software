"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';
import OrgChart from './_components/OrgChart';
import TeamCard from './_components/TeamCard';
import TeamDialog from './_components/TeamDialog';
import { BASE_URL, API_PATHS } from '../../_utils/apiPaths'; // Adjust path as needed

const departments = [
  "DIPS",
  "WINT",
  "ONEFLOW",
  "BOOKINGNORDICS",
  "LOVOLD SOLUTION",
  "MEDIQ"
];

const TeamContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '20px',
  padding: '20px',
});

export default function Organization() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openTeam, setOpenTeam] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all(
      departments.map(dept =>
        fetch(`${BASE_URL}${API_PATHS.DEPARTMENTS.GET_USERS_BY_DEPARTMENT(dept)}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch ${dept}`);
            return res.json();
          })
          .then(data => ({
            name: dept,
            members: data.length,
            team: data.map(member => ({
              name: member.username,
              role: member.designation
            }))
          }))
          .catch(err => ({
            name: dept,
            members: 0,
            team: [],
            error: err.message
          }))
      )
    ).then(results => {
      setTeams(results);
      setLoading(false);
    }).catch(err => {
      setError('Failed to load teams');
      setLoading(false);
    });
  }, []);

  const handleOpenTeam = (idx) => setOpenTeam(idx);
  const handleCloseTeam = () => setOpenTeam(null);

  return (
    <Paper elevation={2} square={false}
      sx={{
        height: '100%',
        width: '100%',
      }}>
      <OrgChart />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TeamContainer>
          {teams.map((team, index) => (
            <React.Fragment key={index}>
              <TeamCard team={team} onViewMore={() => handleOpenTeam(index)} />
              <TeamDialog open={openTeam === index} onClose={handleCloseTeam} team={team} />
            </React.Fragment>
          ))}
        </TeamContainer>
      )}
    </Paper>
  );
}