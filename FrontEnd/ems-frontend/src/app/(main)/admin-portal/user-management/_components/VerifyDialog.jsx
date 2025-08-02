"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";

import UserForm, {
  assignValidationSchema,
  getAssignInitialValues,
} from "./UserForm";

export default function VerifyDialog({
  assignDialogOpen,
  setAssignDialogOpen,
  assigningUser,
  setAssigningUser,
  handleAssignSubmit,
}) {
  const handleClose = () => {
    setAssignDialogOpen(false);
    setAssigningUser(null);
  };

  return (
    <Dialog
      open={assignDialogOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle  sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}>
          Verify and Assign User
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Username:</strong> {assigningUser?.username}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Email:</strong> {assigningUser?.email}
          </Typography>
        </Box>

        <UserForm handleAssignSubmit={handleAssignSubmit} onCancel={handleClose} />

      </DialogContent>
    </Dialog>
  );
}
