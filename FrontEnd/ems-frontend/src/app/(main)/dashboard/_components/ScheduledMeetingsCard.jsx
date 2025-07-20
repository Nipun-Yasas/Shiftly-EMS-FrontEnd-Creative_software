import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  People,
  Link,
  ContentCopy,
  CheckCircle,
  Delete,
  OpenInNew,
  Add
} from '@mui/icons-material';
import dayjs from 'dayjs';

const ScheduledMeetingsCard = ({ onScheduleMeeting }) => {
  const theme = useTheme();
  const [meetings, setMeetings] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  useEffect(() => {
    loadMeetings();
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

  const upcomingMeetings = meetings
    .filter(m => dayjs(m.startTime).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.startTime) - dayjs(b.startTime))
    .slice(0, 5);

  return (
    <>
      <Paper elevation={3} sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        width: '100%',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
          : 'background.paper',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'text.primary' }}>
            Scheduled Meetings
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onScheduleMeeting}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              borderRadius: 2,
              fontFamily: 'var(--font-lexend)',
              px: 2
            }}
          >
            Schedule Meeting
          </Button>
        </Box>

        {meetings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <VideoCall sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)', mb: 1 }}>
              No meetings scheduled yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)', mb: 3 }}>
              Click "Schedule Meeting" to create your first meeting
            </Typography>
            <Button
              variant="outlined"
              startIcon={<VideoCall />}
              onClick={onScheduleMeeting}
              sx={{ fontFamily: 'var(--font-lexend)' }}
            >
              Schedule Your First Meeting
            </Button>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {upcomingMeetings.map((meeting, index) => {
              const timeInfo = formatMeetingTime(meeting.startTime, meeting.duration);
              const status = getMeetingStatus(meeting.startTime, meeting.duration);
              
              return (
                <React.Fragment key={meeting.id}>
                  <ListItem 
                    sx={{ 
                      px: 0, 
                      py: 2,
                      '&:hover': { bgcolor: 'action.hover', borderRadius: 1 }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <VideoCall color="primary" />
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ 
                          fontFamily: 'var(--font-lexend)', 
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
                            fontFamily: 'var(--font-lexend)',
                            mb: 0.5
                          }}>
                            {timeInfo.date} • {timeInfo.time} • {timeInfo.duration}
                          </Typography>
                          
                          {meeting.description && (
                            <Typography variant="caption" sx={{ 
                              color: 'text.secondary',
                              fontFamily: 'var(--font-lexend)',
                              display: 'block',
                              mb: 1
                            }}>
                              {meeting.description}
                            </Typography>
                          )}
                          
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={status.text}
                              size="small"
                              color={status.color}
                              sx={{ fontFamily: 'var(--font-lexend)' }}
                            />
                            {meeting.attendees && (
                              <Chip
                                icon={<People />}
                                label={`${meeting.attendees.split(',').length} attendees`}
                                size="small"
                                variant="outlined"
                                sx={{ fontFamily: 'var(--font-lexend)' }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(meeting.meetLink, meeting.id)}
                          color="primary"
                          title="Copy meeting link"
                        >
                          {copiedId === meeting.id ? <CheckCircle /> : <ContentCopy />}
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => openMeetingLink(meeting.meetLink)}
                          color="primary"
                          title="Open meeting"
                        >
                          <OpenInNew />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => {
                            setMeetingToDelete(meeting);
                            setDeleteDialogOpen(true);
                          }}
                          color="error"
                          title="Delete meeting"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < upcomingMeetings.length - 1 && (
                    <Divider sx={{ mx: 0 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}

        {meetings.length > 5 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>
              Showing 5 of {meetings.length} meetings
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
          Delete Meeting
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-lexend)' }}>
            Are you sure you want to delete "{meetingToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontFamily: 'var(--font-lexend)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => deleteMeeting(meetingToDelete?.id)}
            color="error"
            variant="contained"
            sx={{ fontFamily: 'var(--font-lexend)' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScheduledMeetingsCard; 