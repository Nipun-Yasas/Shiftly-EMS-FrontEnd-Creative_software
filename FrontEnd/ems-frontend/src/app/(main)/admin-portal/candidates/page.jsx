'use client';

import React, { useState, useEffect, useContext } from 'react';
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
import { UserContext } from "../../../context/UserContext";

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
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.REFERRALS.ALL_REFERRALS);
      const transformedData = response.data.map(item => ({
        id: item.id,
        firstName: item.applicantName.split(' ')[0] || '',
        lastName: item.applicantName.split(' ').slice(1).join(' ') || '',
        email: item.applicantEmail,
        position: item.vacancyName || 'N/A',
        department: item.departmentName || 'N/A',
        experience: 'N/A', // Not available in backend
        education: 'N/A', // Not available in backend
        submissionDate: new Date().toISOString(), // Backend doesn't have this field
        status: item.status?.toLowerCase() || 'unread',
        fileUrl: item.fileUrl,
        coverLetter: item.message || '',
        skills: [], // Not available in backend
        expectedSalary: 'N/A', // Not available in backend
        readBy: null,
        readAt: null,
        vacancyId: item.vacancyId,
        userId: item.userId,
        departmentName: item.departmentName
      }));
      setCandidates(transformedData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      showSnackbar('Error fetching candidate submissions', 'error');
      setCandidates([]);
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
      await axiosInstance.put(API_PATHS.REFERRALS.UPDATE_STATUS(candidateId), null, {
        params: { status: 'READ' }  // Backend expects uppercase
      });
      
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { 
                ...candidate, 
                status: 'read',  // Frontend uses lowercase
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
      await axiosInstance.put(API_PATHS.REFERRALS.UPDATE_STATUS(candidateId), null, {
        params: { status: 'UNREAD' }
      });
      
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
      const status = referActionType === 'approve' ? 'APPROVED' : 'REJECTED';
      await axiosInstance.put(API_PATHS.REFERRALS.UPDATE_STATUS(selectedCandidate.id), null, {
        params: { status }
      });
      
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === selectedCandidate.id 
            ? { 
                ...candidate, 
                status: status.toLowerCase(),
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

  const downloadFile = async (candidate) => {
    try {
      if (!candidate.fileUrl) {
        showSnackbar('No file available for download', 'warning');
        return;
      }
      
      // Use axios to download the file with proper headers
      const response = await axiosInstance.get(candidate.fileUrl, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Extract filename from the fileUrl or create a default one
      const filename = candidate.fileUrl.split('/').pop() || 
                     `${candidate.firstName}_${candidate.lastName}_resume.pdf`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSnackbar('File downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading file:', error);
      showSnackbar('Error downloading file. Please try again.', 'error');
    }
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
    onDownloadFile: downloadFile,
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
          <Tab label='Read' />
          <Tab label='All Submissions' />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <UnReadTab
            {...tabProps} 
            candidates={getFilteredRefers("unread")}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ReadTab
            {...tabProps} 
            candidates={getFilteredRefers("read")}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AllTab 
            {...tabProps} 
            candidates={candidates}
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
          />
        </TabPanel>

        <DetailsDialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          selectedCandidate={selectedCandidate}
          onDownloadResume={downloadFile}
        />

        <ReferDialog
          open={openReferDialog}
          onClose={() => setOpenReferDialog(false)}
          selectedCandidate={selectedCandidate}
          actionType={referActionType}
          onConfirm={handleConfirmReferAction}
        />

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
