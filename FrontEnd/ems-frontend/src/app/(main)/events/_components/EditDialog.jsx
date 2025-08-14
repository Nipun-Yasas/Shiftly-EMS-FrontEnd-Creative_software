"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import EventForm from "./EventForm";

const eventTypeOptions = [
  { id: 1, name: "Team Building" },
  { id: 2, name: "Corporate" },
  { id: 3, name: "Training" },
  { id: 4, name: "Social" },
  { id: 5, name: "Conference" },
  { id: 6, name: "Workshop" },
];

export default function EditDialog({ open, onClose, record, handleUpdate }) {
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
    if (!record) return "select a record to edit";
    return {
      title: record.title || "",
      eventType: getEventTypeObject(record.eventType),
      enableDate: record.enableDate,
      expireDate: record.expireDate,
      image: record.imageUrl || null,
    };
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Edit Claim Entry
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ m: 2 }}>
        <EventForm
          edit={true}
          selectedRecord={record}
          handleSubmit={handleUpdate}
          initialValues={getInitialValues()}
        />
      </DialogContent>
    </Dialog>
  );
}
