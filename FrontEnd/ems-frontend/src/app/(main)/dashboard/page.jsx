"use client";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Person from '@mui/icons-material/Person';
import Event from '@mui/icons-material/Event';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useState, useEffect, useRef } from "react";
import AddGoalDialog from './AddGoalDialog';
import GoalTableDialog from './GoalTableDialog';
import dayjs from 'dayjs';
import GreetingHeader from './_components/GreetingHeader';
import ProgressCard from './_components/ProgressCard';
import ToDoCard from './_components/ToDoCard';
import EventsCard from './_components/EventsCard';
import StarPointsCard from './_components/StarPointsCard';
import PerformanceAnalyticsCard from './_components/PerformanceAnalyticsCard';
import UserDataStatus from '../../_components/UserDataStatus';
import { getGreeting } from './_components/dashboardUtils';
import { useRouter } from 'next/navigation';
import { saveUserData, getUserData, migrateUserData, cleanupOldBackups, initializeUserSession } from '../../_utils/localStorageUtils';
import ScheduleMeetingDialog from './_components/ScheduleMeetingDialog';
import MeetingsHistoryCard from './_components/MeetingsHistoryCard';

// Note: Ensure --font-poppins and --font-lexend are defined in global CSS

// Realistic initial ToDo data for first-time users
const getInitialToDoItems = () => [
  { 
    id: Date.now() - 4, 
    text: "Complete project documentation", 
    completed: false, 
    highlighted: true, 
    priority: "high",
    dueDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().subtract(3, 'day').toISOString(),
    category: "work"
  },
  { 
    id: Date.now() - 3, 
    text: "Review team performance reports", 
    completed: true, 
    highlighted: false, 
    priority: "medium",
    dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().subtract(5, 'day').toISOString(),
    completedAt: dayjs().subtract(1, 'day').toISOString(),
    category: "work"
  },
  { 
    id: Date.now() - 2, 
    text: "Schedule client meeting", 
    completed: false, 
    highlighted: false, 
    priority: "high",
    dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().subtract(2, 'day').toISOString(),
    category: "meeting"
  },
  { 
    id: Date.now() - 1, 
    text: "Update personal development plan", 
    completed: false, 
    highlighted: false, 
    priority: "low",
    dueDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    category: "personal"
  },
];

const initialGoals = [
  {
    id: 1,
    title: "Complete onboarding process",
    description: "Finish all required onboarding tasks and documentation",
    completed: true,
    dueDate: "2025-07-15",
    priority: "high",
    category: "work",
    createdAt: "2025-07-01T12:00:00Z",
    completedAt: "2025-07-10T12:00:00Z",
  },
  {
    id: 2,
    title: "Submit monthly timesheet",
    description: "Complete and submit timesheet for current month",
    completed: false,
    dueDate: "2025-07-20",
    priority: "medium",
    category: "work",
    createdAt: "2025-07-05T12:00:00Z",
  },
  {
    id: 3,
    title: "Attend team training session",
    description: "Participate in the new software training",
    completed: false,
    dueDate: "2025-07-25",
    priority: "low",
    category: "learning",
    createdAt: "2025-07-10T12:00:00Z",
  },
  {
    id: 4,
    title: "Update personal profile",
    description: "Add latest skills and experience to profile",
    completed: false,
    dueDate: "2025-07-30",
    priority: "medium",
    category: "personal",
    createdAt: "2025-07-12T12:00:00Z",
  },
];

const demoEvents = [
  { id: 1, title: "PUBG Tournament By Red Bull", date: "Jul 26 - Jul 27, 2025", participants: 128, joined: true, imageUrl: "/images/project1.jpg", category: "Gaming" },
  { id: 2, title: "Apex Legends Tournament By Xbox", date: "Jul 27 - Jul 29, 2025", participants: 64, joined: false, imageUrl: "/images/project2.jpg", category: "Gaming" },
  { id: 3, title: "Rocket League Finals", date: "Aug 01 - Aug 02, 2025", participants: 102, joined: true, imageUrl: "/images/project3.jpg", category: "Sports" },
  { id: 4, title: "Call of Duty: Warzone", date: "Aug 03 - Aug 05, 2025", participants: 256, joined: false, imageUrl: "/images/project4.jpg", category: "Gaming" },
];



