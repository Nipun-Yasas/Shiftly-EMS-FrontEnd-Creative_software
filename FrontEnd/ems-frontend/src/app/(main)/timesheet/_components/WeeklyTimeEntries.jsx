"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

export default function WeeklyTimeEntries({ 
  selectedDate, 
  setSelectedDate, 
  dailyEntries, 
  setDailyEntries, 
  totalHours, 
  message, 
  setMessage, 
  loading 
}) {
  const theme = useTheme();
  const [weekDays, setWeekDays] = useState([]);
  const [leaveDays, setLeaveDays] = useState([]);

  const workModes = ["Online", "On-site", "Hybrid"];

  // Calculate week days (Monday to Sunday) based on selected date
  useEffect(() => {
    const calculateWeekDays = () => {
      const monday = selectedDate.startOf('week').add(1, 'day'); // Monday
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        const day = monday.add(i, 'day');
        const dateKey = day.format('YYYY-MM-DD');
        days.push({
          date: day,
          dateKey: dateKey,
          display: day.format('DD / ddd'),
          dayName: day.format('dddd'),
          isWeekend: day.day() === 0 || day.day() === 6, // Sunday or Saturday
          isLeaveDay: false, // Will be fetched from backend
          workMode: dailyEntries[dateKey]?.workMode || "",
          activity: dailyEntries[dateKey]?.activity || "",
          hours: dailyEntries[dateKey]?.hours || ""
        });
      }
      
      setWeekDays(days);
    };

    calculateWeekDays();
  }, [selectedDate, dailyEntries]);

  // Fetch leave days from backend
  useEffect(() => {
    const fetchLeaveDays = async () => {
      try {
        // Mock API call - replace with actual backend call
        const mockLeaveDays = [
          selectedDate.startOf('week').add(3, 'day').format('YYYY-MM-DD'), // Thursday
        ];
        setLeaveDays(mockLeaveDays);
        
        // Update weekDays with leave day information
        setWeekDays(prev => prev.map(day => ({
          ...day,
          isLeaveDay: mockLeaveDays.includes(day.dateKey)
        })));
      } catch (error) {
        console.error("Error fetching leave days:", error);
      }
    };

    fetchLeaveDays();
  }, [selectedDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setDailyEntries({}); // Reset entries for new week
  };

  const handlePreviousWeek = () => {
    setSelectedDate(prev => prev.subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => prev.add(1, 'week'));
  };

  const handleWorkModeChange = (dateKey, value) => {
    setDailyEntries(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        workMode: value
      }
    }));
  };

  const handleActivityChange = (dateKey, value) => {
    setDailyEntries(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        activity: value
      }
    }));
  };

  const handleTimeChange = (dateKey, value) => {
    // Allow empty string, numbers, and single decimal point
    if (value === '') {
      setDailyEntries(prev => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          hours: ''
        }
      }));
      return;
    }

    // Check if it's a valid number format (including decimals)
    const isValidFormat = /^\d*\.?\d*$/.test(value);
    if (!isValidFormat) {
      return; // Don't update if invalid format
    }

    // Check if it's within the allowed range (4-15 hours)
    const numValue = parseFloat(value);
    if (numValue > 15) {
      return; // Don't allow more than 15 hours
    }

    // Allow the input as-is for better UX
    setDailyEntries(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        hours: value
      }
    }));
  };

  // Format hours on blur to ensure proper decimal format and validate range
  const handleTimeBlur = (dateKey, value) => {
    if (value && value !== '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // Check minimum hours (4 hours)
        if (numValue < 4) {
          setMessage({ text: "Minimum hours per day is 4 hours", type: "warning" });
          setTimeout(() => setMessage({ text: "", type: "" }), 3000);
          return;
        }
        
        // Check maximum hours (15 hours)
        if (numValue > 15) {
          setMessage({ text: "Maximum hours per day is 15 hours", type: "warning" });
          setTimeout(() => setMessage({ text: "", type: "" }), 3000);
          return;
        }
        
        // Format to 2 decimal places
        setDailyEntries(prev => ({
          ...prev,
          [dateKey]: {
            ...prev[dateKey],
            hours: numValue.toFixed(2)
          }
        }));
      }
    }
  };

  const getDayCellColor = (day) => {
    if (day.isLeaveDay) return theme.palette.error.light;
    if (day.isWeekend) return 'rgba(76, 175, 80, 0.2)'; // Reduced opacity green
    return 'transparent';
  };

  const getHoverColor = (day) => {
    if (day.isLeaveDay) return theme.palette.error.light;
    if (day.isWeekend) return theme.palette.success.light;
    return theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.grey[50];
  };

  return (
    <>
      {/* Week Navigation */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={handlePreviousWeek} disabled={loading}>
            <ChevronLeftIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Week of {selectedDate.startOf('week').add(1, 'day').format('MMM DD')} - {selectedDate.startOf('week').add(7, 'day').format('MMM DD, YYYY')}
          </Typography>
          
          <IconButton onClick={handleNextWeek} disabled={loading}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Week"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} size="small" sx={{ width: 200 }} />}
          />
        </LocalizationProvider>
      </Box>

      {/* Weekly Time Entries Table */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Weekly Time Entries
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : theme.palette.grey[100] 
              }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Day</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Work Mode</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Activity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hours (4-15)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weekDays.map((day) => (
                <TableRow 
                  key={day.dateKey}
                  sx={{ 
                    backgroundColor: getDayCellColor(day),
                    '&:hover': { 
                      backgroundColor: getHoverColor(day),
                      transition: 'background-color 0.2s ease'
                    }
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {day.display}
                      </Typography>
                      {day.isWeekend && (
                        <Chip 
                          label="Weekend" 
                          color="success" 
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {day.isLeaveDay ? (
                      <Chip 
                        label="Leave Day" 
                        color="error" 
                        size="small"
                      />
                    ) : (
                      <FormControl fullWidth size="small">
                        <Select
                          value={day.workMode}
                          onChange={(e) => handleWorkModeChange(day.dateKey, e.target.value)}
                          displayEmpty
                          disabled={day.isLeaveDay}
                        >
                          <MenuItem value="">Select mode</MenuItem>
                          {workModes.map(mode => (
                            <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {day.isLeaveDay ? (
                      <Typography variant="body2" color="text.secondary">
                        Leave day
                      </Typography>
                    ) : (
                      <TextField
                        value={day.activity}
                        onChange={(e) => handleActivityChange(day.dateKey, e.target.value)}
                        placeholder="Enter activity"
                        size="small"
                        fullWidth
                        disabled={day.isLeaveDay}
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {day.isLeaveDay ? (
                      <Typography variant="body2" color="text.secondary">
                        0.00
                      </Typography>
                    ) : (
                      <TextField
                        value={day.hours}
                        onChange={(e) => handleTimeChange(day.dateKey, e.target.value)}
                        onBlur={(e) => handleTimeBlur(day.dateKey, e.target.value)}
                        placeholder="0.00"
                        size="small"
                        disabled={day.isLeaveDay}
                        sx={{
                          width: 120,
                          '& .MuiOutlinedInput-root': {
                            '& input': {
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }
                          }
                        }}
                        inputProps={{
                          maxLength: 5,
                          style: { textAlign: 'center' }
                        }}
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {day.isLeaveDay ? (
                      <Chip 
                        label="Leave" 
                        color="error" 
                        size="small"
                      />
                    ) : day.isWeekend ? (
                      <Chip 
                        label="Weekend" 
                        color="success" 
                        size="small"
                      />
                    ) : day.workMode && day.activity && day.hours ? (
                      <Chip 
                        label="Complete" 
                        color="success" 
                        size="small"
                      />
                    ) : (
                      <Chip 
                        label="Incomplete" 
                        color="default" 
                        size="small"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Weekly Summary */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 2, 
          backgroundColor: 'transparent',
          borderRadius: 1 
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Weekly Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Regular Hours: <strong>{totalHours.regular}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Overtime Hours: <strong style={{ color: '#f57c00' }}>{totalHours.overtime}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Total Hours: <strong>{parseFloat(totalHours.regular) + parseFloat(totalHours.overtime)}</strong>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
} 