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
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Verify and Assign User</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Username:</strong> {assigningUser?.username}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Email:</strong> {assigningUser?.email}
          </Typography>
        </Box>

        <Formik
          initialValues={getAssignInitialValues()}
          validationSchema={assignValidationSchema}
          onSubmit={handleAssignSubmit}
          enableReinitialize
        >
          {({ isSubmitting, submitForm }) => (
            <Form>
              <UserForm
                showEmployeeNumber={true}
                isSubmitting={isSubmitting}
                isEdit={false}
                onCancel={handleClose}
                submitForm={submitForm}
              />
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
