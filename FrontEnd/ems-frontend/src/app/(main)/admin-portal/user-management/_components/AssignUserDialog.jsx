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
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import TextInput from "../../../../_components/inputs/TextInput";
import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";

const roles = [
  { id: 1, name: "Admin", label: "Administrator" },
  { id: 2, name: "Employee", label: "Employee" },
];

const assignValidationSchema = Yup.object({
  employeeNumber: Yup.string()
    .min(3, "Employee Number must be at least 3 characters")
    .required("Employee Number is required"),
  roleId: Yup.object().required("Role is required"),
});

export default function AssignUserDialog({
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

  const getInitialValues = () => {
    return {
      employeeNumber: "",
      roleId: null,
    };
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
          Assign User Role & Employee Number
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
          initialValues={getInitialValues()}
          validationSchema={assignValidationSchema}
          onSubmit={handleAssignSubmit}
          enableReinitialize
        >
          {({ isSubmitting, submitForm }) => (
            <>
              <Form id="assign-user-form">
                <Stack spacing={2}>
                  <InputItem>
                    <TextInput
                      name="employeeNumber"
                      label="Employee Number"
                      placeholder="Enter employee number"
                    />
                  </InputItem>

                  <InputItem>
                    <SelectInput
                      name="roleId"
                      label="User Role"
                      options={roles}
                      getOptionLabel={(option) => option.label}
                    />
                  </InputItem>
                </Stack>
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
                    {isSubmitting ? "Assigning..." : "Assign User"}
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
