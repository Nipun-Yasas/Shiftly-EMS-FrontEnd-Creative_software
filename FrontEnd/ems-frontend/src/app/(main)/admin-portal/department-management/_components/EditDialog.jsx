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

export default function EditDialog({ open, onClose, onUpdate, admins }) {
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
          onSubmit={onUpdate}
        >
          {({ isSubmitting, submitForm, values }) => (
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
                {admins && admins.length > 0 ? (
                  <Button
                    variant="contained"
                    onClick={submitForm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Assigning..." : "Assign"}
                  </Button>
                ) : (
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    No admins without departments
                  </Typography>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
