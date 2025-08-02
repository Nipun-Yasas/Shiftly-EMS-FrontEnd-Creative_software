'use client';

import { useState, useMemo, useEffect } from "react";
import { usePathname } from 'next/navigation';
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box, Typography,Snackbar, Alert } from "@mui/material";
import { IconButton, Tooltip, Dialog, DialogTitle, DialogActions, Button, DialogContent, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from "@mui/icons-material";

export default function LeaveHistory() {
  const pathname = usePathname();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [attribute, setAttribute] = useState("Leave To");
  // Delete dialog state
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // Edit dialog state
  const [leaveToEdit, setLeaveToEdit] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ leave_type: '', leave_from: '', leave_to: '', reason: '', cover_person: '', leave_status: '' });
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [rejectedLeaves, setRejectedLeaves] = useState(0);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [recentlyUpdated, setRecentlyUpdated] = useState(new Set());

  useEffect(() => {
    // Initial load
    fetchLeaveHistory();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchLeaveHistory(true); // Silent refresh
    }, 30000); // Poll every 30 seconds
    
    setPollingInterval(interval);

    // Cleanup on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [pathname]);

  // Cleanup polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const fetchLeaveHistory = (silent = false) => {
    if (!silent) setLoading(true);
    
    axiosInstance.get(API_PATHS.LEAVES.GET_MY_LEAVES)
      .then((res) => {
        // Map backend data to DataGrid row format
        const mappedRows = res.data.map((leave) => ({
          id: leave.id,
          leave_type: leave.leaveType || '',
          leave_from: leave.leaveFrom || '',
          leave_to: leave.leaveTo || '',
          reason: leave.reason || '',
          cover_person: leave.coverPersonName || '',
          report_to: leave.reportToName || '',
          leave_status: leave.leaveStatus || '',
        }));
        
        // Check if there are any status changes for notifications
        if (silent && rows.length > 0) {
          checkForStatusUpdates(rows, mappedRows);
        }
        
        setRows(mappedRows);
        updateLeaveCounts(mappedRows);
        if (!silent) setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch leave history:", err);
        if (!silent) {
          setError("Failed to fetch leave history");
          setLoading(false);
        }
      });
  };

  // Check for status changes and show notifications
  const checkForStatusUpdates = (oldRows, newRows) => {
    const updatedIds = new Set();
    
    oldRows.forEach(oldLeave => {
      const newLeave = newRows.find(newL => newL.id === oldLeave.id);
      if (newLeave && oldLeave.leave_status !== newLeave.leave_status) {
        updatedIds.add(newLeave.id);
        
        // Status changed - show notification
        const statusText = newLeave.leave_status.toLowerCase();
        const message = `Your leave request has been ${statusText}`;
        
        // Show toast notification
        const severity = statusText === 'approved' ? 'success' : statusText === 'rejected' ? 'error' : 'info';
        showSnackbar(message, severity);
        
        // Optional: Show browser notification if permission is granted
        if (Notification.permission === 'granted') {
          new Notification('Leave Status Update', {
            body: message,
            icon: '/shiftly-logo.png'
          });
        }
      }
    });
    
    // Update recently updated set
    if (updatedIds.size > 0) {
      setRecentlyUpdated(updatedIds);
      // Clear the highlight after 10 seconds
      setTimeout(() => {
        setRecentlyUpdated(new Set());
      }, 10000);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Function to update leave counts
  const updateLeaveCounts = (leaves) => {
    const total = leaves.length;
    const pending = leaves.filter(leave => leave.leave_status?.toLowerCase() === 'pending').length;
    const approved = leaves.filter(leave => leave.leave_status?.toLowerCase() === 'approved').length;
    const rejected = leaves.filter(leave => leave.leave_status?.toLowerCase() === 'rejected').length;
    
    setTotalLeaves(total);
    setPendingLeaves(pending);
    setApprovedLeaves(approved);
    setRejectedLeaves(rejected);
  };

  // Delete logic
  const handleDelete = (row) => {
    setLeaveToDelete(row);
    setDeleteConfirmOpen(true);
  };
  const confirmDelete = () => {
    axiosInstance.delete(API_PATHS.LEAVES.DELETE_MY_LEAVE(leaveToDelete.id))
      .then(() => {
        const updatedRows = rows.filter((r) => r.id !== leaveToDelete.id);
        setRows(updatedRows);
        updateLeaveCounts(updatedRows);
        setDeleteConfirmOpen(false);
        setLeaveToDelete(null);
      })
      .catch(() => {
        setError("Failed to delete leave");
        setDeleteConfirmOpen(false);
      });
  };

  // Edit logic
  const handleEdit = (row) => {
    setLeaveToEdit(row);
    setEditForm({
      leave_type: row.leave_type,
      leave_from: row.leave_from,
      leave_to: row.leave_to,
      reason: row.reason,
      cover_person: row.cover_person,
      leave_status: row.leave_status,
    });
    setEditDialogOpen(true);
  };
  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };
  const confirmEdit = () => {
    // Prepare payload for backend
    const payload = {
      leaveType: editForm.leave_type,
      leaveFrom: editForm.leave_from,
      leaveTo: editForm.leave_to,
      reason: editForm.reason,
      coverPersonName: editForm.cover_person,
      leaveStatus: editForm.leave_status,
    };
    axiosInstance.put(API_PATHS.LEAVES.UPDATE_MY_LEAVE(leaveToEdit.id), payload)
      .then((res) => {
        const updatedRows = rows.map((r) => r.id === leaveToEdit.id ? {
          ...r,
          leave_type: res.data.leaveType,
          leave_from: res.data.leaveFrom,
          leave_to: res.data.leaveTo,
          reason: res.data.reason,
          cover_person: res.data.coverPersonName,
          leave_status: res.data.leaveStatus,
        } : r);
        setRows(updatedRows);
        updateLeaveCounts(updatedRows);
        setEditDialogOpen(false);
        setLeaveToEdit(null);
      })
      .catch(() => {
        setError("Failed to update leave");
        setEditDialogOpen(false);
      });
  };

  const attributeMap = {
    "Leave Id": "id",
    "Leave Type": "leave_type",
    "Leave From": "leave_from",
    "Leave To": "leave_to",
    "Cover Person": "cover_person",
    Status: "leave_status",
  };

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    const field = attributeMap[attribute];
    return rows.filter((row) =>
      row[field]?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, attribute, rows]);

  // Columns with working actions
  const columns = [
    { field: "leave_type", headerName: "Leave Type", width: 150, renderCell: (params) => (<span>{params.value}</span>), },
    { field: "leave_from", headerName: "Leave From", width: 150 },
    { field: "leave_to", headerName: "Leave To", width: 150 },
    { field: "reason", headerName: "Reason", width: 150 },
    { field: "cover_person", headerName: "Cover Person", width: 150 },
    { field: "leave_status", headerName: "Status", width: 150, renderCell: (params) => (
      <span
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.875rem",
          fontWeight: 500,
          textAlign: "center",
          backgroundColor: params.value === "Approved" ? "#dcedc8" : params.value === "Rejected" ? "#ffcdd2" : "#fff3e0",
          color: params.value === "Approved" ? "#388e3c" : params.value === "Rejected" ? "#d32f2f" : "#f57c00",
        }}
      >
        {params.value}
      </span>
    ), },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 90,
      renderCell: (params) => {
        const isPending = params.row.leave_status?.toLowerCase() === 'pending';
        
        if (!isPending) {
          // Show no actions for approved or rejected leaves
          return (
            <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
              <span style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                No actions
              </span>
            </Box>
          );
        }

        return (
          <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color: "primary.main" }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => handleDelete(params.row)} sx={{ color: "error.main" }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        {/* Leave Statistics */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#e3f2fd',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1976d2' }}>
                {totalLeaves}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Leaves</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#fff3e0',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f57c00' }}>
                {pendingLeaves}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Pending</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#dcedc8',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#388e3c' }}>
                {approvedLeaves}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Approved</div>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#ffcdd2',
              minWidth: 120,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d32f2f' }}>
                {rejectedLeaves}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Rejected</div>
            </Box>
          </Box>

          {/* Refresh Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Auto-refresh: 30s
            </Typography>
            <Tooltip title="Refresh Leave History">
              <IconButton 
                onClick={() => fetchLeaveHistory()} 
                disabled={loading}
                sx={{ color: 'primary.main' }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          height="auto"
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowClassName={(params) => {
            return recentlyUpdated.has(params.row.id) ? 'recently-updated-row' : '';
          }}
          sx={{
            '& .recently-updated-row': {
              backgroundColor: '#f3e5f5',
              animation: 'pulse 2s infinite',
            },
            '@keyframes pulse': {
              '0%': {
                backgroundColor: '#f3e5f5',
              },
              '50%': {
                backgroundColor: '#e1bee7',
              },
              '100%': {
                backgroundColor: '#f3e5f5',
              },
            },
          }}
        />
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Are you sure you want to delete this leave?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Leave</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={editForm.leave_type}
                onChange={e => handleEditFormChange('leave_type', e.target.value)}
                label="Leave Type"
              >
                <MenuItem value="SICK">Sick</MenuItem>
                <MenuItem value="CASUAL">Casual</MenuItem>
                <MenuItem value="MATERNITY">Maternity</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Leave From"
              type="date"
              value={editForm.leave_from}
              onChange={e => handleEditFormChange('leave_from', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Leave To"
              type="date"
              value={editForm.leave_to}
              onChange={e => handleEditFormChange('leave_to', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Reason"
              value={editForm.reason}
              onChange={e => handleEditFormChange('reason', e.target.value)}
              fullWidth
            />
            <TextField
              label="Cover Person"
              value={editForm.cover_person}
              onChange={e => handleEditFormChange('cover_person', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.leave_status}
                onChange={e => handleEditFormChange('leave_status', e.target.value)}
                label="Status"
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
        
        {/* Toast Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}