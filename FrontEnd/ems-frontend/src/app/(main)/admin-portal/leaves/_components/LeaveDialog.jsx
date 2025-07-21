"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import Close from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";

export default function LeaveDialog({
  open,
  onClose,
  selectedLeave,
  approvalAction,
  approvalReason,
  setApprovalReason,
  onSubmit,
}) {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleClose = () => {
    setApprovalReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {approvalAction === "approve" ? "Approve Leave" : "Reject Leave"}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {selectedLeave && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedLeave.employeeName} - {selectedLeave.leaveType}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Duration: {selectedLeave.leaveDuration} day
              {selectedLeave.leaveDuration > 1 ? "s" : ""}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedLeave.reason}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={
                approvalAction === "approve"
                  ? "Approval Notes (optional)"
                  : "Rejection Reason (required)"
              }
              variant="outlined"
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder={
                approvalAction === "approve"
                  ? "Any additional notes..."
                  : "Please provide a reason for rejection..."
              }
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Box
          sx={{
            justifyContent: { xs: "center", md: "flex-end" },
            display: "flex",
            gap: 1,
            width: "100%",
          }}
        >
          <Button color="text.primary" onClick={handleClose}>
            Cancel
          </Button>
          {approvalAction === "approve" ? (
            <Button
              color="success"
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={handleSubmit}
            >
              Approve
            </Button>
          ) : (
            <Button
              color="error"
              variant="contained"
              startIcon={<Cancel />}
              onClick={handleSubmit}
            >
              Reject
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
