import { Paper, Box, Typography, Button, Chip, LinearProgress } from '@mui/material';
import { Star } from '@mui/icons-material';
import StarDetailsDialog from './StarDetailsDialog';

export default function StarPointsCard({ starPoints, starDialogOpen, setStarDialogOpen }) {
  return (
    <Paper elevation={8} sx={{
      p: 4,
      borderRadius: 4,
      height: 'fit-content',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      background: theme => theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
        : 'rgba(255,255,255,0.85)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      backdropFilter: 'blur(10px)',
      border: '1px solid',
      borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(200,200,255,0.18)'
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
      <Typography variant="h6" sx={{ mb: 1, fontFamily: 'var(--font-poppins)', fontWeight: 700, color: theme => theme.palette.mode === 'dark' ? '#fff' : 'text.primary' }}>Star Points</Typography>
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 900, color: 'warning.main', fontFamily: 'var(--font-poppins)', textShadow: '0 2px 12px #FFD60044' }}>
        {starPoints > 0 ? `${starPoints}` : 'No stars yet'}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: theme => theme.palette.mode === 'dark' ? '#fff' : 'text.secondary', fontFamily: 'var(--font-lexend)', fontWeight: 500 }}>
        Stars are awarded by admins for outstanding performance.<br />Earn more stars to unlock special rewards!
      </Typography>
      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={Math.min(starPoints, 10) * 10}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: theme => theme.palette.mode === 'dark' ? '#23263a' : 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'warning.main',
              transition: 'width 0.5s',
            },
          }}
        />
        <Typography variant="caption" sx={{ color: theme => theme.palette.mode === 'dark' ? '#fff' : 'text.secondary', fontFamily: 'var(--font-lexend)', mt: 0.5, display: 'block' }}>
          {starPoints < 1 && 'Earn your first star!'}
          {starPoints >= 1 && starPoints < 3 && 'Bronze tier'}
          {starPoints >= 3 && starPoints < 5 && 'Silver tier'}
          {starPoints >= 5 && starPoints < 10 && 'Gold tier'}
          {starPoints >= 10 && 'Platinum tier'}
        </Typography>
      </Box>
      <Button variant="outlined" sx={{
        borderColor: theme => theme.palette.mode === 'dark' ? '#FFD600' : 'primary.main',
        color: theme => theme.palette.mode === 'dark' ? '#FFD600' : 'primary.main',
        fontWeight: 700,
        px: 4,
        py: 1.2,
        borderRadius: 2,
        fontFamily: 'var(--font-lexend)',
        '&:hover': {
          borderColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'primary.dark',
          color: theme => theme.palette.mode === 'dark' ? '#fff' : 'primary.dark',
          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : undefined
        }
      }} onClick={() => setStarDialogOpen(true)}>
        Learn More
      </Button>
      <StarDetailsDialog open={starDialogOpen} onClose={() => setStarDialogOpen(false)} />
    </Paper>
  );
} 