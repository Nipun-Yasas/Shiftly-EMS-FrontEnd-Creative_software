"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function DeleteDialog({
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  userToDelete,
  handleDelete,
}) {
  const handleClose = () => {
    setDeleteConfirmOpen(false);
  };

  return (
    <Dialog open={deleteConfirmOpen} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete user {userToDelete?.username}? This
          action cannot be undone and will permanently remove the user's access
          to the system.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="text.primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
