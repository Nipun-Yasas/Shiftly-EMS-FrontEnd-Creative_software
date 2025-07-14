'use client';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  EventAvailable as LeaveIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Category as CategoryIcon,
  People as CoverIcon,
  ReportProblem as ReportIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { API_PATHS } from '../../../_utils/apiPaths';
import axiosInstance from '../../../_utils/axiosInstance';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function LeavesManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState(''); // 'approve' or 'reject'
  const [approvalReason, setApprovalReason] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Sample leaves data - replace with actual API calls
  const sampleLeaves = [
    {
      id: 1,
      leaveId: 'LV-2025-001',
      employeeName: 'John Smith',
      employeeEmail: 'john.smith@company.com',
      department: 'Engineering',
      leaveType: 'Annual Leave',
      leaveFrom: '2025-07-15T00:00:00',
      leaveTo: '2025-07-19T00:00:00',
      leaveDuration: 5,
      coverPerson: 'Jane Doe',
      reportPerson: 'Mike Johnson',
      reason: 'Family vacation to Europe',
      submissionDate: '2025-07-12T14:30:00',
      status: 'pending',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    },
    {
      id: 2,
      leaveId: 'LV-2025-002',
      employeeName: 'Sarah Johnson',
      employeeEmail: 'sarah.johnson@company.com',
      department: 'Marketing',
      leaveType: 'Sick Leave',
      leaveFrom: '2025-07-14T00:00:00',
      leaveTo: '2025-07-16T00:00:00',
      leaveDuration: 3,
      coverPerson: 'Tom Wilson',
      reportPerson: 'Lisa Brown',
      reason: 'Medical treatment for chronic condition',
      submissionDate: '2025-07-13T09:15:00',
      status: 'approved',
      approvedBy: 'Admin User',
      approvedAt: '2025-07-13T11:30:00',
      rejectionReason: null
    },
    {
      id: 3,
      leaveId: 'LV-2025-003',
      employeeName: 'Mike Chen',
      employeeEmail: 'mike.chen@company.com',
      department: 'Sales',
      leaveType: 'Casual Leave',
      leaveFrom: '2025-07-20T00:00:00',
      leaveTo: '2025-07-20T00:00:00',
      leaveDuration: 1,
      coverPerson: 'Alex Rodriguez',
      reportPerson: 'Emily Davis',
      reason: 'Personal urgent matter',
      submissionDate: '2025-07-12T16:45:00',
      status: 'rejected',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: 'Insufficient casual leave balance remaining'
    },
    {
      id: 4,
      leaveId: 'LV-2025-004',
      employeeName: 'Emma Davis',
      employeeEmail: 'emma.davis@company.com',
      department: 'HR',
      leaveType: 'Maternity Leave',
      leaveFrom: '2025-08-01T00:00:00',
      leaveTo: '2025-11-01T00:00:00',
      leaveDuration: 92,
      coverPerson: 'Lisa Johnson',
      reportPerson: 'Mark Thompson',
      reason: 'Maternity leave for newborn care',
      submissionDate: '2025-07-10T10:20:00',
      status: 'pending',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    },
    {
      id: 5,
      leaveId: 'LV-2025-005',
      employeeName: 'Alex Rodriguez',
      employeeEmail: 'alex.rodriguez@company.com',
      department: 'IT',
      leaveType: 'Vacation Leave',
      leaveFrom: '2025-07-25T00:00:00',
      leaveTo: '2025-07-26T00:00:00',
      leaveDuration: 2,
      coverPerson: 'David Kim',
      reportPerson: 'Jennifer Lee',
      reason: 'Weekend extension for family event',
      submissionDate: '2025-07-13T08:45:00',
      status: 'pending',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    }
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('/api/leaves/submissions');
      // setLeaves(response.data || []);
      
      // Using sample data for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setLeaves(sampleLeaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      showSnackbar('Error fetching leave submissions', 'error');
      setLeaves(sampleLeaves); // Fallback to sample data
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setOpenDetailDialog(true);
  };

  const handleApprovalAction = (leave, action) => {
    setSelectedLeave(leave);
    setApprovalAction(action);
    setApprovalReason('');
    setOpenApprovalDialog(true);
  };

  const submitApprovalAction = async () => {
    if (!selectedLeave || !approvalAction) return;

    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/leaves/${selectedLeave.id}/${approvalAction}`, {
      //   reason: approvalReason
      // });

      const updatedStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
      
      setLeaves(prev => 
        prev.map(leave => 
          leave.id === selectedLeave.id 
            ? { 
                ...leave, 
                status: updatedStatus,
                approvedBy: approvalAction === 'approve' ? 'Current Admin' : null,
                approvedAt: approvalAction === 'approve' ? new Date().toISOString() : null,
                rejectionReason: approvalAction === 'reject' ? approvalReason : null
              }
            : leave
        )
      );

      showSnackbar(
        `Leave ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`, 
        'success'
      );
      setOpenApprovalDialog(false);
      setOpenDetailDialog(false);
    } catch (error) {
      console.error(`Error ${approvalAction}ing leave:`, error);
      showSnackbar(`Error ${approvalAction}ing leave`, 'error');
    }
  };

  const handleViewHistory = async (leaveId) => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get(`/api/leaves/${leaveId}/action-history`);
      // setActionHistory(response.data || []);
      
      // Sample action history data
      const sampleHistory = [
        {
          id: 1,
          adminName: 'John Doe',
          adminEmail: 'john.doe@company.com',
          action: 'viewed details',
          timestamp: '2025-07-12T10:30:00',
          notes: 'Initial review'
        },
        {
          id: 2,
          adminName: 'Jane Smith',
          adminEmail: 'jane.smith@company.com',
          action: 'approved',
          timestamp: '2025-07-12T14:15:00',
          notes: 'Approved after verifying leave balance'
        }
      ];
      
      setActionHistory(sampleHistory);
      setOpenHistoryDialog(true);
    } catch (error) {
      console.error('Error fetching action history:', error);
      showSnackbar('Error fetching action history', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <ApproveIcon />;
      case 'rejected': return <RejectIcon />;
      case 'pending': return <TimeIcon />;
      default: return <LeaveIcon />;
    }
  };

  const getLeaveTypeColor = (leaveType) => {
    switch (leaveType) {
      case 'Annual Leave': return '#D81B60';
      case 'Casual Leave': return '#2563EB';
      case 'Sick Leave': return '#DC2626';
      case 'Maternity Leave': return '#059669';
      case 'Vacation Leave': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.leaveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      leave.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

  const leaveColumns = [
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    { field: 'leaveId', headerName: 'Leave ID', width: 120 },
    { field: 'employeeName', headerName: 'Employee', width: 150 },
    { field: 'department', headerName: 'Department', width: 120 },
    {
      field: 'leaveType',
      headerName: 'Type',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          style={{ 
            backgroundColor: getLeaveTypeColor(params.value),
            color: 'white'
          }}
          size="small"
        />
      )
    },
    {
      field: 'leaveDuration',
      headerName: 'Duration',
      width: 100,
      renderCell: (params) => `${params.value} day${params.value > 1 ? 's' : ''}`
    },
    {
      field: 'leaveFrom',
      headerName: 'From',
      width: 120,
      renderCell: (params) => dayjs(params.value).format('MMM DD, YYYY')
    },
    {
      field: 'leaveTo',
      headerName: 'To',
      width: 120,
      renderCell: (params) => dayjs(params.value).format('MMM DD, YYYY')
    },
    {
      field: 'submissionDate',
      headerName: 'Submitted',
      width: 120,
      renderCell: (params) => dayjs(params.value).format('MMM DD, YYYY')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              onClick={() => handleViewDetails(params.row)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === 'pending' && (
            <>
              <Tooltip title="Approve Leave">
                <IconButton 
                  size="small" 
                  onClick={() => handleApprovalAction(params.row, 'approve')}
                  color="success"
                >
                  <ApproveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Leave">
                <IconButton 
                  size="small" 
                  onClick={() => handleApprovalAction(params.row, 'reject')}
                  color="error"
                >
                  <RejectIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="View History">
            <IconButton 
              size="small" 
              onClick={() => handleViewHistory(params.row.id)}
              color="info"
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
      <><Paper levation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={<Badge badgeContent={pendingCount} color="error">
              Pending Leaves
            </Badge>} />
          <Tab
            label={<Badge badgeContent={approvedCount} color="success">
              Approved Leaves
            </Badge>} />
          <Tab
            label={<Badge badgeContent={rejectedCount} color="error">
              Rejected Leaves
            </Badge>} />
          <Tab label="All Leaves" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search leaves..."
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 300 }} />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')}
          >
            {filterStatus === 'pending' ? 'Show All' : 'Pending Only'}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredLeaves.filter(l => l.status === 'pending')}
              columns={leaveColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              autoHeight={false} />
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search approved leaves..."
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 300 }} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredLeaves.filter(l => l.status === 'approved')}
              columns={leaveColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              autoHeight={false} />
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search rejected leaves..."
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 300 }} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredLeaves.filter(l => l.status === 'rejected')}
              columns={leaveColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              autoHeight={false} />
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search all leaves..."
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 300 }} />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => {
              const nextFilter = filterStatus === 'all' ? 'pending' :
                filterStatus === 'pending' ? 'approved' :
                  filterStatus === 'approved' ? 'rejected' : 'all';
              setFilterStatus(nextFilter);
            } }
          >
            Filter: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredLeaves}
              columns={leaveColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              autoHeight={false} />
          </Box>
        )}
      </TabPanel>
    </Paper><Dialog
      open={openDetailDialog}
      onClose={() => setOpenDetailDialog(false)}
      maxWidth="md"
      fullWidth
    >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LeaveIcon />
            <Typography variant="h6">
              Leave Details - {selectedLeave?.leaveId}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDetailDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLeave && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Employee Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{selectedLeave.employeeName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedLeave.employeeEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedLeave.department}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Leave Information
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Type:</Typography>
                      <Chip
                        label={selectedLeave.leaveType}
                        style={{
                          backgroundColor: getLeaveTypeColor(selectedLeave.leaveType),
                          color: 'white'
                        }}
                        size="small" />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Duration:</Typography>
                      <Typography variant="h6" color="primary">
                        {selectedLeave.leaveDuration} day{selectedLeave.leaveDuration > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Chip
                        icon={getStatusIcon(selectedLeave.status)}
                        label={selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                        color={getStatusColor(selectedLeave.status)}
                        size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Leave Reason
                    </Typography>
                    <Typography variant="body1">
                      {selectedLeave.reason}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Leave Period
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">From:</Typography>
                      <Typography variant="body1">
                        {dayjs(selectedLeave.leaveFrom).format('MMMM DD, YYYY')}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">To:</Typography>
                      <Typography variant="body1">
                        {dayjs(selectedLeave.leaveTo).format('MMMM DD, YYYY')}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Submission Date:</Typography>
                      <Typography variant="body1">
                        {dayjs(selectedLeave.submissionDate).format('MMMM DD, YYYY HH:mm')}
                      </Typography>
                    </Box>
                    {selectedLeave.approvedAt && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Approved Date:</Typography>
                        <Typography variant="body1">
                          {dayjs(selectedLeave.approvedAt).format('MMMM DD, YYYY HH:mm')}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Coverage Details
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Cover Person:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CoverIcon fontSize="small" />
                        <Typography variant="body1">{selectedLeave.coverPerson}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Report to Person:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReportIcon fontSize="small" />
                        <Typography variant="body1">{selectedLeave.reportPerson}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {selectedLeave.rejectionReason && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="subtitle2">Rejection Reason:</Typography>
                    <Typography variant="body2">{selectedLeave.rejectionReason}</Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {selectedLeave?.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => handleApprovalAction(selectedLeave, 'approve')}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => handleApprovalAction(selectedLeave, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => handleViewHistory(selectedLeave?.id)}
          >
            View History
          </Button>
          <Button onClick={() => setOpenDetailDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval/Rejection Dialog */}
      <Dialog 
        open={openApprovalDialog} 
        onClose={() => setOpenApprovalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalAction === 'approve' ? 'Approve Leave' : 'Reject Leave'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to {approvalAction} leave request {selectedLeave?.leaveId}?
          </Typography>
          
          {approvalAction === 'reject' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason"
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              required
              sx={{ mt: 2 }}
            />
          )}
          
          {approvalAction === 'approve' && (
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Approval Notes (Optional)"
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder="Any additional notes..."
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApprovalDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={approvalAction === 'approve' ? 'success' : 'error'}
            onClick={submitApprovalAction}
            disabled={approvalAction === 'reject' && !approvalReason.trim()}
          >
            {approvalAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action History Dialog */}
      <Dialog 
        open={openHistoryDialog} 
        onClose={() => setOpenHistoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Action History
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {actionHistory.length > 0 ? (
            <List>
              {actionHistory.map((action, index) => (
                <React.Fragment key={action.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        {action.adminName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {action.adminName} {action.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(action.timestamp).format('MMM DD, YYYY HH:mm')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {action.adminEmail}
                          </Typography>
                          {action.notes && (
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {action.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < actionHistory.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No action history available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
