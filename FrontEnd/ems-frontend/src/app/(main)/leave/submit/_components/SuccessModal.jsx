'use client';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';


const SuccessSnackbar = ({ isOpen, onClose }) => {
  const theme = useTheme();
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        sx={{ width: '100%', fontWeight: 500, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}
      >
        Leave request submitted successfully! Your leave request is pending approval.
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
