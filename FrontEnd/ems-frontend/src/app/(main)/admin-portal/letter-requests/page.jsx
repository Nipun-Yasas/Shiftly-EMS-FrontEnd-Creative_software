'use client';

import React, { useState, useEffect, useContext } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
  Card,
  CardContent,
  Stack,
  useTheme
} from '@mui/material';
import {
  Visibility,
  Edit,
  Check,
  Close,
  Refresh,
  Download,
  Send,
  AssignmentTurnedIn
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import { UserContext } from '../../../context/UserContext';
import useLetterRequests from '../../../_hooks/useLetterRequests';
import { getStatusColor } from '../_helpers/colorhelper';

const LetterRequestsManagement = () => {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const {
    letterRequests,
    loading,
    error,
    getAllLetterRequests,
    getLetterRequestsForAdmin,
    updateLetterRequestStatus,
    generateLetter,
    refreshLetterRequests,
    clearError
  } = useLetterRequests();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    generated: 0
  });

  // Check if user is super admin
  const isSuperAdmin = user?.roles?.some(role => 
    role.toLowerCase() === 'super_admin' || role.toLowerCase() === 'superadmin'
  );

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadRequests = async () => {
    try {
      clearError();
      if (isSuperAdmin) {
        await getAllLetterRequests();
      } else {
        const adminUserId = user?.id;
        if (adminUserId) {
          await getLetterRequestsForAdmin(adminUserId);
        }
      }
    } catch (err) {
      console.error('Failed to load letter requests:', err);
      showSnackbar(error || 'Failed to load letter requests', 'error');
    }
  };

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  useEffect(() => {
    if (letterRequests) {
      updateStats(letterRequests);
    }
  }, [letterRequests]);

  const updateStats = (requests = []) => {
    const total = requests.length;
    const pending = requests.filter(r => r.status?.toLowerCase() === 'pending').length;
    const approved = requests.filter(r => r.status?.toLowerCase() === 'approved').length;
    const rejected = requests.filter(r => r.status?.toLowerCase() === 'rejected').length;
    const generated = requests.filter(r => r.status?.toLowerCase() === 'generated').length;
    
    setStats({ total, pending, approved, rejected, generated });
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleStatusChange = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status || 'pending');
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedRequest || !newStatus) return;

    try {
      await updateLetterRequestStatus(selectedRequest.id, newStatus);
      showSnackbar(`Request status updated to ${newStatus}`, 'success');
      setStatusDialogOpen(false);
      setSelectedRequest(null);
      setNewStatus('');
    } catch (err) {
      console.error('Failed to update status:', err);
      showSnackbar(error || 'Failed to update status', 'error');
    }
  };

  const handleGenerateLetter = async (request) => {
    try {
      const result = await generateLetter(request.id);
      showSnackbar('Letter generated successfully', 'success');
      
      // Download the letter if result contains content
      if (result && typeof result === 'string') {
        const blob = new Blob([result], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${request.letterType?.replace(/\s+/g, '_')}_${dayjs().format('YYYYMMDD_HHmm')}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
      
      await loadRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to generate letter:', err);
      showSnackbar(error || 'Failed to generate letter', 'error');
    }
  };

  const getStatusChip = (status) => {
    const color = getStatusColor(status);
    const statusText = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Unknown';
    
    return (
      <Chip
        label={statusText}
        size="small"
        sx={{
          backgroundColor: color,
          color: 'white',
          fontWeight: 'medium'
        }}
      />
    );
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'letterType',
      headerName: 'Letter Type',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'employeeName',
      headerName: 'Employee',
      width: 150,
      valueGetter: (params) => {
        // You might need to join with employee data to get name
        return params.row.employeeId ? `Employee ${params.row.employeeId}` : 'Unknown';
      },
    },
    {
      field: 'requestedAt',
      headerName: 'Requested Date',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : '-'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewRequest(params.row)}
              sx={{ color: theme.palette.primary.main }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Update Status">
            <IconButton
              size="small"
              onClick={() => handleStatusChange(params.row)}
              sx={{ color: theme.palette.warning.main }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Generate Letter">
            <IconButton
              size="small"
              onClick={() => handleGenerateLetter(params.row)}
              disabled={params.row.status?.toLowerCase() !== 'approved'}
              sx={{ color: theme.palette.success.main }}
            >
              <AssignmentTurnedIn fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Letter Requests Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadRequests}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Stats Cards */}
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
          <Card sx={{ minWidth: 120, backgroundColor: theme.palette.grey[50] }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 120, backgroundColor: '#fff3e0' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 120, backgroundColor: '#e8f5e8' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 120, backgroundColor: '#ffebee' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {/* Data Grid */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <DataGrid
          rows={letterRequests || []}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.grey[50],
              borderBottom: `2px solid ${theme.palette.divider}`,
            },
          }}
        />
      </Paper>

      {/* View Request Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Letter Request Details
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Letter Type"
                value={selectedRequest.letterType || ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Employee ID"
                value={selectedRequest.employeeId || ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Status"
                value={selectedRequest.status || ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Requested Date"
                value={selectedRequest.requestedAt ? dayjs(selectedRequest.requestedAt).format('YYYY-MM-DD HH:mm') : ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Additional Details"
                value={selectedRequest.additionalDetails || 'No additional details'}
                InputProps={{ readOnly: true }}
                multiline
                rows={3}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Request Status
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="generated">Generated</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmStatusChange}
            variant="contained"
            disabled={!newStatus || newStatus === selectedRequest?.status}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LetterRequestsManagement;
