import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function AddToDoDialog({ open, onClose, onAdd, onUpdate, todo = null }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (todo) {
      setText(todo.text || '');
      setPriority(todo.priority || 'medium');
      setDueDate(todo.dueDate || '');
    } else {
      setText('');
      setPriority('medium');
      setDueDate('');
    }
  }, [todo, open]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const toDoData = {
      id: todo ? todo.id : Date.now(),
      text: text.trim(),
      priority,
      completed: todo ? todo.completed : false,
      dueDate,
      highlighted: todo ? todo.highlighted : false
    };
    if (todo && onUpdate) {
      onUpdate(toDoData);
    } else if (onAdd) {
      onAdd(toDoData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{todo ? 'Edit To Do' : 'Add New To Do'}</DialogTitle>
      <DialogContent>
        <TextField
          label="To Do"
          value={text}
          onChange={e => setText(e.target.value)}
          fullWidth
          autoFocus
          margin="normal"
        />
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        {/* Priority selection can be added here if needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!text.trim()}>{todo ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
} 