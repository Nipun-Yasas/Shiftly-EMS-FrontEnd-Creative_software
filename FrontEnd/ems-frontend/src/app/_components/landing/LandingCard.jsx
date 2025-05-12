import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const LandingCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(16px)',
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[10],
  borderRadius: '1.5rem',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '600px',
  width: '100%',
  maxWidth: '600px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export default LandingCard;