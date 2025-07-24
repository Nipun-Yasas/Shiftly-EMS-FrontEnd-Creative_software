import { Paper, Box, Typography, IconButton, Chip, Button, useTheme } from '@mui/material';
import { Add, Edit, Delete, TrendingUp, Schedule } from '@mui/icons-material';
import AddToDoDialog from '../AddToDoDialog';
import ToDoTableDialog from '../ToDoTableDialog';
import dayjs from 'dayjs';

export default function ToDoCard({
  toDoItems,
  handleAddToDo,
  handleEditToDo,
  handleDeleteToDo,
  handleUpdateToDo,
  handleToggleToDo,
  addDialogOpen,
  setAddDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  editTodo,
  tableDialogOpen,
  setTableDialogOpen
}) {
  const theme = useTheme();
  const getPriorityColor = (priority, theme) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.grey[500];
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
    if (!dueDate) return null;
    if (isDueToday(dueDate)) return 'Today';
    if (isOverdue(dueDate)) return 'Overdue';
    return dayjs(dueDate).format('MMM D');
  };

  return (
    <Paper elevation={3} sx={{
      p: 3,
      borderRadius: 3,
      height: '100%',
      width: '100%',
      background: theme => theme.palette.background,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'text.primary' }}>
          My To Do Items
        </Typography>
        <IconButton size="small" sx={{ color: theme => theme.palette.primary }} onClick={() => setAddDialogOpen(true)} aria-label="Add new to-do item">
          <Add />
        </IconButton>
      </Box>
      <Chip label="Latest to do's" size="small" icon={<TrendingUp />} sx={{ mb: 2, bgcolor: theme => theme.palette.warning.light, color: theme => theme.palette.warning.contrastText, fontFamily: 'var(--font-lexend)' }} />
      <Box sx={{ mb: 3 }}>
        {toDoItems.slice(0, 5).map((item) => (
          <Box 
            key={item.id} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 2, 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: item.highlighted ? 'action.hover' : 'transparent',
              border: theme => `1px solid ${item.highlighted ? theme.palette.primary.main + '40' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-1px)',
                boxShadow: 1
              }
            }}
            onClick={() => handleToggleToDo && handleToggleToDo(item.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {item.highlighted ? (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme => theme.palette.error.main, mr: 2 }} />
              ) : item.completed ? (
                <Box sx={{ color: 'success.main', mr: 2, fontSize: 20 }}>✔️</Box>
              ) : (
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  border: `2px solid ${getPriorityColor(item.priority, theme)}`, 
                  mr: 2,
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
                    bgcolor: getPriorityColor(item.priority, theme)
                  }
                }} />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textDecoration: item.completed ? 'line-through' : 'none', 
                    color: item.completed ? 'text.secondary' : 'text.primary', 
                    fontFamily: 'var(--font-lexend)', 
                    fontWeight: item.highlighted ? 600 : 400,
                    mb: 0.5
                  }}
                >
                  {item.text}
                </Typography>
                {item.dueDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: isOverdue(item.dueDate) ? 'error.main' : 
                               isDueToday(item.dueDate) ? 'warning.main' : 'text.secondary',
                        fontFamily: 'var(--font-lexend)',
                        fontWeight: isOverdue(item.dueDate) || isDueToday(item.dueDate) ? 600 : 400
                      }}
                    >
                      {formatDueDate(item.dueDate)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditToDo(item);
                }} 
                aria-label={`Edit to-do item ${item.text}`}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteToDo(item.id);
                }} 
                aria-label={`Delete to-do item ${item.text}`}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        {toDoItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>
              No to-do items yet. Click the + button to add one!
            </Typography>
          </Box>
        )}
      </Box>
      <Button variant="outlined" fullWidth sx={{ borderColor: theme => theme.palette.primary.main, color: theme => theme.palette.primary.main, '&:hover': { borderColor: theme => theme.palette.primary.dark, bgcolor: theme => theme.palette.primary.light + '20' }, borderRadius: 2 }} onClick={() => setTableDialogOpen(true)}>
        View All + Add To Do
      </Button>
      <AddToDoDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onAdd={handleAddToDo} />
      <AddToDoDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} onUpdate={handleUpdateToDo} todo={editTodo} />
      <ToDoTableDialog open={tableDialogOpen} onClose={() => setTableDialogOpen(false)} todos={toDoItems} setTodos={handleUpdateToDo} />
    </Paper>
  );
} 