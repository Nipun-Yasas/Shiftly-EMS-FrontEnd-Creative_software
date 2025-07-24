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

export default function ClaimApprovalDialog({
  open,
  onClose,
  selectedClaim,
  action,
  onApprove,
  onReject,
}) {
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    if (onApprove) {
      onApprove(reason);
    }
    setReason("");
  };

  const handleReject = () => {
    if (onReject) {
      onReject(reason);
    }
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}  fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {action === "approve" ? "Approve Claim" : "Reject Claim"}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent >
        {selectedClaim && (
          <Box>
            <Typography variant="body1" gutterBottom>
              are you sure you want to {action} the claim for{" "}
              {selectedClaim.employee_name}?
            </Typography>
            
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{p:2}}>
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
          {action === "approve" ? (
            <Button
              color="success"
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={handleApprove}
            >
              Approve
            </Button>
          ) : (
            <Button
              color="error"
              variant="contained"
              startIcon={<Cancel />}
              onClick={handleReject}
            >
              Reject
            </Button>
          )}

          
        </Box>
      </DialogActions>
    </Dialog>
  );
}
