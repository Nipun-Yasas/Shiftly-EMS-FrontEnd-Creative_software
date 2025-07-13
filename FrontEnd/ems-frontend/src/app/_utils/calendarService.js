import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';

// Fallback mock data for development
const mockEvents = [
  {
    id: 1,
    title: "UI/UX Designer Practical Task Review",
    start: new Date(new Date().setHours(9, 30, 0, 0)),
    end: new Date(new Date().setHours(10, 30, 0, 0)),
    type: "interview",
    location: "Meeting Room A",
    description: "Review practical task for UI/UX Designer position"
  },
  {
    id: 2,
    title: "Magento Developer Resume Review",
    start: new Date(new Date().setHours(12, 0, 0, 0)),
    end: new Date(new Date().setHours(13, 0, 0, 0)),
    type: "review",
    location: "Conference Room",
    description: "Review resume for Magento Developer position"
  },
  {
    id: 3,
    title: "Sales Manager Final HR Round",
    start: new Date(new Date().setHours(13, 0, 0, 0)),
    end: new Date(new Date().setHours(14, 0, 0, 0)),
    type: "meeting",
    location: "HR Office",
    description: "Final HR round for Sales Manager position"
  },
  {
    id: 4,
    title: "Front end Developer Practical Task Review React JS",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: "interview",
    location: "Development Lab",
    description: "Review React JS practical task"
  },
  {
    id: 5,
    title: "TL Meeting",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: "meeting",
    location: "Team Room",
    description: "Team Lead meeting"
  }
];

// Helper function to get events for a specific date
const getEventsForDate = (date, events) => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return events.filter(event => {
    const eventDate = new Date(event.start);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === targetDate.getTime();
  });
};

// Helper function to get events for a date range
const getEventsForDateRange = (startDate, endDate, events) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  
  return events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate >= start && eventDate <= end;
  });
};

// Get calendar events from API or fallback to mock data
export const fetchCalendarEvents = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(API_PATHS.CALENDAR.GET_EVENTS, {
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
    return response.data;
  } catch (error) {
    console.warn('Calendar API not available, using mock data:', error.message);
    // Return mock data filtered for the date range
    return getEventsForDateRange(startDate, endDate, mockEvents);
  }
};

// Get events for current month
export const fetchMonthEvents = async (year, month) => {
  try {
    const response = await axiosInstance.get(API_PATHS.CALENDAR.GET_MONTH_EVENTS, {
      params: { year, month }
    });
    return response.data;
  } catch (error) {
    console.warn('Calendar API not available, using mock data:', error.message);
    // Filter mock events for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return getEventsForDateRange(startDate, endDate, mockEvents);
  }
};

// Get upcoming events
export const fetchUpcomingEvents = async (limit = 5) => {
  try {
    const response = await axiosInstance.get(API_PATHS.CALENDAR.GET_UPCOMING_EVENTS, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Calendar API not available, using mock data:', error.message);
    // Return upcoming events from mock data
    const now = new Date();
    const upcoming = mockEvents
      .filter(event => new Date(event.start) > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, limit);
    return upcoming;
  }
};

// Add new event
export const addCalendarEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.CALENDAR.ADD_EVENT, eventData);
    return response.data;
  } catch (error) {
    console.error('Failed to add calendar event:', error);
    throw error;
  }
};

// Update existing event
export const updateCalendarEvent = async (eventId, eventData) => {
  try {
    const response = await axiosInstance.put(`${API_PATHS.CALENDAR.UPDATE_EVENT}/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Failed to update calendar event:', error);
    throw error;
  }
};

// Delete event
export const deleteCalendarEvent = async (eventId) => {
  try {
    await axiosInstance.delete(`${API_PATHS.CALENDAR.DELETE_EVENT}/${eventId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete calendar event:', error);
    throw error;
  }
};

// Get calendar data for dashboard
export const getDashboardCalendarData = async () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  try {
    const events = await fetchCalendarEvents(startOfMonth, endOfMonth);
    
    // Group events by date
    const eventsByDate = {};
    events.forEach(event => {
      const dateKey = new Date(event.start).toLocaleDateString("en-US", { 
        weekday: "long", 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      });
      
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      
      eventsByDate[dateKey].push({
        time: new Date(event.start).toLocaleTimeString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        title: event.title,
        type: event.type,
        location: event.location,
        description: event.description
      });
    });
    
    return eventsByDate;
  } catch (error) {
    console.error('Failed to fetch dashboard calendar data:', error);
    // Return mock data as fallback
    const mockData = {};
    mockEvents.forEach(event => {
      const dateKey = new Date(event.start).toLocaleDateString("en-US", { 
        weekday: "long", 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      });
      
      if (!mockData[dateKey]) {
        mockData[dateKey] = [];
      }
      
      mockData[dateKey].push({
        time: new Date(event.start).toLocaleTimeString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        title: event.title,
        type: event.type,
        location: event.location,
        description: event.description
      });
    });
    
    return mockData;
  }
};

// Get current month calendar grid data
export const getCurrentMonthCalendar = (year, month) => {
  const today = new Date();
  const currentYear = typeof year === 'number' ? year : today.getFullYear();
  const currentMonth = typeof month === 'number' ? month : today.getMonth();
  const currentDate = today.getDate();

  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Create calendar grid - always 42 cells (6 rows × 7 columns)
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false });
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ 
      day, 
      isCurrentMonth: true,
      isToday: day === currentDate && currentMonth === today.getMonth() && currentYear === today.getFullYear()
    });
  }

  // Fill remaining cells to complete 6 rows (42 total cells)
  const totalCells = 42;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false });
  }

  return {
    year: currentYear,
    month: currentMonth + 1,
    monthName: new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long" }),
    calendarDays,
    currentDate
  };
}; 