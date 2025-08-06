"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";

import { Formik, Form } from "formik";

const roles = [
  { id: 1, name: "ADMIN", label: "Admin" },
  { id: 2, name: "USER", label: "User" },
];

const assignValidationSchema = Yup.object({
  roleId: Yup.object().required("Role is required"),
});


export default function VerifyDialog({
  assignDialogOpen,
  setAssignDialogOpen,
  assigningUser,
  setAssigningUser,
  handleAssignSubmit,
  onCancel
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

        <Formik
            initialValues={
              {roleId: null}
            }
              validationSchema={assignValidationSchema}
              onSubmit={handleAssignSubmit}
              enableReinitialize
            >
              {({ isSubmitting, submitForm }) => (
                <Form>
                  <Stack spacing={1}>
                    <InputItem>
                      <SelectInput
                        name="roleId"
                        label="User Role"
                        options={roles}
                        getOptionLabel={(option) => option.label}
                      />
                    </InputItem>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent={{ xs: "center", sm: "flex-end" }}
                      width="100%"
                    >
                      {onCancel && (
                        <Button color="text.primary" variant="text" onClick={onCancel}>
                          Cancel
                        </Button>
                      )}
                      <Button
                        onClick={submitForm}
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>

      </DialogContent>
    </Dialog>
  );
}
