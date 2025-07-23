import { Paper, Box, Typography, Button, Chip, LinearProgress, useTheme } from '@mui/material';
import { Star } from '@mui/icons-material';
import StarDetailsDialog from './StarDetailsDialog';
import { useState, useEffect } from 'react';

export default function StarPointsCard({ starPoints, starDialogOpen, setStarDialogOpen }) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        background: theme => theme.palette.background.paper,
      }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Star sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 700 }}>
            Loading Star Points...
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
        boxShadow: 4,
      },
      background: theme => theme.palette.background.paper,
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
              ? 'rgba(255, 193, 7, 0.2)' 
              : 'rgba(255, 193, 7, 0.1)',
            color: 'warning.main'
          }}>
            <Star sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontFamily: 'var(--font-poppins)', 
              fontWeight: 700, 
              color: 'text.primary',
              mb: 0.5
            }}>
              Star Points
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'text.secondary', 
              fontFamily: 'var(--font-lexend)',
              fontWeight: 500
            }}>
              {starPoints > 0 ? `${starPoints} stars earned` : 'No stars yet'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        pt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
    }}>
      <Box sx={{ mb: 2, position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Star sx={{ fontSize: 64, color: 'warning.main', filter: 'drop-shadow(0 0 16px #FFD60088)', animation: 'starGlow 1.5s infinite alternate' }} />
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, display: starPoints >= 10 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}>
          <Chip label="Platinum" color="primary" size="small" sx={{ fontWeight: 700, fontFamily: 'var(--font-lexend)', bgcolor: '#e5e4e2', color: '#222', borderRadius: 2, boxShadow: 2 }} />
        </Box>
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, display: starPoints >= 5 && starPoints < 10 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}>
          <Chip label="Gold" color="warning" size="small" sx={{ fontWeight: 700, fontFamily: 'var(--font-lexend)', bgcolor: '#FFD600', color: '#222', borderRadius: 2, boxShadow: 2 }} />
        </Box>
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, display: starPoints >= 3 && starPoints < 5 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}>
          <Chip label="Silver" color="info" size="small" sx={{ fontWeight: 700, fontFamily: 'var(--font-lexend)', bgcolor: '#b0c4de', color: '#222', borderRadius: 2, boxShadow: 2 }} />
        </Box>
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, display: starPoints >= 1 && starPoints < 3 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}>
          <Chip label="Bronze" color="secondary" size="small" sx={{ fontWeight: 700, fontFamily: 'var(--font-lexend)', bgcolor: '#cd7f32', color: '#fff', borderRadius: 2, boxShadow: 2 }} />
        </Box>
        <style>{`
          @keyframes starGlow {
            0% { filter: drop-shadow(0 0 8px #FFD60044); }
            100% { filter: drop-shadow(0 0 24px #FFD600cc); }
          }
        `}</style>
      </Box>
        
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 900, color: 'warning.main', fontFamily: 'var(--font-poppins)', textShadow: '0 2px 12px #FFD60044' }}>
        {starPoints > 0 ? `${starPoints}` : 'No stars yet'}
      </Typography>
        
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontFamily: 'var(--font-lexend)', fontWeight: 500, textAlign: 'center' }}>
        Stars are awarded by admins for outstanding performance.<br />Earn more stars to unlock special rewards!
      </Typography>
        
      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={Math.min(starPoints, 10) * 10}
          sx={{
            height: 10,
            borderRadius: 5,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'warning.main',
              transition: 'width 0.5s',
            },
          }}
        />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)', mt: 0.5, display: 'block', textAlign: 'center' }}>
          {starPoints < 1 && 'Earn your first star!'}
          {starPoints >= 1 && starPoints < 3 && 'Bronze tier'}
          {starPoints >= 3 && starPoints < 5 && 'Silver tier'}
          {starPoints >= 5 && starPoints < 10 && 'Gold tier'}
          {starPoints >= 10 && 'Platinum tier'}
        </Typography>
      </Box>
        
      <Button variant="outlined" sx={{
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
      }} onClick={() => setStarDialogOpen(true)}>
        Learn More
      </Button>
      </Box>
      <StarDetailsDialog open={starDialogOpen} onClose={() => setStarDialogOpen(false)} />
    </Paper>
  );
} 