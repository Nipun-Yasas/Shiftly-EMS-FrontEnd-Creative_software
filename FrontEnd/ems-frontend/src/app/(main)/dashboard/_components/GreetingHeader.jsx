import { Box, Typography } from '@mui/material';

// Function to get time-based emoji
const getTimeBasedEmoji = (hour) => {
  if (hour >= 5 && hour < 12) return "🌅"; // Sunrise/Morning
  if (hour >= 12 && hour < 17) return "☀️"; // Sun/Afternoon
  if (hour >= 17 && hour < 20) return "🌆"; // Sunset/Evening
  if (hour >= 20 && hour < 23) return "🌙"; // Moon/Night
  return "🌃"; // Late night
};

export default function GreetingHeader({ greeting }) {
  // Get current hour for dynamic emoji
  const currentHour = new Date().getHours();
  const timeEmoji = getTimeBasedEmoji(currentHour);

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        mb: 2,
        gap: 0.5
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: 'var(--font-poppins)', 
            fontWeight: 600, 
            color: 'text.primary',
            lineHeight: 1.2
          }}
        >
          Hello Simmons {timeEmoji}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            fontFamily: 'var(--font-lexend)',
            fontWeight: 500
          }}
        >
          {greeting}
        </Typography>
      </Box>
    </Box>
  );
} 