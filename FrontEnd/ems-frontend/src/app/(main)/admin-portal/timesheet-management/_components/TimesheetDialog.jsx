import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {selectedEmployee.name}
                    </Typography>
                    <Typography variant="body2">
                      {selectedEmployee.email}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2">
                    <strong>Team:</strong> {selectedEmployee.team}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Project:</strong> {selectedEmployee.project}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2">
                    <strong>Pending Submissions:</strong>{" "}
                    {selectedEmployee.pendingSubmissions}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Updated:</strong> 3 days ago
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Timesheet Entries
            </Typography>

            <TimesheetDataGrid
              data={employeeTimesheets}
              type="timesheet"
              onApprove={onApprove}
              onReject={onReject}
              initialPageSize={5}
              pageSizeOptions={[5, 10]}
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
