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
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnreadIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Done as DoneIcon,
  Pending as PendingIcon
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
      id={`letter-tabpanel-${index}`}
      aria-labelledby={`letter-tab-${index}`}
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

export default function LetterSubmissionPage() {
  const [tabValue, setTabValue] = useState(0);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [filterType, setFilterType] = useState('all'); // all, specific letter types
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [readHistory, setReadHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Letter types available in the system
  const letterTypes = [
    'EPF/ETF Name Change Letter',
    'Letter for Skill Assessment',
    'Salary Undertaking Letter',
    'Salary Confirmation Letter',
    'Employment Confirmation Letter',
  ];

  // Sample letter data - replace with actual API calls
  const sampleLetters = [
    {
      id: 1,
      employeeName: 'Alice Johnson',
      employeeId: 'EMP001',
      email: 'alice.johnson@company.com',
      department: 'Engineering',
      position: 'Software Engineer',
      letterType: 'Salary Confirmation Letter',
      requestDate: '2025-07-10T14:30:00',
      status: 'unread',
      priority: 'medium',
      reason: 'Required for bank loan application',
      additionalDetails: 'Need this letter urgently for mortgage approval process.',
      readBy: null,
      readAt: null,
      processedBy: null,
      processedAt: null,
      letterContent: null
    },
    {
      id: 2,
      employeeName: 'Bob Smith',
      employeeId: 'EMP002',
      email: 'bob.smith@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      letterType: 'Employment Confirmation Letter',
      requestDate: '2025-07-09T09:15:00',
      status: 'read',
      priority: 'high',
      reason: 'Visa application requirement',
      additionalDetails: 'Needed for work permit renewal in Canada.',
      readBy: 'Admin User',
      readAt: '2025-07-11T10:30:00',
      processedBy: 'HR Manager',
      processedAt: '2025-07-11T15:45:00',
      letterContent: 'This is to certify that Mr. Bob Smith...'
    },
    {
      id: 3,
      employeeName: 'Carol Davis',
      employeeId: 'EMP003',
      email: 'carol.davis@company.com',
      department: 'Design',
      position: 'UX Designer',
      letterType: 'Letter for Skill Assessment',
      requestDate: '2025-07-12T16:45:00',
      status: 'unread',
      priority: 'low',
      reason: 'Professional certification',
      additionalDetails: 'Required for UX certification program enrollment.',
      readBy: null,
      readAt: null,
      processedBy: null,
      processedAt: null,
      letterContent: null
    },
    {
      id: 4,
      employeeName: 'David Wilson',
      employeeId: 'EMP004',
      email: 'david.wilson@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      letterType: 'EPF/ETF Name Change Letter',
      requestDate: '2025-07-08T11:20:00',
      status: 'read',
      priority: 'high',
      reason: 'Legal name change',
      additionalDetails: 'Recently married and need to update EPF records.',
      readBy: 'Admin User',
      readAt: '2025-07-09T08:30:00',
      processedBy: 'HR Administrator',
      processedAt: '2025-07-09T14:15:00',
      letterContent: 'This letter confirms the name change request...'
    }
  ];

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('/api/letters/submissions');
      // setLetters(response.data || []);
      
      // Using sample data for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setLetters(sampleLetters);
    } catch (error) {
      console.error('Error fetching letters:', error);
      showSnackbar('Error fetching letter submissions', 'error');
      setLetters(sampleLetters); // Fallback to sample data
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

  const markAsRead = async (letterId) => {
    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/letters/${letterId}/mark-read`);
      
      setLetters(prev => 
        prev.map(letter => 
          letter.id === letterId 
            ? { 
                ...letter, 
                status: 'read', 
                readBy: 'Current Admin',
                readAt: new Date().toISOString()
              }
            : letter
        )
      );
      showSnackbar('Letter marked as read', 'success');
    } catch (error) {
      console.error('Error marking letter as read:', error);
      showSnackbar('Error marking letter as read', 'error');
    }
  };

  const markAsUnread = async (letterId) => {
    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/letters/${letterId}/mark-unread`);
      
      setLetters(prev => 
        prev.map(letter => 
          letter.id === letterId 
            ? { 
                ...letter, 
                status: 'unread', 
                readBy: null,
                readAt: null
              }
            : letter
        )
      );
      showSnackbar('Letter marked as unread', 'success');
    } catch (error) {
      console.error('Error marking letter as unread:', error);
      showSnackbar('Error marking letter as unread', 'error');
    }
  };

  const handleViewDetails = (letter) => {
    setSelectedLetter(letter);
    setOpenDetailDialog(true);
    
    // Auto-mark as read when viewing details
    if (letter.status === 'unread') {
      markAsRead(letter.id);
    }
  };

  const handleViewHistory = async (letterId) => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get(`/api/letters/${letterId}/read-history`);
      // setReadHistory(response.data || []);
      
      // Sample read history data
      const sampleHistory = [
        {
          id: 1,
          adminName: 'John Doe',
          adminEmail: 'john.doe@company.com',
          readAt: '2025-07-11T10:30:00',
          action: 'marked as read'
        },
        {
          id: 2,
          adminName: 'Jane Smith',
          adminEmail: 'jane.smith@company.com',
          readAt: '2025-07-11T14:15:00',
          action: 'viewed details'
        },
        {
          id: 3,
          adminName: 'HR Manager',
          adminEmail: 'hr.manager@company.com',
          readAt: '2025-07-11T15:45:00',
          action: 'processed letter'
        }
      ];
      
      setReadHistory(sampleHistory);
      setOpenHistoryDialog(true);
    } catch (error) {
      console.error('Error fetching read history:', error);
      showSnackbar('Error fetching read history', 'error');
    }
  };

  const generateLetter = async (letterId) => {
    try {
      // Replace with actual API call to generate letter
      // const response = await axiosInstance.post(`/api/letters/${letterId}/generate`);
      
      setLetters(prev => 
        prev.map(letter => 
          letter.id === letterId 
            ? { 
                ...letter, 
                processedBy: 'Current Admin',
                processedAt: new Date().toISOString(),
                letterContent: `Generated ${letter.letterType} for ${letter.employeeName}...`
              }
            : letter
        )
      );
      showSnackbar('Letter generated successfully', 'success');
    } catch (error) {
      console.error('Error generating letter:', error);
      showSnackbar('Error generating letter', 'error');
    }
  };

  const downloadLetter = (letterId, employeeName, letterType) => {
    // Simulate letter download
    const link = document.createElement('a');
    link.href = `#`; // Replace with actual download URL
    link.download = `${letterType.replace(/\s+/g, '_')}_${employeeName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSnackbar('Letter download started', 'success');
  };

  const filteredLetters = letters.filter(letter => {
    const matchesSearch = 
      letter.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.letterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = 
      filterStatus === 'all' || 
      letter.status === filterStatus;
    
    const matchesTypeFilter = 
      filterType === 'all' || 
      letter.letterType === filterType;
    
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  const unreadCount = letters.filter(l => l.status === 'unread').length;
  const readCount = letters.filter(l => l.status === 'read').length;
  const highPriorityCount = letters.filter(l => l.priority === 'high').length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const letterColumns = [
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'read' ? <CheckCircleIcon /> : <UnreadIcon />}
          label={params.value}
          color={params.value === 'read' ? 'success' : 'warning'}
          size="small"
        />
      )
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getPriorityColor(params.value)}
          size="small"
          variant="outlined"
        />
      )
    },
    { field: 'employeeName', headerName: 'Employee', width: 150 },
    { field: 'employeeId', headerName: 'ID', width: 100 },
    { field: 'letterType', headerName: 'Letter Type', width: 200 },
    { field: 'department', headerName: 'Department', width: 130 },
    {
      field: 'requestDate',
      headerName: 'Requested',
      width: 120,
      renderCell: (params) => dayjs(params.value).format('MMM DD, YYYY')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
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
          <Tooltip title="Read History">
            <IconButton 
              size="small" 
              onClick={() => handleViewHistory(params.row.id)}
              color="info"
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}>
            <IconButton 
              size="small" 
              onClick={() => 
                params.row.status === 'read' 
                  ? markAsUnread(params.row.id)
                  : markAsRead(params.row.id)
              }
              color={params.row.status === 'read' ? 'warning' : 'success'}
            >
              {params.row.status === 'read' ? <VisibilityOffIcon /> : <CheckCircleIcon />}
            </IconButton>
          </Tooltip>
          {params.row.processedAt ? (
            <Tooltip title="Download Letter">
              <IconButton 
                size="small" 
                onClick={() => downloadLetter(params.row.id, params.row.employeeName, params.row.letterType)}
                color="secondary"
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Generate Letter">
              <IconButton 
                size="small" 
                onClick={() => generateLetter(params.row.id)}
                color="primary"
              >
                <AssignmentIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Paper elevation={2} sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Letter Submissions Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Badge badgeContent={unreadCount} color="error">
            <Chip
              icon={<MailIcon />}
              label={`Total: ${letters.length}`}
              color="primary"
              variant="outlined"
            />
          </Badge>
          <Badge badgeContent={highPriorityCount} color="error">
            <Chip
              icon={<PendingIcon />}
              label="High Priority"
              color="error"
              variant="outlined"
            />
          </Badge>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label={
              <Badge badgeContent={letters.length} color="primary">
                All Letters
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={unreadCount} color="error">
                Unread
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={readCount} color="success">
                Read
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={highPriorityCount} color="error">
                High Priority
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search letters..."
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
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="read">Read</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              label="Filter by Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              {letterTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <DataGrid
          rows={filteredLetters}
          columns={letterColumns}
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
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Search unread letters..."
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
        
        <DataGrid
          rows={filteredLetters.filter(l => l.status === 'unread')}
          columns={letterColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          autoHeight
          disableSelectionOnClick
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Search read letters..."
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
        
        <DataGrid
          rows={filteredLetters.filter(l => l.status === 'read')}
          columns={letterColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          autoHeight
          disableSelectionOnClick
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Search high priority letters..."
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
        
        <DataGrid
          rows={filteredLetters.filter(l => l.priority === 'high')}
          columns={letterColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          autoHeight
          disableSelectionOnClick
        />
      </TabPanel>

      {/* Letter Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedLetter ? `Letter Request - ${selectedLetter.employeeName}` : ''}
          </Typography>
          <IconButton onClick={() => setOpenDetailDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedLetter && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Employee Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography><strong>Name:</strong> {selectedLetter.employeeName}</Typography>
                      <Typography><strong>Employee ID:</strong> {selectedLetter.employeeId}</Typography>
                      <Typography><strong>Email:</strong> {selectedLetter.email}</Typography>
                      <Typography><strong>Department:</strong> {selectedLetter.department}</Typography>
                      <Typography><strong>Position:</strong> {selectedLetter.position}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <MailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Request Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography><strong>Letter Type:</strong> {selectedLetter.letterType}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <strong>Priority:</strong>
                        <Chip 
                          label={selectedLetter.priority} 
                          color={getPriorityColor(selectedLetter.priority)} 
                          size="small" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon color="action" />
                        <Typography>
                          Requested: {dayjs(selectedLetter.requestDate).format('MMMM DD, YYYY HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Request Reason
                    </Typography>
                    <Typography sx={{ mb: 2 }}><strong>Reason:</strong> {selectedLetter.reason}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Additional Details:</strong>
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
                      {selectedLetter.additionalDetails}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {selectedLetter.processedAt && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    <Typography>
                      <strong>Processed by:</strong> {selectedLetter.processedBy} on{' '}
                      {dayjs(selectedLetter.processedAt).format('MMMM DD, YYYY HH:mm')}
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {selectedLetter.status === 'read' && selectedLetter.readBy && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography>
                      <strong>Read by:</strong> {selectedLetter.readBy} on{' '}
                      {dayjs(selectedLetter.readAt).format('MMMM DD, YYYY HH:mm')}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {selectedLetter?.processedAt ? (
            <Button
              startIcon={<DownloadIcon />}
              onClick={() => downloadLetter(selectedLetter?.id, selectedLetter?.employeeName, selectedLetter?.letterType)}
              variant="outlined"
              color="secondary"
            >
              Download Letter
            </Button>
          ) : (
            <Button
              startIcon={<AssignmentIcon />}
              onClick={() => generateLetter(selectedLetter?.id)}
              variant="outlined"
              color="primary"
            >
              Generate Letter
            </Button>
          )}
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => handleViewHistory(selectedLetter?.id)}
            variant="outlined"
          >
            View History
          </Button>
          <Button onClick={() => setOpenDetailDialog(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Read History Dialog */}
      <Dialog
        open={openHistoryDialog}
        onClose={() => setOpenHistoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Letter Action History
          </Typography>
        </DialogTitle>
        <DialogContent>
          {readHistory.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              No action history available
            </Typography>
          ) : (
            <List>
              {readHistory.map((history, index) => (
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
                            {history.action} on {dayjs(history.readAt).format('MMMM DD, YYYY HH:mm')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < readHistory.length - 1 && <Divider variant="inset" component="li" />}
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
