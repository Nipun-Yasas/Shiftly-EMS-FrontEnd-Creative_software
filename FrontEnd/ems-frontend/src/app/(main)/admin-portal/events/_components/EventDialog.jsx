"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


export default function EventDialog({
  open,
  onClose,
  selectedEvent,
  approvalAction,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose}fullWidth>
      <DialogTitle>

      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to {approvalAction} the event "
          {selectedEvent?.title}"?
        </Typography>
        
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            justifyContent: { xs: "center", md: "flex-end" },
            display: "flex",
            gap: 1,
            width: "100%",
          }}
        >
          <Button color="text.primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            color={approvalAction === "approve" ? "success" : "error"}
          >
            {approvalAction === "approve" ? "Approve" : "Reject"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
