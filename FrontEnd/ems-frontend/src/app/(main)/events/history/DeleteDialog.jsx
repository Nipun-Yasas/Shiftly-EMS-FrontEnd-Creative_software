import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';

export default function DeleteDialog({ open, onClose, event, onDelete }) {
  if (!event) return null;

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.EVENTS.DELETE_EVENT(event.id));
      onDelete && onDelete(event);
      onClose();
    } catch (error) {
      // handle error (show snackbar, etc.)
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Event</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this event?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
} 