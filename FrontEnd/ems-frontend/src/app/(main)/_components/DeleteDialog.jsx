import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function DeleteDialog({ open,
  onClose,
  onConfirm,
  loading,}) {

  return (
    <Dialog open={open} onClose={onClose} fullWidth >
      <DialogTitle >Delete Event</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this event?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="text.primary">Cancel</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 