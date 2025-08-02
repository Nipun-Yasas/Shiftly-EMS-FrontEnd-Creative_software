import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import CloseIcon from "@mui/icons-material/Close";

import EventForm from "../_components/EventForm";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";

const eventTypeOptions = [
  { id: 1, name: "Team Building" },
  { id: 2, name: "Corporate" },
  { id: 3, name: "Training" },
  { id: 4, name: "Social" },
  { id: 5, name: "Conference" },
  { id: 6, name: "Workshop" },
];

export default function EditDialog({ open, onClose, record, onUpdate }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!record) return null;

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

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
  // Helper to get the correct eventType object for the dropdown
  const getEventTypeObject = (eventTypeValue) => {
    if (!eventTypeValue) return null;
    if (typeof eventTypeValue === "object" && eventTypeValue.id)
      return eventTypeValue;

    return (
      eventTypeOptions.find(
        (option) =>
          option.name === eventTypeValue || option.id === eventTypeValue
      ) || null
    );
  };

  const getInitialValues = () => {
    if (!record)
      return "select a record to edit"
    return {
      id: record.id,
      title: record.title || "",
      eventType: getEventTypeObject(record.eventType),
      enableDate: formatDateForInput(record.enableDate),
      expireDate: formatDateForInput(record.expireDate),
      banner: record.imageUrl || null,
    };
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const data = new FormData();
      data.append("title", values.title);
      data.append("eventType", values.eventType?.name || values.eventType);

      // Format dates properly
      const enableDate = values.enableDate
        ? new Date(values.enableDate).toISOString().slice(0, 10)
        : "";
      const expireDate = values.expireDate
        ? new Date(values.expireDate).toISOString().slice(0, 10)
        : "";

      data.append("enableDate", enableDate);
      data.append("expireDate", expireDate);

      // Only append image if it's a new file (not the existing URL)
      if (values.banner && values.banner instanceof File) {
        data.append("image", values.banner);
      }

      await onUpdate(record.id, data);
      setSnackbar({
        open: true,
        message: "Event updated successfully!",
        severity: "success",
      });
      setTimeout(() => onClose(), 600);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update event. Please try again.",
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
        Edit Event
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <EventForm
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
