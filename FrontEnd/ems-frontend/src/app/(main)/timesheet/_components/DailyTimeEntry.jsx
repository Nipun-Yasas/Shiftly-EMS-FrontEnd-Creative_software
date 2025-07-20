"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

export default function DailyTimeEntry({ 
  selectedDate, 
  setSelectedDate, 
  dailyEntry, 
  setDailyEntry, 
  dailyOvertime, 
  message, 
  setMessage, 
  loading 
}) {
  const theme = useTheme();
  const workModes = ["Online", "On-site", "Hybrid"];

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setDailyEntry({ workMode: "", activity: "", hours: "" }); // Reset entries for new day
  };

  const handleWorkModeChange = (value) => {
    setDailyEntry(prev => ({
      ...prev,
      workMode: value
    }));
  };

  const handleActivityChange = (value) => {
    setDailyEntry(prev => ({
      ...prev,
      activity: value
    }));
  };

  const handleTimeChange = (value) => {
    // Allow empty string, numbers, and single decimal point
    if (value === '') {
      setDailyEntry(prev => ({
        ...prev,
        hours: ''
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

    setDailyEntry(prev => ({
      ...prev,
      hours: value
    }));
  };

  const handleTimeBlur = (value) => {
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
        setDailyEntry(prev => ({
          ...prev,
          hours: numValue.toFixed(2)
        }));
      }
    }
  };

  return (
    <>
      {/* Day Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Daily Time Entry
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} size="small" sx={{ width: 200 }} />}
          />
        </LocalizationProvider>
      </Box>

      {/* Daily Entry Form */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width: 150 }}>
              <InputLabel>Work Mode</InputLabel>
              <Select
                value={dailyEntry.workMode}
                onChange={(e) => handleWorkModeChange(e.target.value)}
                label="Work Mode"
              >
                <MenuItem value="">Select mode</MenuItem>
                {workModes.map(mode => (
                  <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <TextField
              multiline
              rows={2}
              maxRows={4}
              label="Activity (Brief Description)"
              value={dailyEntry.activity}
              onChange={(e) => handleActivityChange(e.target.value)}
              placeholder="Enter activity description"
              sx={{
                width: Math.min(200 + (dailyEntry.activity?.length || 0) * 8, 400),
                minWidth: 200,
                maxWidth: 400,
                transition: 'width 0.3s ease'
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Hours"
              value={dailyEntry.hours}
              onChange={(e) => handleTimeChange(e.target.value)}
              onBlur={(e) => handleTimeBlur(e.target.value)}
              placeholder="0.00"
              inputProps={{
                maxLength: 5,
                style: { textAlign: 'center' }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Daily Summary */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 2, 
          backgroundColor: 'transparent',
          borderRadius: 1 
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Daily Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Date: <strong>{selectedDate.format('MMM DD, YYYY (dddd)')}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Regular Hours: <strong>{parseFloat(dailyEntry.hours || 0) > 8 ? '8.00' : (dailyEntry.hours || '0.00')}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Overtime Hours: <strong style={{ color: '#f57c00' }}>{dailyOvertime}</strong>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
} 