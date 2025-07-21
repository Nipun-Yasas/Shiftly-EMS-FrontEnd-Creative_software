"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function EventDialog({
  open,
  onClose,
  selectedEvent,
  approvalAction,
  approvalReason,
  setApprovalReason,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {approvalAction === "approve" ? (
            <CheckCircleIcon color="success" />
          ) : (
            <CancelIcon color="error" />
          )}
          {approvalAction === "approve" ? "Approve Event" : "Reject Event"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to {approvalAction} the event "
          {selectedEvent?.title}"?
        </Typography>
        {approvalAction === "approve" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Approval Notes (Optional)"
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
            placeholder="Any additional notes or conditions for approval..."
          />
        )}
        {approvalAction === "reject" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
          />
        )}
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
