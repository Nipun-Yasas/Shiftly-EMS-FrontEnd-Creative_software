"use client";

import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import CloseIcon from "@mui/icons-material/Close";

import ClaimForm from "./ClaimForm";
import dayjs from "dayjs";

const claimtypeOptions = [
  { id: 1, name: "Medical" },
  { id: 2, name: "Insuarance" },
];

export default function EditDialog({ open, onClose, record, onUpdate }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!record) return null;

  // Helper to format date for form input
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return null;
    try {
      // If it's already a Date object
      if (dateValue instanceof Date) {
        return dateValue;
      }
      // If it's a string, convert to Date
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      return null;
    }
  };

  // Helper to get the correct claimType object for the dropdown
  const getClaimTypeObject = (claimTypeValue) => {
    if (!claimTypeValue) return null;
    if (typeof claimTypeValue === "object" && claimTypeValue.id)
      return claimTypeValue;

    return (
      claimtypeOptions.find(
        (option) =>
          option.name === claimTypeValue || option.id === claimTypeValue
      ) || null
    );
  };

  const getInitialValues = () => {
    if (!record)
      return "select a record to edit"
    return {
      id: record.id,
      claimtype: getClaimTypeObject(record.claimType),
      claimdate: formatDateForInput(record.claimDate),
      description: record.description || "",
      claimfile: record.claimUrl || null,
    };
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const data = new FormData();
      data.append("claimType", values.claimtype?.name || values.claimtype);
      data.append("description", values.description);

      // Format date properly
      const claimDate = values.claimdate
        ? dayjs(values.claimdate).format('YYYY-MM-DD')
        : "";
      data.append("claimDate", claimDate);

      // Only append file if it's a new file (not the existing URL)
      if (values.claimfile && values.claimfile instanceof File) {
        data.append("file", values.claimfile);
      }

      await onUpdate(record.id, data);
      setSnackbar({
        open: true,
        message: "Claim updated successfully!",
        severity: "success",
      });
      setTimeout(() => onClose(), 600);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update claim. Please try again.",
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
        Edit Claim
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <ClaimForm
          initialValues={getInitialValues()}
          onSubmit={handleUpdate}
          onCancel={onClose}
          edit={true}
        />
      </DialogContent>

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
    </Dialog>
  );
}
