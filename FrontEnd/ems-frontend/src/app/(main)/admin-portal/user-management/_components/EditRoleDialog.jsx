"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";

const roles = [
  { id: 1, name: "Admin", label: "Administrator" },
  { id: 2, name: "Employee", label: "Employee" },
];

const roleValidationSchema = Yup.object({
  roleId: Yup.object().required("Role is required"),
});

export default function EditRoleDialog({
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

  const getInitialValues = () => {
    if (editingUser) {
      return {
        roleId: roles.find((r) => r.name === editingUser.roleId?.name) || null,
      };
    }
    return { roleId: null };
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
          Edit User Role
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
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {editingUser?.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Employee Number:</strong> {editingUser?.employeeNumber}
          </Typography>
        </Box>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={roleValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, submitForm }) => (
            <>
              <Form id="edit-role-form">
                <InputItem>
                  <SelectInput
                    name="roleId"
                    label="User Role"
                    options={roles}
                    getOptionLabel={(option) => option.label}
                  />
                </InputItem>
              </Form>
              <DialogActions dividers sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", sm: "flex-end" },
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Button
                    onClick={submitForm}
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    {isSubmitting ? "Updating..." : "Update Role"}
                  </Button>
                  <Button color="text.primary" onClick={handleClose}>
                    Cancel
                  </Button>
                </Box>
              </DialogActions>
            </>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
