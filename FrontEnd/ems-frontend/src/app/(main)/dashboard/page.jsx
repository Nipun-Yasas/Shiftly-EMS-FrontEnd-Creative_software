
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
  IconButton,
  useTheme
} from "@mui/material";
import { 
  TrendingUp, 
  CheckCircle, 
  Schedule, 
  Star, 
  Add,
  Edit,
  Delete,
  CalendarToday,
  Event,
  Person,
  ChevronLeft,
  ChevronRight
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getDashboardCalendarData, getCurrentMonthCalendar } from "../../_utils/calendarService";

const fetchToDoItems = () => [
  { id: 1, text: `Complete this projects ${getNextMondayDate()}`, completed: false, highlighted: true, priority: "high" },
  { id: 2, text: `Latest finished to do's Complete this projects ${getNextMondayDate()}`, completed: true, highlighted: false, priority: "medium" },
  { id: 3, text: `Complete this projects ${getNextMondayDate()}`, completed: false, highlighted: false, priority: "low" },
  { id: 4, text: `Complete this projects ${getNextMondayDate()}`, completed: false, highlighted: false, priority: "medium" },
];

const demoEvents = [
  {
    id: 1,
    title: "PUBG Tournament By Red Bull",
    date: "Jun 26 - Jun 27, 2020",
    participants: 128,
    joined: true,
    imageUrl: "/images/project1.jpg",
    category: "Gaming"
  },
  {
    id: 2,
    title: "Apex Legends Tournament By Xbox",
    date: "Jun 27 - Jun 29, 2020",
    participants: 64,
    joined: false,
    imageUrl: "/images/project2.jpg",
    category: "Gaming"
  },
  {
    id: 3,
    title: "Rocket League Finals",
    date: "Jul 01 - Jul 02, 2020",
    participants: 102,
    joined: true,
    imageUrl: "/images/project3.jpg",
    category: "Sports"
  },
  {
    id: 4,
    title: "Call of Duty: Warzone",
    date: "Jul 03 - Jul 05, 2020",
    participants: 256,
    joined: false,
    imageUrl: "/images/project4.jpg",
    category: "Gaming"
  },
];

const getNextMondayDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = (8 - dayOfWeek) % 7 || 0;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split("T")[0];
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
};

