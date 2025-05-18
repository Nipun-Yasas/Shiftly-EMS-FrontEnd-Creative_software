import { Card } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  margin: '10px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  backgroundColor: 'textblack.main',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
});

export default StyledCard;