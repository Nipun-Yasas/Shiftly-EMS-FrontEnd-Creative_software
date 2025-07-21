"use client";

import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";

import UserForm, {
  editValidationSchema,
  getEditInitialValues,
} from "./UserForm";

export default function EditDialog({
  editDialogOpen,
  setOpenDialog,
  editingUser,
  setEditingUser,
  handleSubmit,
}) {
  const handleClose = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  return (
    <Dialog open={editDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Edit User</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Username:</strong> {editingUser?.username}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Email:</strong> {editingUser?.email}
          </Typography>
        </Box>

        <Formik
          initialValues={getEditInitialValues(editingUser)}
          validationSchema={editValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, submitForm }) => (
            <Form>
              <UserForm
                showEmployeeNumber={false}
                isSubmitting={isSubmitting}
                isEdit={true}
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
