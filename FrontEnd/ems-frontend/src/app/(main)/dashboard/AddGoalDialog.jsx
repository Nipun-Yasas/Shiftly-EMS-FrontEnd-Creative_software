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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddGoalDialog = ({ open, onClose, onAdd, onUpdate, goal = null }) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(dayjs().add(7, 'day'));
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || '');
      setDescription(goal.description || '');
      setDueDate(goal.dueDate ? dayjs(goal.dueDate) : dayjs().add(7, 'day'));
      setPriority(goal.priority || 'medium');
      setCategory(goal.category || 'work');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(dayjs().add(7, 'day'));
      setPriority('medium');
      setCategory('work');
    }
  }, [goal, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const goalData = {
      id: goal ? goal.id : Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate.format('YYYY-MM-DD'),
      priority,
      category,
      completed: goal ? goal.completed : false,
      createdAt: goal ? goal.createdAt : new Date().toISOString()
    };

    if (goal) {
      onUpdate(goalData);
    } else {
      onAdd(goalData);
    }
    onClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return theme.palette.error.main;
      case "medium": return theme.palette.warning.main;
      case "low": return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: 'var(--font-poppins)', 
        fontWeight: 600,
        color: 'text.primary'
      }}>
        {goal ? 'Edit Goal' : 'Add New Goal'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Goal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: 'var(--font-lexend)'
              }
            }}
          />
          
          <TextField
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              textField={
                <TextField
                  fullWidth
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
            <InputLabel sx={{ fontFamily: 'var(--font-lexend)' }}>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
              sx={{
                borderRadius: 2,
                fontFamily: 'var(--font-lexend)'
              }}
            >
              <MenuItem value="low" sx={{ fontFamily: 'var(--font-lexend)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
                  Low
                </Box>
              </MenuItem>
              <MenuItem value="medium" sx={{ fontFamily: 'var(--font-lexend)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.warning.main }} />
                  Medium
                </Box>
              </MenuItem>
              <MenuItem value="high" sx={{ fontFamily: 'var(--font-lexend)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.error.main }} />
                  High
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: 'var(--font-lexend)' }}>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              sx={{
                borderRadius: 2,
                fontFamily: 'var(--font-lexend)'
              }}
            >
              <MenuItem value="work" sx={{ fontFamily: 'var(--font-lexend)' }}>Work</MenuItem>
              <MenuItem value="personal" sx={{ fontFamily: 'var(--font-lexend)' }}>Personal</MenuItem>
              <MenuItem value="learning" sx={{ fontFamily: 'var(--font-lexend)' }}>Learning</MenuItem>
              <MenuItem value="health" sx={{ fontFamily: 'var(--font-lexend)' }}>Health</MenuItem>
              <MenuItem value="finance" sx={{ fontFamily: 'var(--font-lexend)' }}>Finance</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'text.secondary',
            fontFamily: 'var(--font-lexend)'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
          sx={{ 
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark },
            borderRadius: 2,
            px: 3,
            fontFamily: 'var(--font-lexend)'
          }}
        >
          {goal ? 'Update Goal' : 'Add Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGoalDialog; 