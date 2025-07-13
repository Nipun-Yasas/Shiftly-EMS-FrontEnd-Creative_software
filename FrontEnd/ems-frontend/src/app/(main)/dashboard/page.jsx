
"use client";

import { 
  Paper, 
  CircularProgress, 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Checkbox,
  TextField,
  Grow,
  Fade,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from "react";
import { getDashboardCalendarData, getCurrentMonthCalendar } from "../../_utils/calendarService";
import AddToDoDialog from './AddToDoDialog';
import ToDoTableDialog from './ToDoTableDialog';
import AddGoalDialog from './AddGoalDialog';
import GoalTableDialog from './GoalTableDialog';
import dayjs from 'dayjs';
import { TrendingUp, Edit, Delete, ChevronLeft, ChevronRight, Person, Event, CheckCircle, EmojiEvents, Add, Star } from "@mui/icons-material";
import GreetingHeader from './_components/GreetingHeader';
import ProgressCard from './_components/ProgressCard';
import ToDoCard from './_components/ToDoCard';
import CalendarEventsCard from './_components/CalendarEventsCard';
import EventsList from './_components/EventsList';
import StarPointsCard from './_components/StarPointsCard';
import { getGreeting, getPriorityColor, getEventTypeColor } from './_components/dashboardUtils';
import { useRouter } from 'next/navigation';

// Note: Ensure --font-poppins and --font-lexend are defined in global CSS

// Static initial data to avoid SSR/client mismatch
const initialToDoItems = [
  { id: 1, text: "Complete this project by Jul 21, 2025", completed: false, highlighted: true, priority: "high" },
  { id: 2, text: "Latest finished to do: Complete this project by Jul 21, 2025", completed: true, highlighted: false, priority: "medium" },
  { id: 3, text: "Complete this project by Jul 21, 2025", completed: false, highlighted: false, priority: "low" },
  { id: 4, text: "Complete this project by Jul 21, 2025", completed: false, highlighted: false, priority: "medium" },
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

// FlipDigit component for flip clock animation
const FlipDigit = ({ value }) => {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (value !== prev) {
      setFlipping(true);
      const timeout = setTimeout(() => {
        setFlipping(false);
        setPrev(value);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [value, prev]);
  return (
    <span className={`flip-digit${flipping ? ' flipping' : ''}`} style={{ display: 'inline-block', minWidth: 24, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
      <span className="flip-digit-top">{prev}</span>
      <span className="flip-digit-bottom">{value}</span>
      <style>{`
        .flip-digit { position: relative; perspective: 80px; }
        .flip-digit-top, .flip-digit-bottom { display: block; font-size: 1.18em; font-weight: 900; color: inherit; background: none; border-radius: 4px; line-height: 1.1; }
        .flip-digit-top { z-index: 2; background: none; }
        .flip-digit-bottom { position: absolute; top: 0; left: 0; right: 0; z-index: 1; background: none; transform: rotateX(90deg); opacity: 0; }
        .flip-digit.flipping .flip-digit-top { animation: flipTop 0.3s forwards; }
        .flip-digit.flipping .flip-digit-bottom { animation: flipBottom 0.3s 0.3s forwards; }
        @keyframes flipTop { 0% { transform: rotateX(0); } 100% { transform: rotateX(-90deg); opacity: 0; } }
        @keyframes flipBottom { 0% { transform: rotateX(90deg); opacity: 0; } 100% { transform: rotateX(0); opacity: 1; } }
      `}</style>
    </span>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const router = useRouter();
  const [progress, setProgress] = useState(75); // Initial static value
  const [starPoints, setStarPoints] = useState(1); // Initial static value
  const [toDoItems, setToDoItems] = useState(initialToDoItems);
  const [goals, setGoals] = useState(initialGoals);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [addGoalDialogOpen, setAddGoalDialogOpen] = useState(false);
  const [goalTableDialogOpen, setGoalTableDialogOpen] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editGoalDialogOpen, setEditGoalDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState('all');
  const [quickAddValue, setQuickAddValue] = useState('');
  const motivationalQuote = "The only way to do great work is to love what you do. - Steve Jobs";
  const rightCardRef = useRef(null);
  const [cardRight, setCardRight] = useState(null); // Initialize as null
  const [starDialogOpen, setStarDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(null); // null for SSR, set after mount
  const [goalStreak, setGoalStreak] = useState(0);

  // Handlers (unchanged)
  const handleAddToDo = (todo) => setToDoItems(prev => [todo, ...prev]);
  const handleDeleteToDo = (id) => setToDoItems(prev => prev.filter(t => t.id !== id));
  const handleEditToDo = (todo) => { setEditTodo(todo); setEditDialogOpen(true); };
  const handleUpdateToDo = (updated) => setToDoItems(prev => prev.map(t => t.id === updated.id ? updated : t));

  const handleAddGoal = (goal) => setGoals(prev => [goal, ...prev]);
  const handleDeleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));
  const handleEditGoal = (goal) => { setEditGoal(goal); setEditGoalDialogOpen(true); };
  const handleUpdateGoal = (updated) => {
    setGoals(prev => prev.map(g => {
      if (g.id === updated.id) {
        if (updated.completed && !g.completedAt) return { ...updated, completedAt: dayjs().toISOString() };
        if (!updated.completed) {
          const { completedAt, ...rest } = updated;
          return rest;
        }
        return updated;
      }
      return g;
    }));
  };

  const handleToggleEvent = (eventId) => {
    setDemoEvents(prev => prev.map(event => event.id === eventId ? { ...event, joined: !event.joined } : event));
  };

  // Calculate progress based on goals
  useEffect(() => {
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    setProgress(totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0);
  }, [goals]);

  // Update calendar and events
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const [scheduleData, calendarInfo] = await Promise.all([
          getDashboardCalendarData(startOfMonth, endOfMonth),
          getCurrentMonthCalendar(currentYear, currentMonth)
        ]);
        setSchedule(scheduleData || {});
        setCalendarData(calendarInfo || { calendarDays: [] });
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
        setSchedule({});
        setCalendarData({ calendarDays: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarData();

    const refreshInterval = setInterval(fetchCalendarData, 1800000);
    return () => { clearInterval(refreshInterval); };
  }, [currentMonth, currentYear]);

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? (setCurrentYear(y => y - 1), 11) : prev - 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? (setCurrentYear(y => y + 1), 0) : prev + 1));
  };

  // Remove local starPoints increment; should only be updated by backend/admin

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

  const [demoEventsState, setDemoEvents] = useState(demoEvents);

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
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <GreetingHeader greeting={greeting} />
      <Grid container spacing={3} sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Grid item xs={12} md={6}>
          <ProgressCard
            progress={progress}
            goals={goals}
            setGoalTableDialogOpen={setGoalTableDialogOpen}
            setAddGoalDialogOpen={setAddGoalDialogOpen}
          />
        </Grid>
        <Grid item xs={12} md={12} ref={rightCardRef}>
          <ToDoCard
            toDoItems={toDoItems}
            handleAddToDo={handleAddToDo}
            handleEditToDo={handleEditToDo}
            handleDeleteToDo={handleDeleteToDo}
            handleUpdateToDo={handleUpdateToDo}
            addDialogOpen={addDialogOpen}
            setAddDialogOpen={setAddDialogOpen}
            editDialogOpen={editDialogOpen}
            setEditDialogOpen={setEditDialogOpen}
            editTodo={editTodo}
            tableDialogOpen={tableDialogOpen}
            setTableDialogOpen={setTableDialogOpen}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CalendarEventsCard
            currentMonth={currentMonth}
            currentYear={currentYear}
            loading={loading}
            calendarData={calendarData}
            schedule={schedule}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            getEventTypeColor={type => getEventTypeColor(type, useTheme())}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={9}>
          <Typography variant="h6" sx={{ mb: 3, fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'text.primary' }}>Events</Typography>
          <EventsList demoEventsState={demoEventsState} handleToggleEvent={handleToggleEvent} />
        </Grid>
        <Grid item xs={12} lg={3}>
          <StarPointsCard starPoints={starPoints} starDialogOpen={starDialogOpen} setStarDialogOpen={setStarDialogOpen} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: 'grey.300', 
            color: 'text.primary', 
            bgcolor: 'transparent',
            fontWeight: 700,
            fontFamily: 'var(--font-lexend)',
            borderRadius: 2, 
            px: 3, 
            transition: 'all 0.2s',
            boxShadow: 0,
            '&:hover': { 
              borderColor: 'primary.main', 
              bgcolor: 'primary.main', 
              color: '#fff',
              boxShadow: 2,
              transform: 'scale(1.04)'
            }
          }}
          onClick={() => router.push('/leave/request-leave')}
        >
          Apply for Leave
        </Button>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: 'grey.300', 
            color: 'text.primary', 
            bgcolor: 'transparent',
            fontWeight: 700,
            fontFamily: 'var(--font-lexend)',
            borderRadius: 2, 
            px: 3, 
            transition: 'all 0.2s',
            boxShadow: 0,
            '&:hover': { 
              borderColor: 'primary.main', 
              bgcolor: 'primary.main', 
              color: '#fff',
              boxShadow: 2,
              transform: 'scale(1.04)'
            }
          }}
          onClick={() => router.push('/refer')}
        >
          Take Appraisal
        </Button>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: 'grey.300', 
            color: 'text.primary', 
            bgcolor: 'transparent',
            fontWeight: 700,
            fontFamily: 'var(--font-lexend)',
            borderRadius: 2, 
            px: 3, 
            transition: 'all 0.2s',
            boxShadow: 0,
            '&:hover': { 
              borderColor: 'primary.main', 
              bgcolor: 'primary.main', 
              color: '#fff',
              boxShadow: 2,
              transform: 'scale(1.04)'
            }
          }}
          onClick={() => router.push('/employee/profile')}
        >
          Update Profile
        </Button>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: 'grey.300', 
            color: 'text.primary', 
            bgcolor: 'transparent',
            fontWeight: 700,
            fontFamily: 'var(--font-lexend)',
            borderRadius: 2, 
            px: 3, 
            transition: 'all 0.2s',
            boxShadow: 0,
            '&:hover': { 
              borderColor: 'primary.main', 
              bgcolor: 'primary.main', 
              color: '#fff',
              boxShadow: 2,
              transform: 'scale(1.04)'
            }
          }}
          onClick={() => router.push('/events/add-event')}
        >
          EVENTS
        </Button>
      </Box>

      {/* Goal Dialogs */}
      <GoalTableDialog 
        open={goalTableDialogOpen} 
        onClose={() => setGoalTableDialogOpen(false)} 
        goals={goals} 
        setGoals={setGoals} 
      />
      <AddGoalDialog 
        open={addGoalDialogOpen} 
        onClose={() => setAddGoalDialogOpen(false)} 
        onAdd={handleAddGoal} 
      />
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
        <Typography variant="body1" sx={{ mb: 2 }}><b>What are Star Points?</b><br />Star Points are special recognitions awarded by admins for outstanding performance, teamwork, or going above and beyond in your role.</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}><b>How do I earn more?</b><br />Admins can add stars to your profile when you achieve something exceptional. Keep striving for excellence!</Typography>
        <Typography variant="body1" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>Rewards you can unlock:</Typography>
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
