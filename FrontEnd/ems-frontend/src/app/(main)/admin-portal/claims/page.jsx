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
  Receipt as ClaimIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  DateRange as DateIcon,
  Category as CategoryIcon,
  AttachFile as FileIcon
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
      id={`claim-tabpanel-${index}`}
      aria-labelledby={`claim-tab-${index}`}
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

export default function ClaimsManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState(''); // 'approve' or 'reject'
  const [approvalReason, setApprovalReason] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Sample claims data - replace with actual API calls
  const sampleClaims = [
    {
      id: 1,
      claimId: 'CLM-2025-001',
      employeeName: 'John Smith',
      employeeEmail: 'john.smith@company.com',
      department: 'Engineering',
      claimType: 'Medical',
      description: 'Routine medical checkup and prescription costs',
      amount: 250.00,
      claimDate: '2025-07-10T00:00:00',
      submissionDate: '2025-07-12T14:30:00',
      status: 'pending',
      attachments: ['medical-receipt-001.pdf', 'prescription-receipt.pdf'],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    },
    {
      id: 2,
      claimId: 'CLM-2025-002',
      employeeName: 'Sarah Johnson',
      employeeEmail: 'sarah.johnson@company.com',
      department: 'Marketing',
      claimType: 'Travel',
      description: 'Business trip expenses for client meeting in New York',
      amount: 1200.50,
      claimDate: '2025-07-08T00:00:00',
      submissionDate: '2025-07-09T10:15:00',
      status: 'approved',
      attachments: ['flight-receipt.pdf', 'hotel-receipt.pdf', 'taxi-receipts.pdf'],
      approvedBy: 'Admin User',
      approvedAt: '2025-07-10T11:30:00',
      rejectionReason: null
    },
    {
      id: 3,
      claimId: 'CLM-2025-003',
      employeeName: 'Mike Chen',
      employeeEmail: 'mike.chen@company.com',
      department: 'Sales',
      claimType: 'Meal',
      description: 'Client dinner meeting at expensive restaurant',
      amount: 450.00,
      claimDate: '2025-07-05T00:00:00',
      submissionDate: '2025-07-07T16:45:00',
      status: 'rejected',
      attachments: ['restaurant-receipt.pdf'],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: 'Amount exceeds meal expense policy limit of $200 per person'
    },
    {
      id: 4,
      claimId: 'CLM-2025-004',
      employeeName: 'Emma Davis',
      employeeEmail: 'emma.davis@company.com',
      department: 'HR',
      claimType: 'Office Supplies',
      description: 'Home office equipment for remote work setup',
      amount: 800.00,
      claimDate: '2025-07-11T00:00:00',
      submissionDate: '2025-07-12T09:20:00',
      status: 'pending',
      attachments: ['office-supplies-receipt.pdf', 'equipment-invoice.pdf'],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    },
    {
      id: 5,
      claimId: 'CLM-2025-005',
      employeeName: 'Alex Rodriguez',
      employeeEmail: 'alex.rodriguez@company.com',
      department: 'IT',
      claimType: 'Insurance',
      description: 'Annual health insurance premium reimbursement',
      amount: 1500.00,
      claimDate: '2025-07-01T00:00:00',
      submissionDate: '2025-07-13T08:45:00',
      status: 'pending',
      attachments: ['insurance-policy.pdf', 'payment-confirmation.pdf'],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    }
  ];

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('/api/claims/submissions');
      // setClaims(response.data || []);
      
      // Using sample data for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setClaims(sampleClaims);
    } catch (error) {
      console.error('Error fetching claims:', error);
      showSnackbar('Error fetching claim submissions', 'error');
      setClaims(sampleClaims); // Fallback to sample data
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

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setOpenDetailDialog(true);
  };

  const handleApprovalAction = (claim, action) => {
    setSelectedClaim(claim);
    setApprovalAction(action);
    setApprovalReason('');
    setOpenApprovalDialog(true);
  };

  const submitApprovalAction = async () => {
    if (!selectedClaim || !approvalAction) return;

    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/claims/${selectedClaim.id}/${approvalAction}`, {
      //   reason: approvalReason
      // });

      const updatedStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
      
      setClaims(prev => 
        prev.map(claim => 
          claim.id === selectedClaim.id 
            ? { 
                ...claim, 
                status: updatedStatus,
                approvedBy: approvalAction === 'approve' ? 'Current Admin' : null,
                approvedAt: approvalAction === 'approve' ? new Date().toISOString() : null,
                rejectionReason: approvalAction === 'reject' ? approvalReason : null
              }
            : claim
        )
      );

      showSnackbar(
        `Claim ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`, 
        'success'
      );
      setOpenApprovalDialog(false);
      setOpenDetailDialog(false);
    } catch (error) {
      console.error(`Error ${approvalAction}ing claim:`, error);
      showSnackbar(`Error ${approvalAction}ing claim`, 'error');
    }
  };

  const handleViewHistory = async (claimId) => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get(`/api/claims/${claimId}/action-history`);
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
          notes: 'Approved after verifying receipts'
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
      default: return <ClaimIcon />;
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      claim.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const pendingCount = claims.filter(c => c.status === 'pending').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;
  const rejectedCount = claims.filter(c => c.status === 'rejected').length;

  const claimColumns = [
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
    { field: 'claimId', headerName: 'Claim ID', width: 120 },
    { field: 'employeeName', headerName: 'Employee', width: 150 },
    { field: 'department', headerName: 'Department', width: 120 },
    { field: 'claimType', headerName: 'Type', width: 120 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => `$${params.value?.toFixed(2)}`
    },
    {
      field: 'claimDate',
      headerName: 'Claim Date',
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
              <Tooltip title="Approve Claim">
                <IconButton 
                  size="small" 
                  onClick={() => handleApprovalAction(params.row, 'approve')}
                  color="success"
                >
                  <ApproveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Claim">
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
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Claims Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage employee claim submissions
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label={
                <Badge badgeContent={pendingCount} color="error">
                  Pending Claims
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={approvedCount} color="success">
                  Approved Claims
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={rejectedCount} color="error">
                  Rejected Claims
                </Badge>
              } 
            />
            <Tab label="All Claims" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 300 }}
            />
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
                rows={filteredClaims.filter(c => c.status === 'pending')}
                columns={claimColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                autoHeight={false}
              />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search approved claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 300 }}
            />
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={filteredClaims.filter(c => c.status === 'approved')}
                columns={claimColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                autoHeight={false}
              />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search rejected claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 300 }}
            />
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={filteredClaims.filter(c => c.status === 'rejected')}
                columns={claimColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                autoHeight={false}
              />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search all claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                const nextFilter = filterStatus === 'all' ? 'pending' : 
                                  filterStatus === 'pending' ? 'approved' :
                                  filterStatus === 'approved' ? 'rejected' : 'all';
                setFilterStatus(nextFilter);
              }}
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
                rows={filteredClaims}
                columns={claimColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                autoHeight={false}
              />
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Claim Details Dialog */}
      <Dialog 
        open={openDetailDialog} 
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClaimIcon />
            <Typography variant="h6">
              Claim Details - {selectedClaim?.claimId}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDetailDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClaim && (
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
                        <Typography variant="subtitle1">{selectedClaim.employeeName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedClaim.employeeEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedClaim.department}
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
                      Claim Information
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Type:</Typography>
                      <Typography variant="body1">{selectedClaim.claimType}</Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Amount:</Typography>
                      <Typography variant="h6" color="primary">
                        ${selectedClaim.amount?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Chip
                        icon={getStatusIcon(selectedClaim.status)}
                        label={selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1)}
                        color={getStatusColor(selectedClaim.status)}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {selectedClaim.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Important Dates
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Claim Date:</Typography>
                      <Typography variant="body1">
                        {dayjs(selectedClaim.claimDate).format('MMMM DD, YYYY')}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Submission Date:</Typography>
                      <Typography variant="body1">
                        {dayjs(selectedClaim.submissionDate).format('MMMM DD, YYYY HH:mm')}
                      </Typography>
                    </Box>
                    {selectedClaim.approvedAt && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Approved Date:</Typography>
                        <Typography variant="body1">
                          {dayjs(selectedClaim.approvedAt).format('MMMM DD, YYYY HH:mm')}
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
                      Attachments
                    </Typography>
                    {selectedClaim.attachments?.length > 0 ? (
                      <List dense>
                        {selectedClaim.attachments.map((file, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.light' }}>
                                <FileIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={file} />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" size="small">
                                <VisibilityIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No attachments
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {selectedClaim.rejectionReason && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="subtitle2">Rejection Reason:</Typography>
                    <Typography variant="body2">{selectedClaim.rejectionReason}</Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {selectedClaim?.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => handleApprovalAction(selectedClaim, 'approve')}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => handleApprovalAction(selectedClaim, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => handleViewHistory(selectedClaim?.id)}
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
          {approvalAction === 'approve' ? 'Approve Claim' : 'Reject Claim'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to {approvalAction} claim {selectedClaim?.claimId}?
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
    </Box>
  );
}