const Dashboard = () => {
  const theme = useTheme();
  const router = useRouter();
  const [progress, setProgress] = useState(25); // Initial static value - will be calculated from goals
  const [starPoints, setStarPoints] = useState(1); // Initial static value
  const [toDoItems, setToDoItems] = useState([]); // Start empty, will be loaded from localStorage
  const [goals, setGoals] = useState([]); // Start empty, will be loaded from localStorage
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [addGoalDialogOpen, setAddGoalDialogOpen] = useState(false);
  const [goalTableDialogOpen, setGoalTableDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editGoalDialogOpen, setEditGoalDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [quickAddValue, setQuickAddValue] = useState('');
  const motivationalQuote = "The only way to do great work is to love what you do. - Steve Jobs";
  const rightCardRef = useRef(null);
  const [cardRight, setCardRight] = useState(null); // Initialize as null
  const [starDialogOpen, setStarDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(null); // null for SSR, set after mount
  const [goalStreak, setGoalStreak] = useState(0);
  const [demoEventsState, setDemoEventsState] = useState(demoEvents);
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  // Initialize user session and load data on component mount
  useEffect(() => {
    setMounted(true);
    
    try {
      // Initialize user session first
      const currentUserId = initializeUserSession();
      setUserId(currentUserId);
      
      // Load ToDo items from localStorage with user-specific persistence
      loadToDoData(currentUserId);
      
      // Load Goals from localStorage with user-specific persistence
      loadGoalsData(currentUserId);
      
      // Clean up old backups
      cleanupOldBackups();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      // Fallback to initial data if initialization fails
      const initialToDos = getInitialToDoItems();
      setToDoItems(initialToDos);
      setGoals(initialGoals);
    }
  }, []);

  // Function to load ToDo data with proper error handling
  const loadToDoData = (currentUserId) => {
    try {
      // First try to migrate old data format
      const migratedData = migrateUserData('todos', null);
      
      // Then try to get current user data
      let savedToDos = getUserData('todos', null, currentUserId);
      
      if (migratedData) {
        // Use migrated data
        setToDoItems(migratedData);
        saveUserData('todos', migratedData, currentUserId);``
      } else if (savedToDos) {
        // Use existing user data
        setToDoItems(savedToDos);
      } else {
        // First time user - set initial realistic data
        const initialToDos = getInitialToDoItems();
        setToDoItems(initialToDos);
        saveUserData('todos', initialToDos, currentUserId);
      }
    } catch (error) {
      console.error('Error loading ToDo items from localStorage:', error);
      // Fallback to initial data if localStorage fails
      const initialToDos = getInitialToDoItems();
      setToDoItems(initialToDos);
    }
  };

  // Function to load Goals data with proper error handling
  const loadGoalsData = (currentUserId) => {
    try {
      // First try to migrate old data format
      const migratedData = migrateUserData('goals', null);
      
      // Then try to get current user data
      let savedGoals = getUserData('goals', null, currentUserId);
      
      if (migratedData) {
        // Use migrated data
        setGoals(migratedData);
        saveUserData('goals', migratedData, currentUserId);
      } else if (savedGoals) {
        // Use existing user data
        setGoals(savedGoals);
      } else {
        // First time user - set initial realistic data
        setGoals(initialGoals);
        saveUserData('goals', initialGoals, currentUserId);
      }
    } catch (error) {
      console.error('Error loading Goals from localStorage:', error);
      // Fallback to initial data if localStorage fails
      setGoals(initialGoals);
    }
  };

  // Save ToDo items to localStorage whenever they change
  useEffect(() => {
    if (mounted && toDoItems.length > 0 && userId) {
      try {
        saveUserData('todos', toDoItems, userId);
      } catch (error) {
        console.error('Error saving ToDo items to localStorage:', error);
      }
    }
  }, [toDoItems, mounted, userId]);

  // Save Goals to localStorage whenever they change
  useEffect(() => {
    if (mounted && goals.length > 0 && userId) {
      try {
        saveUserData('goals', goals, userId);
      } catch (error) {
        console.error('Error saving Goals to localStorage:', error);
      }
    }
  }, [goals, mounted, userId]);

  // Enhanced ToDo handlers with proper state management
  const handleAddToDo = (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now(),
      createdAt: dayjs().toISOString(),
      completed: false,
      highlighted: false
    };
    setToDoItems(prev => [newTodo, ...prev]);
  };

  const handleDeleteToDo = (id) => {
    setToDoItems(prev => prev.filter(t => t.id !== id));
  };

  const handleEditToDo = (todo) => { 
    setEditTodo(todo); 
    setEditDialogOpen(true); 
  };

  const handleUpdateToDo = (updated) => {
    setToDoItems(prev => prev.map(t => {
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

  // Toggle ToDo completion status
  const handleToggleToDo = (id) => {
    setToDoItems(prev => prev.map(t => {
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

  // Enhanced Goals handlers with proper state management
  const handleAddGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      createdAt: dayjs().toISOString(),
      completed: false
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const handleDeleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleEditGoal = (goal) => { 
    setEditGoal(goal); 
    setEditGoalDialogOpen(true); 
  };

  const handleUpdateGoal = (updated) => {
    setGoals(prev => prev.map(g => {
      if (g.id === updated.id) {
        const updatedGoal = { ...updated };
        // If marking as completed, add completion timestamp
        if (updated.completed && !g.completed) {
          updatedGoal.completedAt = dayjs().toISOString();
        }
        // If unmarking as completed, remove completion timestamp
        if (!updated.completed && g.completed) {
          const { completedAt, ...rest } = updatedGoal;
          return rest;
        }
        return updatedGoal;
      }
      return g;
    }));
  };

  const handleToggleEvent = (eventId) => {
    setDemoEventsState(prev => prev.map(event => event.id === eventId ? { ...event, joined: !event.joined } : event));
  };

  // Calculate progress based on goals
  useEffect(() => {
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    const calculatedProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    setProgress(calculatedProgress);
  }, [goals]);

  const getPriorityColor = (priority) => ({
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.success.main,
    default: theme.palette.grey[500],
  })[priority] || theme.palette.grey[500];

  const getEventTypeColor = (type) => ({
    interview: theme.palette.primary.main,
    meeting: theme.palette.info.main,
    review: theme.palette.warning.main,
    default: theme.palette.grey[500],
  })[type] || theme.palette.grey[500];

  const getEventTypeIcon = (type) => ({
    interview: <Person fontSize="small" />,
    meeting: <Event fontSize="small" />,
    review: <CheckCircle fontSize="small" />,
    default: <Event fontSize="small" />,
  })[type] || <Event fontSize="small" />;

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  // Streak counter
  useEffect(() => {
    const completedGoals = goals.filter(g => g.completed && g.completedAt);
    if (completedGoals.length === 0) {
      setGoalStreak(0);
      return;
    }
    const daysSet = new Set(completedGoals.map(g => dayjs(g.completedAt).format('YYYY-MM-DD')));
    let streak = 0;
    let day = dayjs();
    while (daysSet.has(day.format('YYYY-MM-DD'))) {
      streak++;
      day = day.subtract(1, 'day');
    }
    setGoalStreak(streak);
  }, [goals]);

  // Live time
  useEffect(() => {
    setCurrentTime(dayjs());
    const interval = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Client-side card position
  useEffect(() => {
    if (typeof window !== 'undefined' && rightCardRef.current) {
      const updateCardRight = () => {
        const rect = rightCardRef.current.getBoundingClientRect();
        setCardRight(window.innerWidth - rect.right);
      };
      updateCardRight();
      window.addEventListener('resize', updateCardRight);
      return () => window.removeEventListener('resize', updateCardRight);
    }
  }, []);

  // Dynamic greeting based on current time
  const greeting = currentTime ? getGreeting(currentTime.hour()) : '';

  return (
    <Box sx={{ p: 3,  minHeight: '100vh', width: '100%', position: 'relative' }}>
      <GreetingHeader greeting={greeting} />
      
      {/* Performance and ToDo Cards - Side by Side at Top */}
      <Grid container spacing={3} sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 }, mb: 3 }}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <ProgressCard
            progress={progress}
            goals={goals}
            setGoalTableDialogOpen={setGoalTableDialogOpen}
            setAddGoalDialogOpen={setAddGoalDialogOpen}
          />
        </Grid>
        <Grid 
          sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
          ref={rightCardRef}
        >
          <ToDoCard
            toDoItems={toDoItems}
            handleAddToDo={handleAddToDo}
            handleEditToDo={handleEditToDo}
            handleDeleteToDo={handleDeleteToDo}
            handleUpdateToDo={handleUpdateToDo}
            handleToggleToDo={handleToggleToDo}
            addDialogOpen={addDialogOpen}
            setAddDialogOpen={setAddDialogOpen}
            editDialogOpen={editDialogOpen}
            setEditDialogOpen={setEditDialogOpen}
            editTodo={editTodo}
            tableDialogOpen={tableDialogOpen}
            setTableDialogOpen={setTableDialogOpen}
          />
        </Grid>
      </Grid>

      {/* Quick Actions Tools - Full Width Below */}
      <Grid container spacing={3} sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 }, mb: 3 }}>
        <Grid sx={{ gridColumn: { xs: 'span 12' } }}>
          <PerformanceAnalyticsCard />
        </Grid>
      </Grid>

      {/* Events and Star Points Cards - Side by Side */}
      <Grid container spacing={3} sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 }, mb: 3 }}>
        <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 9' } }}>
          <EventsCard 
            events={demoEventsState} 
            onViewAll={() => router.push('/events')}
          />
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 3' } }}>
          <StarPointsCard starPoints={starPoints} starDialogOpen={starDialogOpen} setStarDialogOpen={setStarDialogOpen} />
        </Grid>
      </Grid>

      {/* Meetings History Card - Full Width */}
      <Grid container spacing={3} sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 }, mb: 3 }}>
        <Grid sx={{ gridColumn: { xs: 'span 12' } }}>
          <MeetingsHistoryCard onScheduleMeeting={() => setScheduleMeetingOpen(true)} />
        </Grid>
      </Grid>

      {/* Goal Dialogs */}
      <GoalTableDialog 
        open={goalTableDialogOpen} 
        onClose={() => setGoalTableDialogOpen(false)} 
        goals={goals} 
        setGoals={setGoals}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoal}
        onUpdateGoal={handleUpdateGoal}
      />
      <AddGoalDialog 
        open={addGoalDialogOpen} 
        onClose={() => setAddGoalDialogOpen(false)} 
        onAdd={handleAddGoal}
        onUpdate={handleUpdateGoal}
        goal={null}
      />
      
      {/* Edit Goal Dialog */}
      <AddGoalDialog 
        open={editGoalDialogOpen} 
        onClose={() => {
          setEditGoalDialogOpen(false);
          setEditGoal(null);
        }} 
        onAdd={handleAddGoal}
        onUpdate={handleUpdateGoal}
        goal={editGoal}
      />

      {/* Schedule Meeting Dialog */}
      <ScheduleMeetingDialog 
        open={scheduleMeetingOpen} 
        onClose={() => setScheduleMeetingOpen(false)} 
      />
      
      {/* User Data Status Component */}
      <UserDataStatus />
    </Box>
  );
};

