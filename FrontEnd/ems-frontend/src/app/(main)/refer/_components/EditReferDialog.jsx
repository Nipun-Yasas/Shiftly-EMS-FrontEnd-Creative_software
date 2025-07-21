"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ReferForm from "./ReferForm";

export default function EditReferDialog({ open, onClose, record, onUpdate }) {
  const [openSubmit, setOpenSubmit] = useState(false);

  const handleClose = () => {
    setOpenSubmit(false);
    onClose();
  };

  const handleSubmit = (values) => {
    
    // Transform form values to match the data grid structure
    const updatedRecord = {
      ...record,
      vacancy: values.vacancy?.name || values.vacancy,
      applicant_name: values.applicantName,
      applicant_email: values.applicantEmail,
      message: values.message,
      resume_file_path: values.resume?.name || values.resume,
    };

    onUpdate(updatedRecord);
    handleClose();
  };

  // Transform data grid record to form values
  const getInitialValues = () => {
    if (!record) return {};
    
    return {
      vacancy: { id: 1, name: record.vacancy }, // Assuming vacancy is a string, map to option object
      applicantName: record.applicant_name || "",
      applicantEmail: record.applicant_email || "",
      message: record.message || "",
      resume: record.resume_file_path || null,
    };
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperComponent={Paper}
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
          minHeight: "60vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>
          Edit Referral Record
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Update the referral information below:
          </Typography>
        </Box>
        
        <ReferForm 
          setOpenSubmit={setOpenSubmit}
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          isEditMode={true}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} color="text.primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
} 