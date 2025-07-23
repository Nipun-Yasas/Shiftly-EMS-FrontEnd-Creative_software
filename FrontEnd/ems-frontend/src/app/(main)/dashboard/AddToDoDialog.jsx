import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { PriorityHigh, Schedule, Category } from '@mui/icons-material';

export default function AddToDoDialog({ open, onClose, onAdd, onUpdate, todo = null }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('work');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (todo) {
      setText(todo.text || '');
      setPriority(todo.priority || 'medium');
      setDueDate(todo.dueDate || '');
      setCategory(todo.category || 'work');
    } else {
      setText('');
      setPriority('medium');
      setDueDate('');
      setCategory('work');
    }
    setErrors({});
  }, [todo, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!text.trim()) {
      newErrors.text = 'To-do text is required';
    }
    if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const toDoData = {
      id: todo ? todo.id : Date.now(),
      text: text.trim(),
      priority,
      completed: todo ? todo.completed : false,
      dueDate: dueDate || null,
      highlighted: todo ? todo.highlighted : false,
      category,
      createdAt: todo ? todo.createdAt : new Date().toISOString()
    };

    if (todo && onUpdate) {
      onUpdate(toDoData);
    } else if (onAdd) {
      onAdd(toDoData);
    }
    onClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'meeting': return '🤝';
      case 'learning': return '📚';
      case 'health': return '🏃';
      default: return '📝';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        fontFamily: 'var(--font-poppins)', 
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {todo ? 'Edit To Do' : 'Add New To Do'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="To Do"
          value={text}
          onChange={e => setText(e.target.value)}
          fullWidth
          autoFocus
          margin="normal"
          error={!!errors.text}
          helperText={errors.text}
          placeholder="Enter your to-do item..."
          sx={{ fontFamily: 'var(--font-lexend)' }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="high">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                  High Priority
                </Box>
              </MenuItem>
              <MenuItem value="medium">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
                  Medium Priority
                </Box>
              </MenuItem>
              <MenuItem value="low">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                  Low Priority
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={e => setCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="work">💼 Work</MenuItem>
              <MenuItem value="personal">👤 Personal</MenuItem>
              <MenuItem value="meeting">🤝 Meeting</MenuItem>
              <MenuItem value="learning">📚 Learning</MenuItem>
              <MenuItem value="health">🏃 Health</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.dueDate}
          helperText={errors.dueDate}
          sx={{ mt: 2 }}
        />

        {text && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Preview:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                border: `2px solid ${getPriorityColor(priority)}`,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: getPriorityColor(priority)
                }
              }} />
              <Typography variant="body2" sx={{ fontFamily: 'var(--font-lexend)' }}>
                {text}
              </Typography>
              <Chip 
                label={category} 
                size="small" 
                icon={<span>{getCategoryIcon(category)}</span>}
                sx={{ ml: 'auto' }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontFamily: 'var(--font-lexend)' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!text.trim()}
          sx={{ fontFamily: 'var(--font-lexend)' }}
        >
          {todo ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 