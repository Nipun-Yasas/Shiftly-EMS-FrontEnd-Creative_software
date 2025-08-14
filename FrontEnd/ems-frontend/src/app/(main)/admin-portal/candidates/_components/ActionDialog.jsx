"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import Close from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";

export default function ActionDialog({
  open,
  onClose,
  selectedRecord,
  action,
  onRead,
  onUnRead,
}) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {action === "read" ? "Mark as Read" : "Mark as Unread"}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedRecord && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to {action} this record for{" "}
              {selectedRecord.employeeName || "this employee"}?
            </Typography>
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
          {action === "read" ? (
            <Button
              color="success"
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={() => onRead && onRead()}
            >
              mark as Read
            </Button>
          ) : (
            <Button
              color="error"
              variant="contained"
              startIcon={<Cancel />}
              onClick={() => onUnRead && onUnRead()}
            >
              mark as Unread
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
