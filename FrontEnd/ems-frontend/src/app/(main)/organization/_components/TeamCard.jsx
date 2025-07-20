import React from 'react';
import { Avatar, Box, Button, CardContent, Typography } from '@mui/material';
import StyledCard from './StyledCard';

const TeamCard = ({ team, onViewMore }) => (
  <StyledCard
    sx={{
      border: '1.5px solid #E90A4D',
    }}
  >
    <CardContent>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '1.125rem',
          color: '#E90A4D',
          paddingLeft: '20px',
        }}
      >
        {team.name}
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '0.875rem',
          color: 'text.primary',
          marginBottom: '12px',
          paddingLeft: '20px',
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
          onClick={onViewMore}
        >
          View More
        </Button>
      </Box>
    </CardContent>
  </StyledCard>
);

export default TeamCard; 