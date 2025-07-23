import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import {
  VideoCall,
  ContentCopy,
  CheckCircle,
  Delete,
  OpenInNew,
  History,
  Event,
  Add
} from '@mui/icons-material';
import dayjs from 'dayjs';

const MeetingsHistoryCard = ({ onScheduleMeeting }) => {
  const theme = useTheme();
  const [meetings, setMeetings] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadMeetings();
    const interval = setInterval(loadMeetings, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadMeetings = () => {
    try {
      const savedMeetings = JSON.parse(localStorage.getItem('scheduledMeetings') || '[]');
      setMeetings(savedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    }
  };

  const copyToClipboard = async (link, meetingId) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(meetingId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const deleteMeeting = (meetingId) => {
    try {
      const updatedMeetings = meetings.filter(m => m.id !== meetingId);
      localStorage.setItem('scheduledMeetings', JSON.stringify(updatedMeetings));
      setMeetings(updatedMeetings);
      setDeleteDialogOpen(false);
      setMeetingToDelete(null);
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const openMeetingLink = (link) => {
    window.open(link, '_blank');
  };

  const getMeetingStatus = (startTime, duration) => {
    const now = dayjs();
    const meetingStart = dayjs(startTime);
    const meetingEnd = meetingStart.add(duration || 60, 'minute');

    if (now.isBefore(meetingStart)) {
      return { status: 'upcoming', color: 'primary', text: 'Upcoming' };
    } else if (now.isAfter(meetingEnd)) {
      return { status: 'ended', color: 'default', text: 'Ended' };
    } else {
      return { status: 'ongoing', color: 'success', text: 'Ongoing' };
    }
  };

  const formatMeetingTime = (startTime, duration) => {
    const start = dayjs(startTime);
    const end = start.add(duration, 'minute');
    return {
      date: start.format('MMM DD, YYYY'),
      time: `${start.format('h:mm A')} - ${end.format('h:mm A')}`,
      duration: duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`
    };
  };

  const filterMeetings = (tabIndex) => {
    const now = dayjs();
    switch (tabIndex) {
      case 0: return meetings;
      case 1: return meetings.filter(m => dayjs(m.startTime).isAfter(now));
      case 2: return meetings.filter(m => dayjs(m.startTime).isSame(now, 'day'));
      case 3: return meetings.filter(m => {
        const meetingEnd = dayjs(m.startTime).add(m.duration || 60, 'minute');
        return meetingEnd.isBefore(now);
      });
      default: return meetings;
    }
  };

  const filteredMeetings = filterMeetings(activeTab);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Paper 
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40
              }}
            >
              <History />
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Meetings History
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onScheduleMeeting}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            New Meeting
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 'auto',
                px: 3
              }
            }}
          >
            <Tab label={`All (${meetings.length})`} />
            <Tab label={`Upcoming (${filterMeetings(1).length})`} />
            <Tab label={`Today (${filterMeetings(2).length})`} />
            <Tab label={`Past (${filterMeetings(3).length})`} />
          </Tabs>
        </Box>

        {/* Content */}
        {filteredMeetings.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}>
            <Event sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              {activeTab === 0 && 'No meetings scheduled yet'}
              {activeTab === 1 && 'No upcoming meetings'}
              {activeTab === 2 && 'No meetings today'}
              {activeTab === 3 && 'No past meetings'}
            </Typography>
            {activeTab === 0 && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={onScheduleMeeting}
                sx={{ 
                  mt: 2,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Schedule Your First Meeting
              </Button>
            )}
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredMeetings.map((meeting, index) => {
              const timeInfo = formatMeetingTime(meeting.startTime, meeting.duration);
              const status = getMeetingStatus(meeting.startTime, meeting.duration);
              
              return (
                <React.Fragment key={meeting.id}>
                  <ListItem 
                    sx={{ 
                      px: 0, 
                      py: 2,
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 40,
                          height: 40
                        }}
                      >
                        <VideoCall />
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      sx={{ pr: 12 }}
                      primary={
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 0.5
                        }}>
                          {meeting.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ 
                            color: 'text.secondary',
                            mb: 0.5
                          }}>
                            {timeInfo.date} • {timeInfo.time} • {timeInfo.duration}
                          </Typography>
                          
                          {meeting.description && (
                            <Typography variant="body2" sx={{ 
                              color: 'text.secondary',
                              mb: 1,
                              opacity: 0.8
                            }}>
                              {meeting.description}
                            </Typography>
                          )}
                          
                          <Chip
                            label={status.text}
                            size="small"
                            color={status.color}
                            sx={{ 
                              fontWeight: 500,
                              height: 20
                            }}
                          />
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Copy meeting link">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(meeting.meetLink, meeting.id)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                bgcolor: 'action.hover',
                                color: 'primary.main'
                              }
                            }}
                          >
                            {copiedId === meeting.id ? <CheckCircle /> : <ContentCopy />}
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Open meeting">
                          <IconButton
                            size="small"
                            onClick={() => openMeetingLink(meeting.meetLink)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                bgcolor: 'action.hover',
                                color: 'primary.main'
                              }
                            }}
                          >
                            <OpenInNew />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete meeting">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setMeetingToDelete(meeting);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                bgcolor: 'error.light',
                                color: 'error.main'
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < filteredMeetings.length - 1 && (
                    <Divider sx={{ mx: 0 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Delete Meeting
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{meetingToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => deleteMeeting(meetingToDelete?.id)}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MeetingsHistoryCard; 