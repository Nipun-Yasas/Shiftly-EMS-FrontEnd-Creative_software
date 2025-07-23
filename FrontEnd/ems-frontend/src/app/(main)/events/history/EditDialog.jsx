import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import EventForm from '../_components/EventForm';
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';

export default function EditDialog({ open, onClose, event, onUpdate }) {
  if (!event) return null;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = new FormData();
      data.append('title', values.title);
      data.append('eventType', values.eventType?.name || values.eventType);
      data.append('enableDate', values.enableDate?.slice(0, 10));
      data.append('expireDate', values.expireDate?.slice(0, 10));
      if (values.banner) {
        data.append('image', values.banner);
      }
      // Optionally add status if needed
      // data.append('status', values.status || event.status);

      const response = await axiosInstance.put(
        API_PATHS.EVENTS.UPDATE_EVENT(event.id),
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onUpdate && onUpdate(response.data);
      onClose();
    } catch (error) {
      // handle error (show snackbar, etc.)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <EventForm
          initialValues={{
            title: event.title,
            eventType: event.eventType,
            enableDate: event.enableDate,
            expireDate: event.expireDate,
            banner: null,
            // status: event.status, // if needed
          }}
          onSubmit={handleSubmit}
          isEditMode={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
} 