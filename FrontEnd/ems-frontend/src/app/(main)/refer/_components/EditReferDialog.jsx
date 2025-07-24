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
import { useVacancies } from '../../../_hooks/useVacancies';
import { Formik, Form } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function EditReferDialog({ open, onClose, record, onUpdate }) {
  const [openSubmit, setOpenSubmit] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { vacancies } = useVacancies();

  const handleClose = () => {
    setOpenSubmit(false);
    onClose();
  };

  // Helper to get the correct vacancy object for the dropdown
  const getVacancyObject = (vacancyValue) => {
    if (!vacancyValue) return null;
    if (typeof vacancyValue === 'object' && vacancyValue.id) return vacancyValue;
    return vacancies.find(v => v.id === vacancyValue || v.name === vacancyValue) || null;
  };

  // Transform data grid record to form values
  const getInitialValues = () => {
    if (!record) return {
      id: '',
      vacancy: null,
      applicantName: '',
      applicantEmail: '',
      message: '',
      resume: null,
    };
    return {
      id: record.id,
      vacancy: getVacancyObject(record.vacancy),
      applicantName: record.applicant_name || '',
      applicantEmail: record.applicant_email || '',
      message: record.message || '',
      resume: record.resume_file_path || null,
    };
  };

  // Backend update logic handled here (parent pattern)
  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const data = new FormData();
      data.append('id', record.id);
      data.append('vacancyId', values.vacancy?.id || '');
      data.append('applicantName', values.applicantName);
      data.append('applicantEmail', values.applicantEmail);
      data.append('message', values.message);
      if (values.resume && values.resume instanceof File) {
        data.append('file', values.resume);
      }
      await onUpdate(record.id, data);
      setSnackbar({ open: true, message: 'Referral updated!', severity: 'success' });
      handleClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update referral.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
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
        <Formik
          enableReinitialize
          initialValues={getInitialValues()}
          onSubmit={handleUpdate}
        >
          {({ handleSubmit }) => (
            <Form>
              <ReferForm
                setOpenSubmit={setOpenSubmit}
                isEditMode={true}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleClose} color="text.primary" sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                  Update
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
} 