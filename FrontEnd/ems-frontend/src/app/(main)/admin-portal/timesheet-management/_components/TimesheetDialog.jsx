import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import TimesheetDataGrid from "./TimesheetDataGrid";

export default function TimesheetDialog({
  open,
  onClose,
  selectedEmployee,
  employeeTimesheets,
  onApprove,
  onReject,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {selectedEmployee && (
        <>
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Timesheet Records: {selectedEmployee.name}
              </Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Typography>
                <strong>Team:</strong> {selectedEmployee.team}
              </Typography>
              <Typography variant="body2">
                <strong>Project:</strong> {selectedEmployee.project}
              </Typography>
            </Box>

            <TimesheetDataGrid
              data={employeeTimesheets}
              type="timesheet"
              onApprove={onApprove}
              onReject={onReject}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button color="text.primary" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
