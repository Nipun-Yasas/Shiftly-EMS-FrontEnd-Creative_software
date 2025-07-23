import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import VideoCall from '@mui/icons-material/VideoCall';
import Schedule from '@mui/icons-material/Schedule';
import People from '@mui/icons-material/People';
import Description from '@mui/icons-material/Description';
import Link from '@mui/icons-material/Link';
import ContentCopy from '@mui/icons-material/ContentCopy';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Close from '@mui/icons-material/Close';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const defaultMeeting = () => ({
  title: '', description: '', startTime: dayjs().add(1, 'hour'), endTime: dayjs().add(2, 'hour'), attendees: '', meetingType: 'google-meet', duration: 60
});

const ScheduleMeetingDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const [meetingData, setMeetingData] = useState(defaultMeeting());
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { if (open) { setMeetingData(defaultMeeting()); setGeneratedLink(''); setCopied(false); setErrors({}); } }, [open]);
  useEffect(() => { setMeetingData(prev => ({ ...prev, endTime: meetingData.startTime.add(meetingData.duration, 'minute') })); }, [meetingData.startTime, meetingData.duration]);

  const validateForm = () => {
    const newErrors = {};
    if (!meetingData.title.trim()) newErrors.title = 'Meeting title is required';
    if (meetingData.startTime.isBefore(dayjs())) newErrors.startTime = 'Start time cannot be in the past';
    if (meetingData.duration < 15) newErrors.duration = 'Meeting must be at least 15 minutes';
    if (meetingData.duration > 480) newErrors.duration = 'Meeting cannot exceed 8 hours';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateMeetingId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part = len => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${part(3)}-${part(4)}-${part(3)}`;
  };

  const saveMeetingToStorage = meeting => {
    try {
      const existing = JSON.parse(localStorage.getItem('scheduledMeetings') || '[]');
      existing.push(meeting);
      localStorage.setItem('scheduledMeetings', JSON.stringify(existing));
    } catch (error) { console.error('Error saving meeting:', error); }
  };

  const generateGoogleMeetLink = async () => {
    if (!validateForm()) return;
    setIsGenerating(true);
    try {
      const meetingId = generateMeetingId();
      const meetLink = `https://meet.google.com/${meetingId}`;
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGeneratedLink(meetLink);
      saveMeetingToStorage({ id: Date.now(), ...meetingData, meetLink, meetingId, createdAt: dayjs().toISOString(), status: 'scheduled' });
    } catch (error) {
      console.error('Error generating meeting link:', error);
      setErrors({ general: 'Failed to generate meeting link. Please try again.' });
    } finally { setIsGenerating(false); }
  };

  const copyToClipboard = async () => {
    try { await navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (error) { console.error('Failed to copy link:', error); }
  };

  const handleInputChange = (field, value) => {
    setMeetingData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const getDurationOptions = () => Array.from({ length: 32 }, (_, i) => {
    const val = (i + 1) * 15;
    const h = Math.floor(val / 60), m = val % 60;
    return { value: val, label: h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m` };
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper', minHeight: '60vh' } }}>
      <DialogTitle sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'text.primary', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoCall color="primary" />
          <Typography variant="h6">Schedule Meeting</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>
      <DialogContent>
        {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}
        <Grid container spacing={3}>
          {/* Meeting Details */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Meeting Title" value={meetingData.title} onChange={e => handleInputChange('title', e.target.value)} fullWidth required error={!!errors.title} helperText={errors.title} InputProps={{ startAdornment: (<InputAdornment position="start"><VideoCall color="action" /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'var(--font-lexend)' } }} />
              <TextField label="Description (Optional)" value={meetingData.description} onChange={e => handleInputChange('description', e.target.value)} fullWidth multiline rows={3} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'var(--font-lexend)' } }} />
              <TextField label="Attendees (Optional)" value={meetingData.attendees} onChange={e => handleInputChange('attendees', e.target.value)} fullWidth placeholder="Enter email addresses separated by commas" InputProps={{ startAdornment: (<InputAdornment position="start"><People color="action" /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'var(--font-lexend)' } }} />
            </Box>
          </Grid>

          {/* Time and Duration */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Time"
                  value={meetingData.startTime}
                  onChange={(value) => handleInputChange('startTime', value)}
                  textField={
                    <TextField
                      fullWidth
                      required
                      error={!!errors.startTime}
                      helperText={errors.startTime}
                      InputProps={{
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
                  }
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel sx={{ fontFamily: 'var(--font-lexend)' }}>Duration</InputLabel>
                <Select value={meetingData.duration} onChange={e => handleInputChange('duration', e.target.value)} label="Duration" error={!!errors.duration} sx={{ borderRadius: 2, fontFamily: 'var(--font-lexend)' }}>
                  {getDurationOptions().map(option => <MenuItem key={option.value} value={option.value} sx={{ fontFamily: 'var(--font-lexend)' }}>{option.label}</MenuItem>)}
                </Select>
              </FormControl>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontFamily: 'var(--font-lexend)', color: 'text.secondary' }}><strong>End Time:</strong> {meetingData.endTime.format('MMM DD, YYYY h:mm A')}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {generatedLink && <><Divider sx={{ my: 3 }} />
          <Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'success.dark', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><CheckCircle />Meeting Link Generated Successfully!</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'success.main' }}>
              <Link color="success" />
              <Typography variant="body2" sx={{ fontFamily: 'var(--font-lexend)', flex: 1, wordBreak: 'break-all' }}>{generatedLink}</Typography>
              <IconButton onClick={copyToClipboard} color="success" size="small">{copied ? <CheckCircle /> : <ContentCopy />}</IconButton>
            </Box>
            <Typography variant="caption" sx={{ fontFamily: 'var(--font-lexend)', color: 'success.dark', display: 'block', mt: 1 }}>{copied ? 'Link copied to clipboard!' : 'Click the copy icon to copy the link'}</Typography>
          </Box></>}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ fontFamily: 'var(--font-lexend)', borderRadius: 2 }}>Cancel</Button>
        <Button onClick={generateGoogleMeetLink} variant="contained" disabled={isGenerating} startIcon={<VideoCall />} sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, fontFamily: 'var(--font-lexend)', borderRadius: 2, px: 3 }}>{isGenerating ? 'Generating...' : 'Generate Google Meet Link'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleMeetingDialog; 