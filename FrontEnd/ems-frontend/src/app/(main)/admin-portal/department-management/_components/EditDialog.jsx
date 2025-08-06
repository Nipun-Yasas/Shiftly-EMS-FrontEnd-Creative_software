"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

import { Formik, Form } from "formik";

import InputItem from "../../../../_components/inputs/InputItem";
import SelectInput from "../../../../_components/inputs/SelectInput";
import { API_PATHS } from "../../../../_utils/apiPaths";
import axiosInstance from "../../../../_utils/axiosInstance";

export default function EditDialog({
  open, onClose, record, onUpdate, admins
}) {
  const handleSubmit = async (values, { setSubmitting }) => {
    if (!record || !values.adminuserid) return;
    try {
      await axiosInstance.put(
        API_PATHS.DEPARTMENTS.DEPARTMENT_ADMIN_ASSIGN(
          record.departmentId, // department id from selected record
          values.adminuserid.id // admin id from selected admin
        )
      );
      if (onUpdate) onUpdate(record.departmentId, values); // Optionally refresh data
      onClose();
    } catch (error) {
      console.error("Error assigning admin:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Assign a admin</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          enableReinitialize
          initialValues={{ adminuserid: null }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, submitForm }) => (
            <Form>
              <InputItem>
                <SelectInput
                  name="adminuserid"
                  label="Admin User"
                  options={admins}
                  getOptionLabel={(option) => option.username}
                />
              </InputItem>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={submitForm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Assigning..." : "Assign"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
