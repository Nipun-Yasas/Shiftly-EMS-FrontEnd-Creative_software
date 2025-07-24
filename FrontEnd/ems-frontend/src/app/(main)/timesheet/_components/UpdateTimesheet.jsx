"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

import TimesheetForm from "./TimesheetForm";

export default function UpdateTimesheet() {
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSuccess = (data, mode) => {
    console.log(`Timesheet ${mode === "edit" ? "updated" : "created"} successfully:`, data);
    // Additional success handling can be added here
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Additional cancel handling can be added here
  };

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <TimesheetForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        showTitle={true}
        showSummary={true}
        showActions={true}
      />
    </Paper>
  );
}
