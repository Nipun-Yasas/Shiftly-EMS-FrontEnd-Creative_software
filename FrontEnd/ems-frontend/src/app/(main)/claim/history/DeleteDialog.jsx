import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';

export default function DeleteDialog({ open, onClose, claim, onDelete }) {
  if (!claim) return null;

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.CLAIMS.DELETE_CLAIM(claim.id));
      onDelete && onDelete(claim);
      onClose();
    } catch (error) {
      // handle error (show snackbar, etc.)
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Claim</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this claim?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
} 