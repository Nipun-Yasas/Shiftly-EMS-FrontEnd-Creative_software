import { Paper, Box, Typography, Button, useTheme, Fade } from '@mui/material';
import WaterFill from './WaterFill';
import AnimatedCount from './AnimatedCount';
import { useEffect, useRef, useState } from 'react';

export default function ProgressCard({ progress, goals, setGoalTableDialogOpen, setAddGoalDialogOpen }) {
  const theme = useTheme();
  const [showCongrats, setShowCongrats] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const confettiFired = useRef(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run on server side
    
    if (progress === 100 && !confettiFired.current) {
      confettiFired.current = true;
      setShowCongrats(true);
      
      // Import and use confetti only on client side
      const fireConfetti = async () => {
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ff80ab', '#ffd6e0', '#43a047', '#ffd600', '#1976d2'],
          });
        } catch (error) {
          console.log('Confetti not available:', error);
        }
      };
      
      fireConfetti();
      setTimeout(() => setShowCongrats(false), 4000);
    }
    if (progress < 100) {
      confettiFired.current = false;
    }
  }, [progress, isClient]);

  const handleMoreDetails = () => {
    // Simple functionality - just open the goal table dialog
    setGoalTableDialogOpen(true);
  };

  const handleSetNewGoal = () => {
    // Simple functionality - just open the add goal dialog
    setAddGoalDialogOpen(true);
  };

  // Get progress color based on completion percentage
  const getProgressColor = (progress) => {
    if (progress === 100) return 'success.main';
    if (progress >= 75) return 'primary.main';
    if (progress >= 50) return 'warning.main';
    if (progress >= 25) return 'info.main';
    return 'text.secondary';
  };

  // Get progress message and color
  const getProgressMessage = (progress) => {
    if (progress === 100) return { text: "🎉 Amazing! All goals completed!", color: 'success.main' };
    if (progress >= 75) return { text: "Almost there! One last push to 100%!", color: 'primary.main' };
    if (progress >= 50) return { text: "Great job! You're halfway to your goals.", color: 'warning.main' };
    if (progress >= 25) return { text: "Good start! Keep the momentum going.", color: 'info.main' };
    return { text: "Let's get started! Every step counts.", color: 'text.secondary' };
  };

  const progressMessage = getProgressMessage(progress);

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <Paper elevation={4} sx={{
        p: 0,
        borderRadius: 3,
        height: '100%',
        minHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'background.paper',
      }}>
        <Box sx={{ 
          position: 'relative', 
          zIndex: 2, 
          width: '100%', 
          py: 5, 
          px: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            fontFamily: 'var(--font-poppins)', 
            fontWeight: 600, 
            color: 'text.primary', 
            letterSpacing: 0.5 
          }}>
            My Progress
          </Typography>
          <Typography variant="h4" sx={{ 
            color: 'text.primary', 
            fontFamily: 'var(--font-poppins)', 
            fontWeight: 700 
          }}>
            {progress}%
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'text.secondary', 
            fontFamily: 'var(--font-lexend)', 
            mb: 1, 
            mt: 1 
          }}>
            {goals.filter(g => g.completed).length} of {goals.length} goals completed
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
      alignItems: 'center',
      textAlign: 'center',
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
      <WaterFill progress={progress} />
      {/* Congratulation Overlay */}
      <Fade in={showCongrats} timeout={600} unmountOnExit>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.9)' 
            : 'rgba(255, 255, 255, 0.95)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <Typography variant="h2" sx={{ 
            color: 'success.main', 
            fontWeight: 900, 
            fontFamily: 'var(--font-poppins)', 
            mb: 2, 
            textShadow: theme.palette.mode === 'dark' 
              ? '0 2px 12px rgba(76, 175, 80, 0.6)' 
              : '0 2px 12px rgba(76, 175, 80, 0.3)'
          }}>
            🎉 Congratulations! 🎉
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'primary.main', 
            fontWeight: 700, 
            fontFamily: 'var(--font-lexend)' 
          }}>
            You completed all your goals!
          </Typography>
        </Box>
      </Fade>
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        width: '100%', 
        py: 5, 
        px: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h6" sx={{ 
          mb: 2, 
          fontFamily: 'var(--font-poppins)', 
          fontWeight: 600, 
          color: 'text.primary', 
          letterSpacing: 0.5 
        }}>
          My Progress
        </Typography>
        <AnimatedCount value={progress} />
        <Typography variant="body2" sx={{ 
          color: 'text.secondary', 
          fontFamily: 'var(--font-lexend)', 
          mb: 1, 
          mt: 1 
        }}>
          {goals.filter(g => g.completed).length} of {goals.length} goals completed
        </Typography>
        <Typography variant="body2" sx={{ 
          mb: 4, 
          color: progressMessage.color, 
          fontFamily: 'var(--font-lexend)', 
          fontWeight: 600, 
          fontSize: '1.1rem', 
          minHeight: 28, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 1 
        }}>
          {progressMessage.text}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center', 
          width: '100%', 
          mt: 2 
        }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: getProgressColor(progress), 
              '&:hover': { 
                bgcolor: theme.palette.mode === 'dark' 
                  ? `${getProgressColor(progress)}dd` 
                  : `${getProgressColor(progress)}cc` 
              }, 
              borderRadius: 2, 
              px: 4, 
              py: 1.5, 
              fontWeight: 700, 
              fontSize: '1rem', 
              boxShadow: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }} 
            onClick={handleMoreDetails}
          >
            More Details
          </Button>
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: getProgressColor(progress), 
              color: getProgressColor(progress), 
              '&:hover': { 
                borderColor: getProgressColor(progress), 
                bgcolor: theme.palette.mode === 'dark' 
                  ? `${getProgressColor(progress)}20` 
                  : `${getProgressColor(progress)}10` 
              }, 
              borderRadius: 2, 
              px: 4, 
              py: 1.5, 
              fontWeight: 700, 
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              }
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