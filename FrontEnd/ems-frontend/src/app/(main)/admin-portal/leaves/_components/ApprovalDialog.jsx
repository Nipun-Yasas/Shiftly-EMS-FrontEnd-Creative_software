"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

export default function ApprovalDialog({
  open,
  onClose,
  selectedLeave,
  approvalAction,
  approvalReason,
  setApprovalReason,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {approvalAction === "approve" ? "Approve Leave" : "Reject Leave"}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to {approvalAction} leave request{" "}
          {selectedLeave?.leaveId}?
        </Typography>

        {approvalAction === "reject" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            required
            sx={{ mt: 2 }}
          />
        )}

        {approvalAction === "approve" && (
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Approval Notes (Optional)"
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
            placeholder="Any additional notes..."
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color={approvalAction === "approve" ? "success" : "error"}
          onClick={onSubmit}
          disabled={approvalAction === "reject" && !approvalReason.trim()}
        >
          {approvalAction === "approve" ? "Approve" : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
