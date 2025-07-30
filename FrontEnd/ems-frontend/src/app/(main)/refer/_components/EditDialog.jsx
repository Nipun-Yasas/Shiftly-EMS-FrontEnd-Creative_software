"use client";

import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import ReferForm from "./ReferForm";
import { useVacancies } from "../../../_hooks/useVacancies";

export default function EditDialog({ open, onClose, record, onUpdate }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { vacancies } = useVacancies();

  // Helper to get the correct vacancy object for the dropdown
  const getVacancyObject = (vacancyValue) => {
    if (!vacancyValue) return null;
    if (typeof vacancyValue === "object" && vacancyValue.id)
      return vacancyValue;
    return (
      vacancies.find((v) => v.id === vacancyValue || v.name === vacancyValue) ||
      null
    );
  };

  // Transform data grid record to form values
  const getInitialValues = () => {
    if (!record) return "select a record to edit";
    return {
      id: record.id,
      vacancy: getVacancyObject(record.vacancy),
      applicantName: record.applicantName || "",
      applicantEmail: record.applicantEmail || "",
      message: record.message || "",
      resume: record.fileUrl || null,
    };
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const data = new FormData();
      data.append("vacancyId", values.vacancy?.id || "");
      data.append("applicantName", values.applicantName);
      data.append("applicantEmail", values.applicantEmail);
      data.append("message", values.message);
      if (values.resume && values.resume instanceof File) {
        data.append("resume", values.fileUrl);
      }
      await onUpdate(record.id, data);
      setSnackbar({
        open: true,
        message: "Referral updated successfully!",
        severity: "success",
      });
      setTimeout(() => onClose(), 600);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update referral.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        Edit Referral Record
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <ReferForm
          initialValues={getInitialValues()}
          onSubmit={handleUpdate}
          onCancel={onClose}
          edit={true}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
}
