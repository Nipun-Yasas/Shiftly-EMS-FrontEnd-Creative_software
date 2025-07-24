import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import EventForm from '../_components/EventForm';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';

export default function EditDialog({ open, onClose, event, onUpdate }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  if (!event) return null;

  const showSnackbar = (message, severity = 'success') => {
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
      console.error("Date formatting error:", error);
      return null;
    }
  };
  // Helper to get the correct eventType object for the dropdown
  const getEventTypeObject = (eventTypeValue) => {
    if (!eventTypeValue) return null;
    if (typeof eventTypeValue === 'object' && eventTypeValue.id) return eventTypeValue;
    
    // If it's a string, try to find matching option
    const eventTypeOptions = [
      { id: 1, name: "Team Building" },
      { id: 2, name: "Corporate" },
      { id: 3, name: "Training" },
      { id: 4, name: "Social" },
      { id: 5, name: "Conference" },
      { id: 6, name: "Workshop" },
    ];
    
    return eventTypeOptions.find(option => 
      option.name === eventTypeValue || option.id === eventTypeValue
    ) || null;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Submitting values:", values); // Debug log
      
      const data = new FormData();
      data.append('title', values.title);
      data.append('eventType', values.eventType?.name || values.eventType);
      
      // Format dates properly
      const enableDate = values.enableDate ? new Date(values.enableDate).toISOString().slice(0, 10) : '';
      const expireDate = values.expireDate ? new Date(values.expireDate).toISOString().slice(0, 10) : '';
      
      data.append('enableDate', enableDate);
      data.append('expireDate', expireDate);
      
      if (values.banner) {
        data.append('image', values.banner);
      }

      console.log("Updating event with ID:", event.id); // Debug log
      
      const response = await axiosInstance.put(
        API_PATHS.EVENTS.UPDATE_EVENT(event.id),
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      console.log("Update response:", response.data); // Debug log
      showSnackbar("Event updated successfully!", "success");
      onUpdate && onUpdate(response.data);
      setTimeout(() => onClose(), 1000); // Close after showing success message
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      showSnackbar(
        error.response?.data?.message || "Failed to update event. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }} >Edit Event  <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton></DialogTitle>
      <DialogContent>
        <EventForm
          initialValues={{
            title: event.title || "",
            eventType: getEventTypeObject(event.eventType),
            enableDate: formatDateForInput(event.enableDate),
            expireDate: formatDateForInput(event.expireDate),
            banner: null, // File uploads typically reset in edit mode
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isEditMode={true}
        />
      </DialogContent>

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
    </Dialog>
  );
} 