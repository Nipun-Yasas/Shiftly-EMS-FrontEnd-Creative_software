'use client';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  Box,
  Badge
} from '@mui/material';
import dayjs from 'dayjs';
import { API_PATHS } from '../../../_utils/apiPaths';
import axiosInstance from '../../../_utils/axiosInstance';

import TabPanel from '../../../_components/main/TabPanel';
import UnReadTab from './_components/UnReadTab';
import ReadTab from './_components/ReadTab';
import AllTab from './_components/AllTab';
import DetailsDialog from './_components/DetailsDialog';
import ReferDialog from './_components/ReferDialog';

export default function CandidateSubmissionPage() {
  const [tabValue, setTabValue] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openReferDialog, setOpenReferDialog] = useState(false);
  const [referActionType, setReferActionType] = useState('approve');
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

  const handleApproveCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setReferActionType('approve');
    setOpenReferDialog(true);
  };

  const handleRejectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setReferActionType('reject');
    setOpenReferDialog(true);
  };

  const handleConfirmReferAction = async () => {
    if (!selectedCandidate) return;
    
    try {
      // Replace with actual API call
      // await axiosInstance.put(`/api/candidates/${selectedCandidate.id}/${referActionType}`);
      
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === selectedCandidate.id 
            ? { 
                ...candidate, 
                status: referActionType === 'approve' ? 'approved' : 'rejected',
                processedAt: new Date().toISOString(),
                processedBy: 'Current Admin'
              }
            : candidate
        )
      );
      
      showSnackbar(
        `Candidate ${referActionType === 'approve' ? 'approved' : 'rejected'} successfully`, 
        'success'
      );
      
      setOpenReferDialog(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error(`Error ${referActionType}ing candidate:`, error);
      showSnackbar(`Error ${referActionType}ing candidate`, 'error');
    }
  };

  const handleFilterChange = () => {
    setFilterStatus(filterStatus === 'all' ? 'unread' : 'all');
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

    const getFilteredRefers = (status) => {
    if (status === "all") {
      return candidates;
    }
    return candidates.filter((candidate) => candidate.status === status);
  };


  const unreadCount = candidates.filter(c => c.status === 'unread').length;

  const tabProps = {
    candidates: candidates,
    loading,
    onViewDetails: handleViewDetails,
    onMarkAsRead: markAsRead,
    onMarkAsUnread: markAsUnread,
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', width: '100%', }}>

      <Box sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          
          <Tab 
            label={
              <Badge badgeContent={unreadCount} color="error">
                Unread
              </Badge>
            } 
          />
          <Tab 
            label='Read'
          />
          <Tab 
            label='All Submissions'
          />
        </Tabs>

      

      <TabPanel value={tabValue} index={0}>
        <UnReadTab
          {...tabProps} candidates={getFilteredRefers("unread")}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ReadTab
         {...tabProps} candidates={getFilteredRefers("read")}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <AllTab {...tabProps} candidates={getFilteredRefers("all")}
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
        />
      </TabPanel>

      <DetailsDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        selectedCandidate={selectedCandidate}
        onDownloadResume={downloadResume}
      />

      <ReferDialog
        open={openReferDialog}
        onClose={() => setOpenReferDialog(false)}
        selectedCandidate={selectedCandidate}
        actionType={referActionType}
        onConfirm={handleConfirmReferAction}
      />


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
      </Box>
    </Paper>
  );
}
