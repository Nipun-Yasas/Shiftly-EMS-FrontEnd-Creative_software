import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { 
  Event, 
  People, 
  CalendarToday, 
  Add,
  TrendingUp,
  EmojiEvents
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EventsCard({ events, onViewAll }) {
  const theme = useTheme();
  const router = useRouter();
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get event type color
  const getEventTypeColor = (category) => {
    const colors = {
      'Gaming': 'primary.main',
      'Sports': 'success.main',
      'Meeting': 'info.main',
      'Training': 'warning.main',
      'Social': 'secondary.main',
      'default': 'grey.500'
    };
    return colors[category] || colors.default;
  };

  // Get event type icon
  const getEventTypeIcon = (category) => {
    const icons = {
      'Gaming': <EmojiEvents fontSize="small" />,
      'Sports': <TrendingUp fontSize="small" />,
      'Meeting': <Event fontSize="small" />,
      'Training': <Event fontSize="small" />,
      'Social': <People fontSize="small" />,
      'default': <Event fontSize="small" />
    };
    return icons[category] || icons.default;
  };

  if (!mounted) {
    return (
      <Paper elevation={4} sx={{
        p: 0,
        borderRadius: 3,
        height: '100%',
        minHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'background.paper',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Event sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 700 }}>
            Loading Events...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={4} sx={{
      p: 0,
      borderRadius: 3,
      height: '100%',
      minHeight: 480,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
          : '0 12px 40px rgba(0, 0, 0, 0.1)',
      },
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
        : 'background.paper',
    }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        pb: 2,
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(25, 118, 210, 0.2)' 
              : 'rgba(25, 118, 210, 0.1)',
            color: 'primary.main'
          }}>
            <Event sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontFamily: 'var(--font-poppins)', 
              fontWeight: 700, 
              color: 'text.primary',
              mb: 0.5
            }}>
              Upcoming Events
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'text.secondary', 
              fontFamily: 'var(--font-lexend)',
              fontWeight: 500
            }}>
              {events.length} events available
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Add New Event">
          <IconButton 
            onClick={() => router.push('/events/submit')}
            sx={{
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.1)' 
                : 'rgba(0,0,0,0.05)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'rgba(0,0,0,0.1)',
              }
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Events Content */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        pt: 2,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {events.slice(0, 3).map((event) => (
          <Card
            key={event.id}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(0,0,0,0.02)',
              border: `1px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.1)' 
                : 'rgba(0,0,0,0.1)'}`,
              transition: 'all 0.2s ease',
              transform: hoveredEvent === event.id ? 'scale(1.02)' : 'scale(1)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.08)' 
                  : 'rgba(0,0,0,0.04)',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'rgba(0,0,0,0.2)',
              }
            }}
            onMouseEnter={() => setHoveredEvent(event.id)}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            <Box sx={{ display: 'flex', height: 120 }}>
              {/* Event Image */}
              <CardMedia 
                component="img" 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  objectFit: 'cover',
                  flexShrink: 0
                }} 
                image={event.imageUrl} 
                alt={event.title} 
              />
              
              {/* Event Details */}
              <CardContent sx={{ 
                p: 2, 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontFamily: 'var(--font-poppins)', 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontSize: '1rem',
                    mb: 1,
                    lineHeight: 1.3
                  }}>
                    {event.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ 
                      color: 'text.secondary', 
                      fontFamily: 'var(--font-lexend)',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}>
                      {event.date}
                    </Typography>
                  </Box>
                  
                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                     <Typography variant="body2" sx={{ 
                       color: 'text.secondary', 
                       fontFamily: 'var(--font-lexend)',
                       fontWeight: 500,
                       fontSize: '0.875rem'
                     }}>
                       {event.participants} Participants
                     </Typography>
                   </Box>
                 </Box>
              </CardContent>
            </Box>
          </Card>
        ))}
        
        {/* View All Button */}
        {events.length > 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => router.push('/events/history')}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 3,
                py: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              View All Events ({events.length})
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
} 