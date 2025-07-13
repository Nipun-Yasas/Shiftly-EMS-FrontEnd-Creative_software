import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function StarDetailsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Star Points Details
        <IconButton onClick={onClose} size="small" sx={{ ml: 2 }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ fontFamily: 'var(--font-lexend)', color: 'text.secondary', pt: 1 }}>
        <Typography variant="body1" sx={{ mb: 2 }}><b>What are Star Points?</b><br />Star Points are special recognitions awarded by admins for outstanding performance, teamwork, or going above and beyond in your role.</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}><b>How do I earn more?</b><br />Admins can add stars to your profile when you achieve something exceptional. Keep striving for excellence!</Typography>
        <Typography variant="body1" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>Rewards you can unlock:</Typography>
        <Box component="ul" sx={{ pl: 3, m: 0, color: 'text.secondary', fontFamily: 'var(--font-lexend)', fontSize: '1rem' }}>
          <li>1 star: Bronze badge</li>
          <li>3 stars: Gift card</li>
          <li>5 stars: Extra day off</li>
          <li>10 stars: Platinum recognition & special reward</li>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 