import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  IconButton, 
  Box, 
  Chip,
  Typography,
  Checkbox,
  Tooltip
} from '@mui/material';
import { Delete, Add, Edit, Schedule, Category } from '@mui/icons-material';
import AddToDoDialog from './AddToDoDialog';
import dayjs from 'dayjs';

export default function ToDoTableDialog({ open, onClose, todos, setTodos }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const handleAdd = (todo) => {
    setTodos(prev => [todo, ...prev]);
  };
  
  const handleDelete = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };
  
  const handleEdit = (todo) => {
    setEditTodo(todo);
    setEditOpen(true);
  };
  
  const handleUpdate = (updated) => {
    setTodos(prev => prev.map(t => {
      if (t.id === updated.id) {
        const updatedTodo = { ...updated };
        // If marking as completed, add completion timestamp
        if (updated.completed && !t.completed) {
          updatedTodo.completedAt = dayjs().toISOString();
        }
        // If unmarking as completed, remove completion timestamp
        if (!updated.completed && t.completed) {
          const { completedAt, ...rest } = updatedTodo;
          return rest;
        }
        return updatedTodo;
      }
      return t;
    }));
  };

  const handleToggleComplete = (id) => {
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed };
        if (updated.completed && !t.completed) {
          updated.completedAt = dayjs().toISOString();
        } else if (!updated.completed && t.completed) {
          const { completedAt, ...rest } = updated;
          return rest;
        }
        return updated;
      }
      return t;
    }));
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

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return dayjs(dueDate).isBefore(dayjs(), 'day');
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    return dayjs(dueDate).isSame(dayjs(), 'day');
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return '-';
    if (isDueToday(dueDate)) return 'Today';
    if (isOverdue(dueDate)) return 'Overdue';
    return dayjs(dueDate).format('MMM D, YYYY');
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ 
        fontFamily: 'var(--font-poppins)', 
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Typography variant="h6">All To Do Items</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {pendingTodos.length} pending • {completedTodos.length} completed
          </Typography>
        </Box>
        <Button 
          startIcon={<Add />} 
          variant="contained" 
          onClick={() => setAddOpen(true)}
          sx={{ fontFamily: 'var(--font-lexend)' }}
        >
          Add To Do
        </Button>
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Due Date</TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Priority</TableCell>
              <TableCell align="right" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>
                    No to-do items yet. Click "Add To Do" to get started!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              todos.map((todo) => (
                <TableRow 
                  key={todo.id}
                  sx={{ 
                    opacity: todo.completed ? 0.7 : 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      sx={{ 
                        color: getPriorityColor(todo.priority),
                        '&.Mui-checked': {
                          color: 'success.main',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                        fontFamily: 'var(--font-lexend)',
                        fontWeight: todo.highlighted ? 600 : 400
                      }}
                    >
                      {todo.text}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={todo.category || 'general'} 
                      size="small" 
                      icon={<span>{getCategoryIcon(todo.category)}</span>}
                      sx={{ fontFamily: 'var(--font-lexend)' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isOverdue(todo.dueDate) ? 'error.main' : 
                                 isDueToday(todo.dueDate) ? 'warning.main' : 'text.secondary',
                          fontFamily: 'var(--font-lexend)',
                          fontWeight: isOverdue(todo.dueDate) || isDueToday(todo.dueDate) ? 600 : 400
                        }}
                      >
                        {formatDueDate(todo.dueDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={todo.priority} 
                      size="small"
                      sx={{ 
                        bgcolor: getPriorityColor(todo.priority) + '20',
                        color: getPriorityColor(todo.priority),
                        fontFamily: 'var(--font-lexend)',
                        fontWeight: 600
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => handleEdit(todo)} 
                        color="primary"
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDelete(todo.id)} 
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <AddToDoDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
        <AddToDoDialog open={editOpen} onClose={() => setEditOpen(false)} onUpdate={handleUpdate} todo={editTodo} />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          sx={{ fontFamily: 'var(--font-lexend)' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 