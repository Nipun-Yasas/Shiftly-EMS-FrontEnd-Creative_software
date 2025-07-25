'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DialogActions } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { API_PATHS } from "../../../../_utils/apiPaths";
import axiosInstance from "../../../../_utils/axiosInstance";

import TimesheetDataGrid from "./TimesheetDataGrid";

const TimesheetDialog = ({ open, onClose, selectedEmployee, employeeTimesheets, onApprove, onReject, onUpdate }) => {
  const [updatingIds, setUpdatingIds] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleStatusUpdate = async (timesheetId, newStatus) => {
    setUpdatingIds(prev => ({ ...prev, [timesheetId]: true }));
    try {
      const response = await axiosInstance.put(
        `${API_PATHS.TIMESHEETS.UPDATE_STATUS(timesheetId)}?status=${newStatus}`
      );

      if (onUpdate) {
        onUpdate();
      }

      setSnackbar({
        open: true,
        message: `Timesheet ${newStatus.toLowerCase()} successfully!`,
        severity: 'success'
      });

    } catch (error) {
      console.error('Error updating timesheet status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update timesheet status. Please try again.',
        severity: 'error'
      });
    } finally {
      setUpdatingIds(prev => ({ ...prev, [timesheetId]: false }));
    }
  };

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
                <strong>Department:</strong> {selectedEmployee.department || 'N/A'}
              </Typography>
              <Typography>
                <strong>Team:</strong> {selectedEmployee.team || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Total Entries:</strong> {selectedEmployee.totalEntries || employeeTimesheets.length}
              </Typography>
              <Typography variant="body2">
                <strong>Total Hours:</strong> {selectedEmployee.totalHours?.toFixed(1) || '0.0'}
              </Typography>
            </Box>

            <TimesheetDataGrid
              data={employeeTimesheets}
              type="timesheet"
              onApprove={(timesheetId) => handleStatusUpdate(timesheetId, 'APPROVED')}
              onReject={(timesheetId) => handleStatusUpdate(timesheetId, 'REJECTED')}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button color="text.primary" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default TimesheetDialog;
