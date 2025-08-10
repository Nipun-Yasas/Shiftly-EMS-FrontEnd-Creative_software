"use client";

import { Formik, Form } from "formik";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

import InputItem from "../../../../_components/inputs/InputItem";
import TextInput from "../../../../_components/inputs/TextInput";

export default function EditDialog({
  open,
  onClose,
  record,
  onUpdate,
  validationSchema,
}) {
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
          <Typography variant="h6">Update Vacancy</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          enableReinitialize
          initialValues={{ vacancyName: record?.vacancyName || "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onUpdate(record.id, values);
            onClose();
          }}
        >
          {({ isSubmitting, submitForm }) => (
            <Form>
              <InputItem>
                <TextInput name="vacancyName" label="Vacancy Name" />
              </InputItem>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={submitForm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
