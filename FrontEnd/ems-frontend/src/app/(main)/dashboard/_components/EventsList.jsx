import { Grid, Card, CardMedia, CardContent, Typography, Box, Avatar, Chip, Button, useTheme } from '@mui/material';

export default function EventsList({ demoEventsState, handleToggleEvent }) {
  const theme = useTheme();
  return (
    <Grid container spacing={3}>
      {demoEventsState.map((event) => (
        <Grid item xs={12} sm={6} md={6} key={event.id}>
          <Card sx={{
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: 8,
            bgcolor: theme => theme.palette.background.paper,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            minHeight: 320,
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-6px) scale(1.01)', boxShadow: 16 }
          }}>
            <CardMedia component="img" height="160" image={event.imageUrl} alt={event.title} sx={{ width: '100%', objectFit: 'cover', boxShadow: 2 }} />
            <CardContent 
              sx={{ 
                p: 3, 
                width: '100%', 
                bgcolor: theme => theme.palette.background.paper,
                transition: 'background 0.3s',
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontFamily: 'var(--font-poppins)', fontWeight: 700, color: 'text.primary' }}>{event.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontFamily: 'var(--font-lexend)', fontWeight: 500 }}><strong>Date:</strong> {event.date}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: 14, mr: 1, color: '#fff' }}>👥</Avatar>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)', fontWeight: 700 }}><strong>{event.participants}</strong> Participants</Typography>
                {event.joined && <Chip label="Joined" size="small" sx={{ ml: 2, fontWeight: 700, fontFamily: 'var(--font-lexend)', bgcolor: 'success.main', color: '#fff' }} />}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button
                  variant={event.joined ? "contained" : "outlined"}
                  size="medium"
                  sx={{
                    bgcolor: event.joined ? 'success.main' : 'primary.main',
                    color: event.joined ? 'success.contrastText' : 'primary.contrastText',
                    borderColor: event.joined ? 'success.main' : 'primary.main',
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 3,
                    py: 0.5,
                    minWidth: 120,
                    maxWidth: 180,
                    width: 'auto',
                    boxShadow: event.joined ? 4 : 2,
                    mt: 1,
                    transition: 'all 0.2s',
                    letterSpacing: 1,
                    '&:hover': {
                      bgcolor: event.joined ? 'success.dark' : 'primary.dark',
                      color: 'white',
                      borderColor: event.joined ? 'success.dark' : 'primary.dark',
                    },
                  }}
                  onClick={() => handleToggleEvent(event.id)}
                  aria-label={event.joined ? "Leave event" : "Join event"}
                >
                  {event.joined ? "Joined" : "Join"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
} 