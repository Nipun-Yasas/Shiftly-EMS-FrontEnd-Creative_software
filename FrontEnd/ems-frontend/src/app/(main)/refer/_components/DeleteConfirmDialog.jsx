"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";

export default function DeleteConfirmDialog({ open, onClose, record, onDelete }) {
  const handleDelete = () => {
    onDelete(record);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperComponent={Paper}
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon sx={{ color: "warning.main" }} />
          <Typography variant="h6" sx={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>
            Confirm Delete
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this referral record?
          </Typography>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Record Details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Vacancy:</strong> {record?.vacancy}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Candidate:</strong> {record?.applicant_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {record?.applicant_email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong> {record?.status}
            </Typography>
          </Paper>
        </Box>
        
        <Typography variant="body2" color="error.main" sx={{ fontStyle: "italic" }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="text.primary">
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained" 
          color="error"
          sx={{ 
            backgroundColor: "error.main",
            "&:hover": {
              backgroundColor: "error.dark",
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
} 