import { Paper, Box, Typography, IconButton, Chip, Button } from '@mui/material';
import { Add, Edit, Delete, TrendingUp } from '@mui/icons-material';
import AddToDoDialog from '../AddToDoDialog';
import ToDoTableDialog from '../ToDoTableDialog';

export default function ToDoCard({
  toDoItems,
  handleAddToDo,
  handleEditToDo,
  handleDeleteToDo,
  handleUpdateToDo,
  addDialogOpen,
  setAddDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  editTodo,
  tableDialogOpen,
  setTableDialogOpen
}) {
  return (
    <Paper elevation={3} sx={{
      p: 3,
      borderRadius: 3,
      height: '100%',
      width: '100%',
      background: theme => theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
        : 'background.paper',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'text.primary' }}>
          My To Do Items
        </Typography>
        <IconButton size="small" sx={{ color: theme => theme.palette.primary.main }} onClick={() => setAddDialogOpen(true)} aria-label="Add new to-do item">
          <Add />
        </IconButton>
      </Box>
      <Chip label="Latest to do's" size="small" icon={<TrendingUp />} sx={{ mb: 2, bgcolor: theme => theme.palette.warning.light, color: theme => theme.palette.warning.contrastText, fontFamily: 'var(--font-lexend)' }} />
      <Box sx={{ mb: 3 }}>
        {toDoItems.slice(0, 5).map((item) => (
          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 1, borderRadius: 1, bgcolor: item.highlighted ? 'action.hover' : 'transparent' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {item.highlighted ? <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme => theme.palette.error.main, mr: 2 }} /> : item.completed ? <Box sx={{ color: 'success.main', mr: 2, fontSize: 20 }}>✔️</Box> : <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${theme => theme.palette.grey[400]}`, mr: 2 }} />}
              <Typography variant="body2" sx={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'text.secondary' : 'text.primary', fontFamily: 'var(--font-lexend)', flex: 1 }}>
                {item.text}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => handleEditToDo(item)} aria-label={`Edit to-do item ${item.text}`}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => handleDeleteToDo(item.id)} aria-label={`Delete to-do item ${item.text}`}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
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