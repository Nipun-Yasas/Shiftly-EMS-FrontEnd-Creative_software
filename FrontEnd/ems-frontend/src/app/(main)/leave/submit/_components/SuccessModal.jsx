'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';


const SuccessModal = ({ isOpen, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="success-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
          bgcolor: 'background.paper',
          color: 'text.primary',
        },
      }}
    >
      <DialogTitle id="success-dialog-title" sx={{ fontWeight: 700 }}>
        Leave Request Submitted Successfully!
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Your leave request has been submitted and is pending approval.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            color: theme.palette.text.primary,
            bgcolor: theme.palette.grey[200],
            '&:hover': {
              bgcolor: theme.palette.grey[300],
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