const Dashboard = () => {
  const theme = useTheme();
  const [progress, setProgress] = useState(75);
  const [starPoints, setStarPoints] = useState(15);
  const [toDoItems, setToDoItems] = useState(fetchToDoItems());
  const [schedule, setSchedule] = useState({});
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const [scheduleData, calendarInfo] = await Promise.all([
          getDashboardCalendarData(),
          getCurrentMonthCalendar()
        ]);
        setSchedule(scheduleData);
        setCalendarData(calendarInfo);
      } catch (error) {
        console.error('Failed to fetch calendar data:', error);
        // Set fallback data
        setSchedule({});
        setCalendarData(getCurrentMonthCalendar());
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + Math.floor(Math.random() * 5)));
      setStarPoints((prev) => prev + 1);
    }, 5000);

    // Refresh calendar data every 30 minutes
    const refreshInterval = setInterval(() => {
      fetchCalendarData();
    }, 1800000);

    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, []);

  const handleStarPointsClick = () => {
    setStarPoints((prev) => prev + 5);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return theme.palette.error.main;
      case "medium": return theme.palette.warning.main;
      case "low": return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "interview": return theme.palette.primary.main;
      case "meeting": return theme.palette.info.main;
      case "review": return theme.palette.warning.main;
      default: return theme.palette.grey[500];
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "interview": return <Person fontSize="small" />;
      case "meeting": return <Event fontSize="small" />;
      case "review": return <CheckCircle fontSize="small" />;
      default: return <Event fontSize="small" />;
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src="/profilePic.jpg"
            alt="Profile"
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: 'var(--font-poppins)', 
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Hello Simmons 🌞
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontFamily: 'var(--font-lexend)'
              }}
            >
              {getGreeting()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Progress Section */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontFamily: 'var(--font-poppins)',
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              My Progress
            </Typography>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <CircularProgress
                variant="determinate"
                value={progress}
                size={120}
                thickness={4}
                sx={{ color: theme.palette.primary.main }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {progress}%
                </Typography>
                <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 24 }} />
              </Box>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                color: 'text.secondary',
                fontFamily: 'var(--font-lexend)'
              }}
            >
              Showcase a visual representation of your weekly progress
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                '&:hover': { bgcolor: theme.palette.primary.dark },
                borderRadius: 2,
                px: 3
              }}
            >
              More Details
            </Button>
          </Paper>
        </Grid>

        {/* To-Do Section */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                My To Do Items
              </Typography>
              <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                <Add />
              </IconButton>
            </Box>
            
            <Chip 
              label="Latest to do's" 
              size="small" 
              icon={<TrendingUp />}
              sx={{ 
                mb: 2, 
                bgcolor: theme.palette.warning.light,
                color: theme.palette.warning.contrastText,
                fontFamily: 'var(--font-lexend)'
              }}
            />
            
            <Box sx={{ mb: 3 }}>
              {toDoItems.map((item) => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: item.highlighted ? 'action.hover' : 'transparent'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    {item.highlighted ? (
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: getPriorityColor(item.priority),
                          mr: 2 
                        }} 
                      />
                    ) : item.completed ? (
                      <CheckCircle sx={{ color: 'success.main', mr: 2, fontSize: 20 }} />
                    ) : (
                      <Box 
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          border: `2px solid ${theme.palette.grey[400]}`,
                          mr: 2 
                        }} 
                      />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? 'text.secondary' : 'text.primary',
                        fontFamily: 'var(--font-lexend)',
                        flex: 1
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Button 
              variant="outlined" 
              fullWidth
              sx={{ 
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': { 
                  borderColor: theme.palette.primary.dark,
                  bgcolor: theme.palette.primary.light + '20'
                },
                borderRadius: 2
              }}
            >
              View All + Add To Do
            </Button>
          </Paper>
        </Grid>

        {/* Schedule Section - Restructured with Calendar on Left and Details on Right */}
        <Grid item xs={12} md={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              borderRadius: 3,
              width: '100%',
              maxWidth: 3000,
              mx: 'auto',
              minWidth: 0,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'flex-start' },
              justifyContent: 'center',
              gap: { xs: 2, md: 4 },
              bgcolor: 'background.paper',
              boxShadow: 2,
            }}
          >
            <Box sx={{ flex: '0 0 auto', minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 0, md: 2 }, width: { xs: '100%', md: 'auto' } }}>
              <Box sx={{ width: '100%', maxWidth: 420, minWidth: 320 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {calendarData?.monthName}, {calendarData?.year}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <ChevronLeft fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <ChevronRight fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                {/* Calendar Header */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  bgcolor: 'background.paper',
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderBottom: 'none',
                  overflow: 'hidden',
                }}>
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <Box key={day} sx={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color: 'text.primary',
                      py: 1,
                      borderRight: `1px solid ${theme.palette.divider}`,
                      fontSize: '1rem',
                      letterSpacing: 1,
                      '&:last-child': { borderRight: 'none' },
                      background: theme.palette.action.hover,
                    }}>{day}</Box>
                  ))}
                </Box>
                {/* Calendar Days Grid */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gridTemplateRows: 'repeat(6, 1fr)',
                  border: `1px solid ${theme.palette.divider}`,
                  borderTop: 'none',
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                  background: 'background.paper',
                  minHeight: 400,
                  width: '100%',
                  mx: 'auto',
                  boxShadow: 1,
                }}>
                  {calendarData?.calendarDays.map((day, index) => (
                    <Box
                      key={index}
                      sx={{
                        aspectRatio: '1 / 1',
                        minHeight: 48,
                        maxHeight: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: (index + 1) % 7 !== 0 ? `1px solid ${theme.palette.divider}` : 'none',
                        borderBottom: index < 35 ? `1px solid ${theme.palette.divider}` : 'none',
                        bgcolor: day?.isToday ? theme.palette.primary.main : day?.isCurrentMonth ? 'background.paper' : theme.palette.action.hover,
                        color: day?.isToday ? theme.palette.primary.contrastText : day?.isCurrentMonth ? 'text.primary' : 'text.disabled',
                        fontWeight: day?.isToday ? 700 : 500,
                        fontSize: '1.1rem',
                        cursor: day?.isCurrentMonth ? 'pointer' : 'default',
                        transition: 'background 0.2s',
                        '&:hover': day?.isCurrentMonth ? {
                          bgcolor: day?.isToday ? theme.palette.primary.dark : theme.palette.action.selected,
                          color: day?.isToday ? theme.palette.primary.contrastText : theme.palette.primary.main,
                        } : {},
                        borderRadius: 0,
                        userSelect: 'none',
                      }}
                    >
                      {day?.day || ''}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            {/* Right Side - Event Details */}
            <Box sx={{ flex: 1, borderLeft: { md: `1px solid ${theme.palette.divider}` }, pl: { md: 4, xs: 0 }, width: '100%', minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 2,
                  fontFamily: 'var(--font-poppins)'
                }}
              >
                Today's Events
              </Typography>
              
              {Object.entries(schedule).length > 0 ? (
                <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
                  {Object.entries(schedule).slice(0, 3).map(([day, items]) => (
                    <Box key={day} sx={{ mb: 2 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          mb: 1,
                          fontFamily: 'var(--font-poppins)',
                          display: 'block'
                        }}
                      >
                        {day}
                      </Typography>
                      {items.map((item, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'action.hover',
                            '&:hover': {
                              bgcolor: 'action.selected'
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 6, 
                              borderRadius: '50%', 
                              bgcolor: getEventTypeColor(item.type),
                              mr: 1,
                              mt: 0.5,
                              flexShrink: 0
                            }} 
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.primary',
                                fontFamily: 'var(--font-lexend)',
                                fontWeight: 500,
                                display: 'block'
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                fontFamily: 'var(--font-lexend)',
                                display: 'block'
                              }}
                            >
                              {item.time}
                            </Typography>
                            {item.location && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: 'text.secondary',
                                  fontFamily: 'var(--font-lexend)',
                                  display: 'block'
                                }}
                              >
                                📍 {item.location}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Event sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontFamily: 'var(--font-lexend)'
                    }}
                  >
                    No events scheduled
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Events and Star Points */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Events */}
        <Grid item xs={12} lg={9}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontFamily: 'var(--font-poppins)',
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Events
          </Typography>
          <Grid container spacing={3}>
            {demoEvents.map((event) => (
              <Grid item xs={12} sm={6} key={event.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={event.imageUrl}
                    alt={event.title}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        fontFamily: 'var(--font-poppins)',
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1, 
                        color: 'text.secondary',
                        fontFamily: 'var(--font-lexend)'
                      }}
                    >
                      <strong>Date:</strong> {event.date}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        color: 'text.secondary',
                        fontFamily: 'var(--font-lexend)'
                      }}
                    >
                      <strong>Participants:</strong> {event.participants}
                    </Typography>
                    <Button
                      variant={event.joined ? "contained" : "outlined"}
                      size="small"
                      sx={{ 
                        bgcolor: event.joined ? 'success.main' : 'transparent',
                        color: event.joined ? 'success.contrastText' : 'primary.main',
                        borderColor: event.joined ? 'success.main' : 'primary.main',
                        '&:hover': {
                          bgcolor: event.joined ? 'success.dark' : theme.palette.primary.light + '20'
                        },
                        borderRadius: 2
                      }}
                      onClick={() => alert(`Joined status for ${event.title} toggled!`)}
                    >
                      {event.joined ? "Joined" : "Join"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Star Points */}
        <Grid item xs={12} lg={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              height: 'fit-content',
              textAlign: 'center'
            }}
          >
            <Star sx={{ fontSize: 48, color: theme.palette.warning.main, mb: 2 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                fontFamily: 'var(--font-poppins)',
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Star Points!
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                color: theme.palette.primary.main
              }}
            >
              {starPoints}+
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3,
                color: 'text.secondary',
                fontFamily: 'var(--font-lexend)'
              }}
            >
              Others joined the lifetime program accumsan fugue qual vospuitae corporis dignitatem.
            </Typography>
            <Button 
              variant="contained" 
              fullWidth
              onClick={handleStarPointsClick}
              sx={{ 
                bgcolor: theme.palette.primary.main,
                '&:hover': { bgcolor: theme.palette.primary.dark },
                borderRadius: 2,
                py: 1.5
              }}
            >
              Try it for free →
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: 'grey.300',
            color: 'text.primary',
            '&:hover': { 
              borderColor: 'grey.400',
              bgcolor: 'action.hover'
            },
            borderRadius: 2,
            px: 3,
            fontFamily: 'var(--font-lexend)'
          }}
        >
          Apply for Leave
        </Button>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: 'grey.300',
            color: 'text.primary',
            '&:hover': { 
              borderColor: 'grey.400',
              bgcolor: 'action.hover'
            },
            borderRadius: 2,
            px: 3,
            fontFamily: 'var(--font-lexend)'
          }}
        >
          Take Appraisal
        </Button>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: 'grey.300',
            color: 'text.primary',
            '&:hover': { 
              borderColor: 'grey.400',
              bgcolor: 'action.hover'
            },
            borderRadius: 2,
            px: 3,
            fontFamily: 'var(--font-lexend)'
          }}
        >
          Update Profile
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: theme.palette.error.main,
            color: 'white',
            '&:hover': { bgcolor: theme.palette.error.dark },
            borderRadius: 2,
            px: 3,
            fontFamily: 'var(--font-lexend)'
          }}
        >
          Events
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
