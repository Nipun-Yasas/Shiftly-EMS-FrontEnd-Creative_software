"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ReusableTimesheetForm from "./TimesheetForm";

export default function EditTimesheetDialog({ 
  open, 
  onClose, 
  timesheetData = null 
}) {
  const handleSuccess = (data, mode) => {
    // Close dialog on success
    onClose();
    // You can add additional success handling here (e.g., refresh data, show notification)
  };

  const handleCancel = () => {
    console.log("Edit cancelled");
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      
    >
      <DialogTitle sx={{ mt: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Timesheet Entry
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <ReusableTimesheetForm
          mode="edit"
          initialData={timesheetData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          showTitle={false} 
          showSummary={true}
          showActions={true}
        />
      </DialogContent>
    </Dialog>
  );
}
