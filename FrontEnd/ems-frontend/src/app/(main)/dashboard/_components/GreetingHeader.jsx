import { Avatar, Box, Typography } from '@mui/material';

export default function GreetingHeader({ greeting }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src="/profilePic.jpg" alt="Profile" sx={{ width: 60, height: 60, mr: 2 }} />
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'text.primary' }}>
            Hello Simmons 🌞
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>
            {greeting}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 