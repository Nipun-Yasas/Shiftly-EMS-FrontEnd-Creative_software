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
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnreadIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Close as CloseIcon,
  FilterList as FilterIcon
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
      id={`candidate-tabpanel-${index}`}
      aria-labelledby={`candidate-tab-${index}`}
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

export default function CandidateSubmissionPage() {
  const [tabValue, setTabValue] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [readHistory, setReadHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Sample candidate data - replace with actual API calls
  const sampleCandidates = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1234567890',
      position: 'Software Engineer',
      department: 'Engineering',
      experience: '3 years',
      education: 'Bachelor in Computer Science',
      submissionDate: '2025-07-10T14:30:00',
      status: 'unread',
      resumeUrl: '/resumes/alice_johnson_resume.pdf',
      coverLetter: 'I am excited to apply for the Software Engineer position...',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      expectedSalary: '$75,000',
      readBy: null,
      readAt: null
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@email.com',
      phone: '+1987654321',
      position: 'Marketing Manager',
      department: 'Marketing',
      experience: '5 years',
      education: 'MBA in Marketing',
      submissionDate: '2025-07-09T09:15:00',
      status: 'read',
      resumeUrl: '/resumes/bob_smith_resume.pdf',
      coverLetter: 'With my extensive marketing background...',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
      expectedSalary: '$85,000',
      readBy: 'Admin User',
      readAt: '2025-07-11T10:30:00'
    },
    {
      id: 3,
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@email.com',
      phone: '+1122334455',
      position: 'UX Designer',
      department: 'Design',
      experience: '4 years',
      education: 'Bachelor in Design',
      submissionDate: '2025-07-12T16:45:00',
      status: 'unread',
      resumeUrl: '/resumes/carol_davis_resume.pdf',
      coverLetter: 'As a passionate UX designer with 4 years of experience...',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      expectedSalary: '$70,000',
      readBy: null,
      readAt: null
    }
  ];

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('/api/candidates/submissions');
      // setCandidates(response.data || []);
      
      // Using sample data for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setCandidates(sampleCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      showSnackbar('Error fetching candidate submissions', 'error');
      setCandidates(sampleCandidates); // Fallback to sample data
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

  const markAsRead = async (candidateId) => {
    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/candidates/${candidateId}/mark-read`);
      
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { 
                ...candidate, 
                status: 'read', 
                readBy: 'Current Admin',
                readAt: new Date().toISOString()
              }
            : candidate
        )
      );
      showSnackbar('Candidate marked as read', 'success');
    } catch (error) {
      console.error('Error marking candidate as read:', error);
      showSnackbar('Error marking candidate as read', 'error');
    }
  };

  const markAsUnread = async (candidateId) => {
    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/candidates/${candidateId}/mark-unread`);
      
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { 
                ...candidate, 
                status: 'unread', 
                readBy: null,
                readAt: null
              }
            : candidate
        )
      );
      showSnackbar('Candidate marked as unread', 'success');
    } catch (error) {
      console.error('Error marking candidate as unread:', error);
      showSnackbar('Error marking candidate as unread', 'error');
    }
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDetailDialog(true);
    
    // Auto-mark as read when viewing details
    if (candidate.status === 'unread') {
      markAsRead(candidate.id);
    }
  };

  const handleViewHistory = async (candidateId) => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get(`/api/candidates/${candidateId}/read-history`);
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
        }
      ];
      
      setReadHistory(sampleHistory);
      setOpenHistoryDialog(true);
    } catch (error) {
      console.error('Error fetching read history:', error);
      showSnackbar('Error fetching read history', 'error');
    }
  };

  const downloadResume = (resumeUrl, candidateName) => {
    // Create a temporary link to download the resume
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${candidateName}_resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSnackbar('Resume download started', 'success');
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      candidate.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = candidates.filter(c => c.status === 'unread').length;
  const readCount = candidates.filter(c => c.status === 'read').length;

  const candidateColumns = [
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
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'position', headerName: 'Position', width: 150 },
    { field: 'department', headerName: 'Department', width: 130 },
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
        </Box>
      )
    }
  ];

  return (
    <Paper elevation={2} sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Badge badgeContent={unreadCount} color="error">
            <Chip
              icon={<PersonIcon />}
              label={`Total: ${candidates.length}`}
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
              <Badge badgeContent={candidates.length} color="primary">
                All Submissions
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
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search candidates..."
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
            onClick={() => setFilterStatus(filterStatus === 'all' ? 'unread' : 'all')}
          >
            {filterStatus === 'all' ? 'Show All' : 'Show Unread Only'}
          </Button>
        </Box>
        
        <DataGrid
          rows={filteredCandidates}
          columns={candidateColumns}
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
            placeholder="Search unread candidates..."
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
          rows={filteredCandidates.filter(c => c.status === 'unread')}
          columns={candidateColumns}
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
            placeholder="Search read candidates..."
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
          rows={filteredCandidates.filter(c => c.status === 'read')}
          columns={candidateColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          autoHeight
          disableSelectionOnClick
        />
      </TabPanel>

      {/* Candidate Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedCandidate ? `${selectedCandidate.firstName} ${selectedCandidate.lastName}` : ''}
          </Typography>
          <IconButton onClick={() => setOpenDetailDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Personal Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="action" />
                        <Typography>{selectedCandidate.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="action" />
                        <Typography>{selectedCandidate.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon color="action" />
                        <Typography>
                          Submitted: {dayjs(selectedCandidate.submissionDate).format('MMMM DD, YYYY HH:mm')}
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
                      <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Position Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon color="action" />
                        <Typography>{selectedCandidate.position} - {selectedCandidate.department}</Typography>
                      </Box>
                      <Typography><strong>Experience:</strong> {selectedCandidate.experience}</Typography>
                      <Typography><strong>Expected Salary:</strong> {selectedCandidate.expectedSalary}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Education & Skills
                    </Typography>
                    <Typography sx={{ mb: 2 }}><strong>Education:</strong> {selectedCandidate.education}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedCandidate.skills?.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Cover Letter
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
                      {selectedCandidate.coverLetter}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {selectedCandidate.status === 'read' && selectedCandidate.readBy && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography>
                      <strong>Read by:</strong> {selectedCandidate.readBy} on{' '}
                      {dayjs(selectedCandidate.readAt).format('MMMM DD, YYYY HH:mm')}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => downloadResume(selectedCandidate?.resumeUrl, `${selectedCandidate?.firstName}_${selectedCandidate?.lastName}`)}
            variant="outlined"
          >
            Download Resume
          </Button>
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => handleViewHistory(selectedCandidate?.id)}
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
            Read History
          </Typography>
        </DialogTitle>
        <DialogContent>
          {readHistory.length === 0 ? (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
              No read history available
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
