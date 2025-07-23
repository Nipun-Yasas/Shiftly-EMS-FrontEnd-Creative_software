import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  useTheme,
  Checkbox
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import dayjs from 'dayjs';
import AddGoalDialog from './AddGoalDialog';

const GoalTableDialog = ({ open, onClose, goals, setGoals }) => {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);

  const handleEditGoal = (goal) => {
    setEditGoal(goal);
    setEditDialogOpen(true);
  };

  const handleDeleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleUpdateGoal = (updated) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  };

  const handleToggleComplete = (id) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return theme.palette.error.main;
      case "medium": return theme.palette.warning.main;
      case "low": return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "work": return theme.palette.primary.main;
      case "personal": return theme.palette.secondary.main;
      case "learning": return theme.palette.info.main;
      case "health": return theme.palette.success.main;
      case "finance": return theme.palette.warning.main;
      default: return theme.palette.grey[500];
    }
  };

  const isOverdue = (dueDate) => {
    return dayjs(dueDate).isBefore(dayjs(), 'day');
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
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
          My Goals
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setEditDialogOpen(true)}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark },
              borderRadius: 2,
              fontFamily: 'var(--font-lexend)'
            }}
          >
            Add Goal
          </Button>
        </DialogTitle>
        
        <DialogContent>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Goal</TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>
                        No goals yet. Add your first goal to get started!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  goals.map((goal) => (
                    <TableRow 
                      key={goal.id}
                      sx={{ 
                        '&:hover': { bgcolor: 'action.hover' },
                        opacity: goal.completed ? 0.7 : 1
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={goal.completed}
                          onChange={() => handleToggleComplete(goal.id)}
                          sx={{ color: theme.palette.success.main }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'var(--font-lexend)',
                              fontWeight: 500,
                              textDecoration: goal.completed ? 'line-through' : 'none',
                              color: goal.completed ? 'text.secondary' : 'text.primary'
                            }}
                          >
                            {goal.title}
                          </Typography>
                          {goal.description && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                fontFamily: 'var(--font-lexend)',
                                display: 'block',
                                mt: 0.5
                              }}
                            >
                              {goal.description}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: getCategoryColor(goal.category) + '20',
                            color: getCategoryColor(goal.category),
                            fontFamily: 'var(--font-lexend)',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: getPriorityColor(goal.priority) + '20',
                            color: getPriorityColor(goal.priority),
                            fontFamily: 'var(--font-lexend)',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'var(--font-lexend)',
                            color: isOverdue(goal.dueDate) && !goal.completed ? 'error.main' : 'text.primary',
                            fontWeight: isOverdue(goal.dueDate) && !goal.completed ? 600 : 400
                          }}
                        >
                          {dayjs(goal.dueDate).format('MMM DD, YYYY')}
                          {isOverdue(goal.dueDate) && !goal.completed && (
                            <Typography 
                              component="span" 
                              variant="caption" 
                              sx={{ 
                                color: 'error.main',
                                ml: 1,
                                fontFamily: 'var(--font-lexend)'
                              }}
                            >
                              (Overdue)
                            </Typography>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditGoal(goal)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteGoal(goal.id)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderColor: 'grey.300',
              color: 'text.primary',
              '&:hover': { 
                borderColor: 'grey.400',
                bgcolor: 'action.hover'
              },
              borderRadius: 2,
              fontFamily: 'var(--font-lexend)'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AddGoalDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        onAdd={(newGoal) => {
          setGoals(prev => [newGoal, ...prev]);
          setEditDialogOpen(false);
        }}
        onUpdate={handleUpdateGoal}
        goal={editGoal}
      />
    </>
  );
};

export default GoalTableDialog; 