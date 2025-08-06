"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";

import { useDepartments } from "../../../../_hooks/useDepartments";
import { Input } from "@mui/material";

export default function EditDialog({
  editDialogOpen,
  setOpenDialog,
  handleSubmit,
}) {
  const { departments } = useDepartments();
  
  const handleClose = () => {
    setOpenDialog(false);
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
          <Typography variant="h6">Assign a admin</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
          </Typography>
        </Box>

        <Formik
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, submitForm }) => (
            <Form>
              <InputItem>
              <SelectInput>
                
              </SelectInput>
              </InputItem>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
