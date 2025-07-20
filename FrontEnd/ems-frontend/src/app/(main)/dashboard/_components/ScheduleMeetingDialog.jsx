import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Chip,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
  Divider
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  People,
  Description,
  Link,
  ContentCopy,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ScheduleMeetingDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    startTime: dayjs().add(1, 'hour'),
    endTime: dayjs().add(2, 'hour'),
    attendees: '',
    meetingType: 'google-meet',
    duration: 60
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setMeetingData({
        title: '',
        description: '',
        startTime: dayjs().add(1, 'hour'),
        endTime: dayjs().add(2, 'hour'),
        attendees: '',
        meetingType: 'google-meet',
        duration: 60
      });
      setGeneratedLink('');
      setCopied(false);
      setErrors({});
    }
  }, [open]);

  // Update end time when start time or duration changes
  useEffect(() => {
    const newEndTime = meetingData.startTime.add(meetingData.duration, 'minute');
    setMeetingData(prev => ({ ...prev, endTime: newEndTime }));
  }, [meetingData.startTime, meetingData.duration]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!meetingData.title.trim()) {
      newErrors.title = 'Meeting title is required';
    }
    
    if (meetingData.startTime.isBefore(dayjs())) {
      newErrors.startTime = 'Start time cannot be in the past';
    }
    
    if (meetingData.duration < 15) {
      newErrors.duration = 'Meeting must be at least 15 minutes';
    }
    
    if (meetingData.duration > 480) {
      newErrors.duration = 'Meeting cannot exceed 8 hours';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateGoogleMeetLink = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      // Generate a unique meeting ID
      const meetingId = generateMeetingId();
      
      // Create Google Meet link
      const meetLink = `https://meet.google.com/${meetingId}`;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGeneratedLink(meetLink);
      
      // Save meeting to localStorage
      saveMeetingToStorage({
        id: Date.now(),
        ...meetingData,
        meetLink,
        meetingId,
        createdAt: dayjs().toISOString(),
        status: 'scheduled'
      });
      
    } catch (error) {
      console.error('Error generating meeting link:', error);
      setErrors({ general: 'Failed to generate meeting link. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMeetingId = () => {
    // Generate a Google Meet-like ID (3 letters, 4 letters, 3 letters)
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${part1}-${part2}-${part3}`;
  };

  const saveMeetingToStorage = (meeting) => {
    try {
      const existingMeetings = JSON.parse(localStorage.getItem('scheduledMeetings') || '[]');
      existingMeetings.push(meeting);
      localStorage.setItem('scheduledMeetings', JSON.stringify(existingMeetings));
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setMeetingData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getDurationOptions = () => {
    const options = [];
    for (let i = 15; i <= 480; i += 15) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const label = hours > 0 
        ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim()
        : `${minutes}m`;
      options.push({ value: i, label });
    }
    return options;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: 'var(--font-poppins)', 
        fontWeight: 600,
        color: 'text.primary',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoCall color="primary" />
          <Typography variant="h6">Schedule Meeting</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Meeting Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Meeting Title"
                value={meetingData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VideoCall color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontFamily: 'var(--font-lexend)'
                  }
                }}
              />
              
              <TextField
                label="Description (Optional)"
                value={meetingData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontFamily: 'var(--font-lexend)'
                  }
                }}
              />

              <TextField
                label="Attendees (Optional)"
                value={meetingData.attendees}
                onChange={(e) => handleInputChange('attendees', e.target.value)}
                fullWidth
                placeholder="Enter email addresses separated by commas"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontFamily: 'var(--font-lexend)'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Time and Duration */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Time"
                  value={meetingData.startTime}
                  onChange={(value) => handleInputChange('startTime', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.startTime}
                      helperText={errors.startTime}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Schedule color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontFamily: 'var(--font-lexend)'
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>

              <FormControl fullWidth>
                <InputLabel sx={{ fontFamily: 'var(--font-lexend)' }}>Duration</InputLabel>
                <Select
                  value={meetingData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  label="Duration"
                  error={!!errors.duration}
                  sx={{
                    borderRadius: 2,
                    fontFamily: 'var(--font-lexend)'
                  }}
                >
                  {getDurationOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontFamily: 'var(--font-lexend)' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontFamily: 'var(--font-lexend)', color: 'text.secondary' }}>
                  <strong>End Time:</strong> {meetingData.endTime.format('MMM DD, YYYY h:mm A')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Generated Link Section */}
        {generatedLink && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ 
                fontFamily: 'var(--font-poppins)', 
                fontWeight: 600, 
                color: 'success.dark',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <CheckCircle />
                Meeting Link Generated Successfully!
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                p: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'success.main'
              }}>
                <Link color="success" />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'var(--font-lexend)', 
                    flex: 1,
                    wordBreak: 'break-all'
                  }}
                >
                  {generatedLink}
                </Typography>
                <IconButton 
                  onClick={copyToClipboard}
                  color="success"
                  size="small"
                >
                  {copied ? <CheckCircle /> : <ContentCopy />}
                </IconButton>
              </Box>
              
              <Typography variant="caption" sx={{ 
                fontFamily: 'var(--font-lexend)', 
                color: 'success.dark',
                display: 'block',
                mt: 1
              }}>
                {copied ? 'Link copied to clipboard!' : 'Click the copy icon to copy the link'}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            fontFamily: 'var(--font-lexend)',
            borderRadius: 2
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={generateGoogleMeetLink}
          variant="contained"
          disabled={isGenerating}
          startIcon={<VideoCall />}
          sx={{ 
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' },
            fontFamily: 'var(--font-lexend)',
            borderRadius: 2,
            px: 3
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Google Meet Link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleMeetingDialog; 