"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import TimesheetForm from "./TimesheetForm";

const workModeOptions = [
  { id: 1, name: "Online" },
  { id: 2, name: "On-site" },
  { id: 3, name: "Hybrid" },
];

export default function EditTimesheetDialog({
  open,
  onClose,
  record,
  handleUpdate,
}) {
  const getInitialValues = () => {
    if (!record) {
      return {
        date: "",
        workMode: null,
        activity: "",
        hours: "",
      };
    }
    const modeName =
      typeof record.mode === "object" ? record.mode.name : record.mode;
    const workMode =
      workModeOptions.find(
        (o) => o.name.toLowerCase() === (modeName || "").toLowerCase()
      ) || null;

    return {
      date: record.date || "",
      workMode,
      activity: record.activity || "",
      hours:
        record.hours === 0 ? "0" : record.hours?.toString() || "",
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
        Edit Timesheet Entry
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

      <DialogContent sx={{ p: 0 }}>
        <TimesheetForm
          edit={true}
          selectedRecord={record}
          handleSubmit={handleUpdate}
          initialValues={getInitialValues()}
        />
      </DialogContent>
    </Dialog>
  );
}
