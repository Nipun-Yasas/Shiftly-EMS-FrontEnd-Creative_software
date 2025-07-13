import { useState } from 'react';
import {
  Paper, Box, Typography, Button, IconButton, Chip, LinearProgress, Checkbox, Tooltip, TextField, useTheme
} from '@mui/material';
import { Add, Edit, Delete, EmojiEvents, TrendingUp } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function GoalCard({ goals, onAddGoal, onEditGoal, onDeleteGoal, onToggleComplete, onViewAll }) {
  const theme = useTheme();
  const [quickAdd, setQuickAdd] = useState('');

  const completed = goals.filter(g => g.completed).length;
  const total = goals.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeGoals = goals.filter(g => !g.completed).slice(0, 3);
  const motivationalQuote = "Success is the sum of small efforts, repeated day in and day out.";

  const handleQuickAdd = () => {
    if (quickAdd.trim()) {
      onAddGoal({
        id: Date.now(),
        title: quickAdd.trim(),
        description: '',
        dueDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
        priority: 'medium',
        category: 'work',
        completed: false,
        createdAt: new Date().toISOString()
      });
      setQuickAdd('');
    }
  };

  return (
    <Paper elevation={3} sx={{
      p: 3,
      borderRadius: 3,
      minHeight: 420,
      display: 'flex',
      flexDirection: 'column',
      background: theme => theme.palette.mode === 'dark' ? '#181a20' : '#fff',
      boxShadow: 4,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'text.primary' }}>
          <EmojiEvents sx={{ mr: 1, color: 'warning.main' }} /> My Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2, fontWeight: 700, fontFamily: 'var(--font-lexend)', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, boxShadow: 2 }}
          onClick={onViewAll}
        >
          View All
        </Button>
      </Box>
      <Chip label="Latest goals" size="small" icon={<TrendingUp />} sx={{ mb: 2, bgcolor: theme => theme.palette.warning.light, color: theme => theme.palette.warning.contrastText, fontFamily: 'var(--font-lexend)' }} />
      <Box sx={{ mb: 3 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: theme => theme.palette.mode === 'dark' ? '#232323' : 'action.hover', '& .MuiLinearProgress-bar': { borderRadius: 4, background: 'linear-gradient(90deg, #ff80ab 0%, #ffd6e0 100%)' } }} />
        <Typography variant="body2" sx={{ mt: 1, color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.secondary', fontFamily: 'var(--font-lexend)' }}>{completed} of {total} goals completed</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Quick add a goal..."
          value={quickAdd}
          onChange={e => setQuickAdd(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(); }}
          sx={{ width: '100%', bgcolor: theme => theme.palette.mode === 'dark' ? '#232323' : '#fff', borderRadius: 2, input: { color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit' } }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleQuickAdd} color="primary" size="small"><Add /></IconButton>
            )
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        {activeGoals.length === 0 ? (
          <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.secondary', fontFamily: 'var(--font-lexend)' }}>No active goals. Add one above!</Typography>
        ) : (
          activeGoals.map(goal => (
            <Paper key={goal.id} elevation={1} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, borderRadius: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#232323' : '#fff', boxShadow: 1 }}>
              <Checkbox checked={goal.completed} onChange={() => onToggleComplete(goal.id)} sx={{ color: 'success.main' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'var(--font-lexend)', fontWeight: 600, color: goal.completed ? 'text.secondary' : 'text.primary', textDecoration: goal.completed ? 'line-through' : 'none' }}>{goal.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>{goal.dueDate ? `Due: ${dayjs(goal.dueDate).format('MMM DD, YYYY')}` : ''}</Typography>
              </Box>
              <Tooltip title="Edit" arrow><IconButton size="small" onClick={() => onEditGoal(goal)}><Edit fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Delete" arrow><IconButton size="small" onClick={() => onDeleteGoal(goal.id)}><Delete fontSize="small" /></IconButton></Tooltip>
            </Paper>
          ))
        )}
      </Box>
      <Button variant="outlined" fullWidth sx={{ borderColor: theme => theme.palette.primary.main, color: theme => theme.palette.primary.main, '&:hover': { borderColor: theme => theme.palette.primary.dark, bgcolor: theme => theme.palette.primary.light + '20' }, borderRadius: 2, fontWeight: 700, fontFamily: 'var(--font-lexend)', mt: 2 }} onClick={onViewAll}>
        View All + Add Goal
      </Button>
      <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#181a20' : '#fff', textAlign: 'center', boxShadow: 0 }}>
        <Typography variant="body2" sx={{ fontFamily: 'var(--font-lexend)', color: theme => theme.palette.mode === 'dark' ? '#ff80ab' : 'primary.main', fontWeight: 600 }}>
          {motivationalQuote}
        </Typography>
      </Box>
    </Paper>
  );
} 