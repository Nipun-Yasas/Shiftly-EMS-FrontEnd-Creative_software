import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Chip } from '@mui/material';
import { Delete, Add, Edit } from '@mui/icons-material';
import AddToDoDialog from './AddToDoDialog';

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
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>All To Do Items</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button startIcon={<Add />} variant="contained" onClick={() => setAddOpen(true)}>
            Add To Do
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>{todo.text}</TableCell>
                <TableCell>{todo.dueDate || '-'}</TableCell>
                <TableCell>
                  <Chip label={todo.priority} color={todo.priority === 'high' ? 'error' : todo.priority === 'medium' ? 'warning' : 'success'} size="small" />
                </TableCell>
                <TableCell>{todo.completed ? 'Completed' : 'Pending'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(todo)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(todo.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddToDoDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
        <AddToDoDialog open={editOpen} onClose={() => setEditOpen(false)} onUpdate={handleUpdate} todo={editTodo} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 