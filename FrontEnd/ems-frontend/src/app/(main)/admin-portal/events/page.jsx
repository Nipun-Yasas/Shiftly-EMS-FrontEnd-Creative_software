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
  Event as EventIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  AttachMoney as BudgetIcon,
  Category as CategoryIcon
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
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
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

export default function EventSubmissionPage() {
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState(''); // 'approve' or 'reject'
  const [approvalReason, setApprovalReason] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Sample event data - replace with actual API calls
  const sampleEvents = [
    {
      id: 1,
      title: 'Annual Team Building Event',
      organizer: 'Sarah Johnson',
      organizerEmail: 'sarah.johnson@company.com',
      department: 'HR',
      eventType: 'Team Building',
      description: 'A day-long team building event to strengthen collaboration and team spirit among all departments.',
      startDate: '2025-08-15T09:00:00',
      endDate: '2025-08-15T17:00:00',
      location: 'Conference Center A',
      expectedAttendees: 150,
      budget: 5000,
      status: 'pending',
      submissionDate: '2025-07-10T14:30:00',
      requirements: ['Catering for 150 people', 'Audio/Visual equipment', 'Team building activities'],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    },
    {
      id: 2,
      title: 'Product Launch Presentation',
      organizer: 'Mike Chen',
      organizerEmail: 'mike.chen@company.com',
      department: 'Marketing',
      eventType: 'Corporate',
      description: 'Launch presentation for our new product line with stakeholders and media.',
      startDate: '2025-08-20T14:00:00',
      endDate: '2025-08-20T18:00:00',
      location: 'Main Auditorium',
      expectedAttendees: 80,
      budget: 8000,
      status: 'approved',
      submissionDate: '2025-07-08T10:15:00',
      requirements: ['Professional presentation setup', 'Media kit preparation', 'Refreshments'],
      approvedBy: 'Admin User',
      approvedAt: '2025-07-09T11:30:00',
      rejectionReason: null
    },
    {
      id: 3,
      title: 'Quarterly Training Workshop',
      organizer: 'Emma Davis',
      organizerEmail: 'emma.davis@company.com',
      department: 'Training',
      eventType: 'Training',
      description: 'Quarterly skills training workshop for all technical staff.',
      startDate: '2025-09-05T09:00:00',
      endDate: '2025-09-06T16:00:00',
      location: 'Training Room B',
      expectedAttendees: 45,
      budget: 3000,
      status: 'rejected',
      submissionDate: '2025-07-07T16:45:00',
      requirements: ['Training materials', 'Laptop setup for 45 people', 'Coffee breaks'],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: 'Budget constraints for this quarter'
    },
    {
      id: 4,
      title: 'Holiday Celebration Party',
      organizer: 'Alex Rodriguez',
      organizerEmail: 'alex.rodriguez@company.com',
      department: 'HR',
      eventType: 'Social',
      description: 'Annual holiday celebration party for all employees and their families.',
      startDate: '2025-12-20T18:00:00',
      endDate: '2025-12-20T23:00:00',
      location: 'Grand Ballroom',
      expectedAttendees: 300,
      budget: 12000,
      status: 'pending',
      submissionDate: '2025-07-12T09:20:00',
      requirements: ['Dinner for 300 people', 'Entertainment/DJ', 'Decorations', 'Photography'],
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('/api/events/submissions');
      // setEvents(response.data || []);
      
      // Using sample data for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setEvents(sampleEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      showSnackbar('Error fetching event submissions', 'error');
      setEvents(sampleEvents); // Fallback to sample data
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

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setOpenDetailDialog(true);
  };

  const handleApprovalAction = (event, action) => {
    setSelectedEvent(event);
    setApprovalAction(action);
    setApprovalReason('');
    setOpenApprovalDialog(true);
  };

  const submitApprovalAction = async () => {
    if (!selectedEvent || !approvalAction) return;

    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/events/${selectedEvent.id}/${approvalAction}`, {
      //   reason: approvalReason
      // });

      const updatedStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
      
      setEvents(prev => 
        prev.map(event => 
          event.id === selectedEvent.id 
            ? { 
                ...event, 
                status: updatedStatus,
                approvedBy: approvalAction === 'approve' ? 'Current Admin' : null,
                approvedAt: approvalAction === 'approve' ? new Date().toISOString() : null,
                rejectionReason: approvalAction === 'reject' ? approvalReason : null
              }
            : event
        )
      );

      showSnackbar(
        `Event ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`, 
        'success'
      );
      setOpenApprovalDialog(false);
      setOpenDetailDialog(false);
    } catch (error) {
      console.error(`Error ${approvalAction}ing event:`, error);
      showSnackbar(`Error ${approvalAction}ing event`, 'error');
    }
  };

  const handleViewHistory = async (eventId) => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get(`/api/events/${eventId}/action-history`);
      // setActionHistory(response.data || []);
      
      // Sample action history data
      const sampleHistory = [
        {
          id: 1,
          adminName: 'John Doe',
          adminEmail: 'john.doe@company.com',
          action: 'viewed details',
          timestamp: '2025-07-11T10:30:00',
          notes: 'Initial review'
        },
        {
          id: 2,
          adminName: 'Jane Smith',
          adminEmail: 'jane.smith@company.com',
          action: 'approved',
          timestamp: '2025-07-11T14:15:00',
          notes: 'Budget approved by finance team'
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
      default: return <EventIcon />;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      event.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const pendingCount = events.filter(e => e.status === 'pending').length;
  const approvedCount = events.filter(e => e.status === 'approved').length;
  const rejectedCount = events.filter(e => e.status === 'rejected').length;

  const eventColumns = [
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
    { field: 'title', headerName: 'Event Title', width: 200 },
    { field: 'organizer', headerName: 'Organizer', width: 150 },
    { field: 'department', headerName: 'Department', width: 120 },
    { field: 'eventType', headerName: 'Type', width: 120 },
    {
      field: 'startDate',
      headerName: 'Event Date',
      width: 120,
      renderCell: (params) => dayjs(params.value).format('MMM DD, YYYY')
    },
    {
      field: 'expectedAttendees',
      headerName: 'Attendees',
      width: 100,
      align: 'center'
    },
    {
      field: 'budget',
      headerName: 'Budget',
      width: 100,
      renderCell: (params) => `$${params.value?.toLocaleString()}`
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
              <Tooltip title="Approve Event">
                <IconButton 
                  size="small" 
                  onClick={() => handleApprovalAction(params.row, 'approve')}
                  color="success"
                >
                  <ApproveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Event">
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
          <Tooltip title="Action History">
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
    <Paper elevation={2} sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon color="primary" />
          Event Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Badge badgeContent={pendingCount} color="error">
            <Chip
              icon={<EventIcon />}
              label={`Total: ${events.length}`}
              color="primary"
              variant="outlined"
            />
          </Badge>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label={
              <Badge badgeContent={pendingCount} color="error">
                Submitted Events
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={approvedCount + rejectedCount} color="primary">
                Event History
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search events..."
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
            onClick={() => setFilterStatus(filterStatus === 'all' ? 'pending' : 'all')}
          >
            {filterStatus === 'all' ? 'Show All' : 'Show Pending Only'}
          </Button>
        </Box>
        
        <DataGrid
          rows={filteredEvents.filter(e => e.status === 'pending')}
          columns={eventColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          autoHeight
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(233, 10, 77, 0.04)'
            }
          }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search event history..."
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
          <Chip
            label={`Approved: ${approvedCount}`}
            color="success"
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`Rejected: ${rejectedCount}`}
            color="error"
            size="small"
          />
        </Box>
        
        <DataGrid
          rows={filteredEvents.filter(e => e.status !== 'pending')}
          columns={eventColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          autoHeight
          disableSelectionOnClick
        />
      </TabPanel>

      {/* Event Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedEvent ? selectedEvent.title : ''}
          </Typography>
          <IconButton onClick={() => setOpenDetailDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Organizer Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography><strong>Name:</strong> {selectedEvent.organizer}</Typography>
                      <Typography><strong>Email:</strong> {selectedEvent.organizerEmail}</Typography>
                      <Typography><strong>Department:</strong> {selectedEvent.department}</Typography>
                      <Typography>
                        <strong>Submitted:</strong> {dayjs(selectedEvent.submissionDate).format('MMMM DD, YYYY HH:mm')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Event Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon color="action" />
                        <Typography><strong>Type:</strong> {selectedEvent.eventType}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon color="action" />
                        <Typography><strong>Location:</strong> {selectedEvent.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon color="action" />
                        <Typography><strong>Expected Attendees:</strong> {selectedEvent.expectedAttendees}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BudgetIcon color="action" />
                        <Typography><strong>Budget:</strong> ${selectedEvent.budget?.toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Date & Time
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography>
                        <strong>Start:</strong> {dayjs(selectedEvent.startDate).format('MMMM DD, YYYY HH:mm')}
                      </Typography>
                      <Typography>
                        <strong>End:</strong> {dayjs(selectedEvent.endDate).format('MMMM DD, YYYY HH:mm')}
                      </Typography>
                      <Typography>
                        <strong>Duration:</strong> {dayjs(selectedEvent.endDate).diff(dayjs(selectedEvent.startDate), 'hour')} hours
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Status & Approval
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        icon={getStatusIcon(selectedEvent.status)}
                        label={selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                        color={getStatusColor(selectedEvent.status)}
                        size="medium"
                      />
                      {selectedEvent.approvedBy && (
                        <Typography>
                          <strong>Approved by:</strong> {selectedEvent.approvedBy} on{' '}
                          {dayjs(selectedEvent.approvedAt).format('MMMM DD, YYYY HH:mm')}
                        </Typography>
                      )}
                      {selectedEvent.rejectionReason && (
                        <Alert severity="error">
                          <strong>Rejection Reason:</strong> {selectedEvent.rejectionReason}
                        </Alert>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Event Description
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify', mb: 2 }}>
                      {selectedEvent.description}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                      Requirements
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedEvent.requirements?.map((requirement, index) => (
                        <Typography key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          • {requirement}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {selectedEvent?.status === 'pending' && (
            <>
              <Button
                startIcon={<ApproveIcon />}
                onClick={() => handleApprovalAction(selectedEvent, 'approve')}
                variant="contained"
                color="success"
              >
                Approve Event
              </Button>
              <Button
                startIcon={<RejectIcon />}
                onClick={() => handleApprovalAction(selectedEvent, 'reject')}
                variant="contained"
                color="error"
              >
                Reject Event
              </Button>
            </>
          )}
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => handleViewHistory(selectedEvent?.id)}
            variant="outlined"
          >
            View History
          </Button>
          <Button onClick={() => setOpenDetailDialog(false)} variant="contained">
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
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {approvalAction === 'approve' ? <ApproveIcon color="success" /> : <RejectIcon color="error" />}
            {approvalAction === 'approve' ? 'Approve Event' : 'Reject Event'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to {approvalAction} the event "{selectedEvent?.title}"?
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
            />
          )}
          {approvalAction === 'approve' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Approval Notes (Optional)"
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder="Any additional notes or conditions for approval..."
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApprovalDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={submitApprovalAction}
            variant="contained"
            color={approvalAction === 'approve' ? 'success' : 'error'}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Action History
          </Typography>
        </DialogTitle>
        <DialogContent>
          {actionHistory.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              No action history available
            </Typography>
          ) : (
            <List>
              {actionHistory.map((history, index) => (
                <React.Fragment key={history.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {history.adminName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={history.adminName}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {history.adminEmail}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {history.action} on {dayjs(history.timestamp).format('MMMM DD, YYYY HH:mm')}
                          </Typography>
                          {history.notes && (
                            <Typography variant="body2" color="textPrimary">
                              Notes: {history.notes}
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryDialog(false)} variant="contained">
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}