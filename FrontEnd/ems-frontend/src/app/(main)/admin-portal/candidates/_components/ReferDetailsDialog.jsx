import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

export default function ReferDetailsDialog({ 
  open, 
  onClose, 
  selectedCandidate, 
  onDownloadResume 
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {selectedCandidate ? `${selectedCandidate.firstName} ${selectedCandidate.lastName}` : ''}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
      <DialogActions dividers>
        <Box
                          sx={{
                            justifyContent: { xs: "center", md: "flex-end" },
                            display: "flex",
                            gap: 1,
                            width: "100%",
                          }}
                        >
                            <Button
          startIcon={<DownloadIcon />}
          onClick={() => onDownloadResume(selectedCandidate?.resumeUrl, `${selectedCandidate?.firstName}_${selectedCandidate?.lastName}`)}
          variant="outlined"
        >
          Download Resume
        </Button>
        
        <Button color='text.primary' onClick={onClose} variant="text">
          Close
        </Button>
                        </Box>
        
      </DialogActions>
    </Dialog>
  );
}