function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => {
    let start = display;
    let end = value;
    if (start === end) return;
    let raf;
    const step = () => {
      start += (end - start) / 8;
      if (Math.abs(end - start) < 1) {
        setDisplay(end);
        return;
      }
      setDisplay(Math.round(start));
      raf = requestAnimationFrame(step);
    };
    step();
    return () => raf && cancelAnimationFrame(raf);
  }, [value]);
  return <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'var(--font-poppins)' }}>{hasMounted ? Math.round(display) : value}%</Typography>;
}

function WaterFill({ progress }) {
  const [level, setLevel] = useState(progress);
  const [waveOffset, setWaveOffset] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => {
    let frame;
    const animate = () => {
      setLevel(prev => (Math.abs(prev - progress) < 1 ? progress : prev + (progress - prev) / 8));
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => frame && cancelAnimationFrame(frame);
  }, [progress]);
  useEffect(() => {
    let raf;
    const animateWave = () => {
      setWaveOffset(prev => (prev + 2) % 400);
      raf = requestAnimationFrame(animateWave);
    };
    animateWave();
    return () => raf && cancelAnimationFrame(raf);
  }, []);
  const height = `${level}%`;
  const wavePath = `M0,24 Q50,${28 + 4 * Math.sin((waveOffset + 0) * 0.03)} 100,24 T200,24 T300,24 T400,24 V32 H0 Z`;
  if (!hasMounted) {
    // Render static fill for SSR
    return (
      <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${progress}%`, zIndex: 1, pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <svg width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" style={{ position: 'absolute', top: -16, left: 0, width: '100%', height: 32 }}>
          <defs><linearGradient id="pinkWaterGradient" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#ff80ab" /><stop offset="100%" stopColor="#ffd6e0" /></linearGradient></defs>
          <path d="M0,24 Q50,32 100,24 T200,24 T300,24 T400,24 V32 H0 Z" fill="url(#pinkWaterGradient)" opacity="0.7" />
        </svg>
        <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(0deg, #ff80ab 0%, #ffd6e0 100%)', opacity: 0.18 }} />
      </Box>
    );
  }
  return (
    <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height, zIndex: 1, transition: 'height 1s cubic-bezier(.4,2,.6,1)', pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
      <svg width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" style={{ position: 'absolute', top: -16, left: 0, width: '100%', height: 32 }}>
        <defs><linearGradient id="pinkWaterGradient" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#ff80ab" /><stop offset="100%" stopColor="#ffd6e0" /></linearGradient></defs>
        <path d={wavePath} fill="url(#pinkWaterGradient)" opacity="0.7" />
      </svg>
      <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(0deg, #ff80ab 0%, #ffd6e0 100%)', opacity: 0.18 }} />
    </Box>
  );
}

function StarDetailsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Star Points Details
        <IconButton onClick={onClose} size="small" sx={{ ml: 2 }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ fontFamily: 'var(--font-lexend)', color: 'text.secondary', pt: 1 }}>
        <Typography variant="text" sx={{ mb: 2 }}><b>What are Star Points?</b><br />Star Points are special recognitions awarded by admins for outstanding performance, teamwork, or going above and beyond in your role.</Typography>
        <Typography variant="text" sx={{ mb: 2 }}><b>How do I earn more?</b><br />Admins can add stars to your profile when you achieve something exceptional. Keep striving for excellence!</Typography>
        <Typography variant="text" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>Rewards you can unlock:</Typography>
        <Box component="ul" sx={{ pl: 3, m: 0, color: 'text.secondary', fontFamily: 'var(--font-lexend)', fontSize: '1rem' }}>
          <li>1 star: Bronze badge</li>
          <li>3 stars: Gift card</li>
          <li>5 stars: Extra day off</li>
          <li>10 stars: Platinum recognition & special reward</li>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Dashboard;
