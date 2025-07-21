"use client";

import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";
import WeeklyTimeEntries from "./WeeklyTimeEntries";
import DailyTimeEntry from "./DailyTimeEntry";

export default function UpdateTimesheet() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState(0);
  
  // Daily entries for each day of the week
  const [dailyEntries, setDailyEntries] = useState({});
  const [totalHours, setTotalHours] = useState({ regular: 0, overtime: 0 });

  // Daily entry for single day
  const [dailyEntry, setDailyEntry] = useState({
    workMode: "",
    activity: "",
    hours: ""
  });
  const [dailyOvertime, setDailyOvertime] = useState(0);

  // Calculate total hours and overtime
  useEffect(() => {
    let regular = 0;
    let overtime = 0;
    
    Object.values(dailyEntries).forEach(entry => {
      const numHours = parseFloat(entry.hours) || 0;
      if (numHours > 8) {
        regular += 8;
        overtime += (numHours - 8);
      } else {
        regular += numHours;
      }
    });
    
    setTotalHours({
      regular: regular.toFixed(2),
      overtime: overtime.toFixed(2)
    });
  }, [dailyEntries]);

  // Calculate daily overtime
  useEffect(() => {
    const numHours = parseFloat(dailyEntry.hours) || 0;
    if (numHours > 8) {
      setDailyOvertime((numHours - 8).toFixed(2));
    } else {
      setDailyOvertime(0);
    }
  }, [dailyEntry.hours]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ text: "Timesheet submitted successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      
      // Reset form
      if (activeTab === 0) {
        setDailyEntries({});
      } else {
        setDailyEntry({ workMode: "", activity: "", hours: "" });
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      setMessage({ text: "Error submitting timesheet. Please try again.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (activeTab === 0) {
      setDailyEntries({});
    } else {
      setDailyEntry({ workMode: "", activity: "", hours: "" });
    }
    setMessage({ text: "Form reset successfully", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Weekly Time Entries" />
          <Tab label="Daily Time Entry" />
        </Tabs>
      </Box>

      {/* Weekly Time Entries Tab */}
      {activeTab === 0 && (
        <WeeklyTimeEntries
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dailyEntries={dailyEntries}
          setDailyEntries={setDailyEntries}
          totalHours={totalHours}
          message={message}
          setMessage={setMessage}
          loading={loading}
        />
      )}

      {/* Daily Time Entry Tab */}
      {activeTab === 1 && (
        <DailyTimeEntry
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dailyEntry={dailyEntry}
          setDailyEntry={setDailyEntry}
          dailyOvertime={dailyOvertime}
          message={message}
          setMessage={setMessage}
          loading={loading}
        />
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-end' },
          pb: 2,
          gap: 2,
        }}
      >
        <Button
          color="text.primary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>

      <Snackbar
        open={!!message.text}
        autoHideDuration={3000}
        onClose={() => setMessage({ text: "", type: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setMessage({ text: "", type: "" })} 
          severity={message.type}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Paper>
  );
} 