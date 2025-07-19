import { Paper, Box, Typography, Button, useTheme, Fade } from '@mui/material';
import WaterFill from './WaterFill';
import AnimatedCount from './AnimatedCount';
import { useEffect, useRef, useState } from 'react';

export default function ProgressCard({ progress, goals, setGoalTableDialogOpen, setAddGoalDialogOpen }) {
  const theme = useTheme();
  const [showCongrats, setShowCongrats] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (progress === 100 && !confettiFired.current) {
      confettiFired.current = true;
      setShowCongrats(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff80ab', '#ffd6e0', '#43a047', '#ffd600', '#1976d2'],
      });
      setTimeout(() => setShowCongrats(false), 4000);
    }
    if (progress < 100) {
      confettiFired.current = false;
    }
  }, [progress]);

  const handleMoreDetails = () => {
    // Simple functionality - just open the goal table dialog
    setGoalTableDialogOpen(true);
  };

  const handleSetNewGoal = () => {
    // Simple functionality - just open the add goal dialog
    setAddGoalDialogOpen(true);
  };

  return (
    <Paper elevation={4} sx={{
      p: 0,
      borderRadius: 4,
      height: '100%',
      minHeight: 480,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 6,
      justifyContent: 'center',
      background: theme => theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
        : 'linear-gradient(180deg, #fff6fb 0%, #ffe3ec 100%)',
    }}>
      <WaterFill progress={progress} />
      {/* Congratulation Overlay */}
      <Fade in={showCongrats} timeout={600} unmountOnExit>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(255,255,255,0.92)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <Typography variant="h2" sx={{ color: '#43a047', fontWeight: 900, fontFamily: 'var(--font-poppins)', mb: 2, textShadow: '0 2px 12px #43a04744' }}>
            🎉 Congratulations! 🎉
          </Typography>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700, fontFamily: 'var(--font-lexend)' }}>
            You completed all your goals!
          </Typography>
        </Box>
      </Fade>
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%', py: 5, px: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)', fontWeight: 600, color: theme => theme.palette.text.primary, letterSpacing: 0.5 }}>
          My Progress
        </Typography>
        <AnimatedCount value={progress} />
        <Typography variant="body2" sx={{ color: theme => theme.palette.text.secondary, fontFamily: 'var(--font-lexend)', mb: 1, mt: 1 }}>
          {goals.filter(g => g.completed).length} of {goals.length} goals completed
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: progress === 100 ? '#43a047' : theme => theme.palette.text.secondary, fontFamily: 'var(--font-lexend)', fontWeight: 600, fontSize: '1.1rem', minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {progress === 100 ? <><span role="img" aria-label="party">🎉</span> <span> Amazing! All goals completed!</span></> : progress >= 75 ? "Almost there! One last push to 100%!" : progress >= 50 ? "Great job! You're halfway to your goals." : progress >= 25 ? "Good start! Keep the momentum going." : "Let's get started! Every step counts."}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', width: '100%', mt: 2 }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: theme.palette.primary.main, 
              '&:hover': { bgcolor: theme.palette.primary.dark }, 
              borderRadius: 2, 
              px: 4, 
              py: 1.5, 
              fontWeight: 700, 
              fontSize: '1rem', 
              boxShadow: 2 
            }} 
            onClick={handleMoreDetails}
          >
            More Details
          </Button>
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: theme.palette.primary.main, 
              color: theme.palette.primary.main, 
              '&:hover': { borderColor: theme.palette.primary.dark, bgcolor: theme.palette.primary.light + '20' }, 
              borderRadius: 2, 
              px: 4, 
              py: 1.5, 
              fontWeight: 700, 
              fontSize: '1rem' 
            }} 
            onClick={handleSetNewGoal}
          >
            Set New Goal
          </Button>
        </Box>
      </Box>
    </Paper>
  );
} 